import jwt from 'jsonwebtoken'
import { CollectionSlug, Endpoint, generatePayloadCookie, getFieldsToSign } from 'payload'
import { PluginTypes } from './types'
import moment from 'moment-timezone'
import { Integration, User } from '@/payload-types'
import crypto from 'crypto'
import { refreshMicrosoftAccessToken } from '@/lib/refresh/refreshMicrosoftToken'
import { DB_TIME_FORMAT, OAuthProvider } from '@/lib/types'
import { revalidateOAuthToken } from '@/lib/factories/refreshOAuthToken'

export const createCallbackEndpoint = (pluginOptions: PluginTypes): Endpoint => ({
  method: 'get',
  path: pluginOptions.callbackPath || '/oauth/callback',
  handler: async (req) => {
    try {
      const { code, state } = req.query
      const { payload } = req
      if (typeof code !== 'string')
        throw new Error(`Code not in query string: ${JSON.stringify(req.query)}`)

      if (typeof state !== 'string' || state === '') {
        throw new Error('Invalid state, possible csrf attack.')
      }

      const oAuthState = await payload.findByID({
        collection: 'oauth-states',
        id: state,
        depth: 1,
      })

      let user = oAuthState.user as User
      const integration = oAuthState.integration as Integration
      const subFieldName = pluginOptions.subFieldName || 'sub'
      const authCollection = (pluginOptions.authCollection as CollectionSlug) || 'users'
      const collectionConfig = req.payload.collections[authCollection].config
      const callbackPath = pluginOptions.callbackPath || '/oauth/callback'
      const redirectUri = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/${authCollection}${callbackPath}`
      // const useEmailAsIdentity = pluginOptions.useEmailAsIdentity ?? false

      // /////////////////////////////////////
      // beforeOperation - Collection
      // /////////////////////////////////////
      // Not implemented

      // /////////////////////////////////////
      // obtain access token
      // /////////////////////////////////////

      const tokenResponse = await fetch(pluginOptions.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: new URLSearchParams({
          code,
          client_id: pluginOptions.clientId,
          client_secret: pluginOptions.clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }).toString(),
      })
      const tokenData = await tokenResponse.json()
      const access_token = tokenData?.access_token
      if (typeof access_token !== 'string')
        throw new Error(`No access token: ${JSON.stringify(tokenData)}`)

      const userInfo = await pluginOptions.getUserInfo(access_token)

      const snapshot = await req.payload.find({
        collection: 'auth-tokens',
        where: {
          user: { equals: user.id },
          accountEmail: { equals: userInfo.accountEmail },
          integration: {
            equals: integration,
          },
        },
        showHiddenFields: true,
        limit: 1,
      })

      if (!snapshot || !snapshot.docs || snapshot.docs.length === 0) {
        await req.payload.create({
          collection: 'auth-tokens',
          data: {
            user: user.id,
            integration,
            firm: typeof user.firm === 'string' ? user.firm : user.firm.id,
            id: userInfo.accountId,
            accessToken: tokenData.access_token,
            expiresAt: moment().add(tokenData.expires_in, 'seconds').format(DB_TIME_FORMAT),
            scope: tokenData.scope,
            refreshToken: tokenData.refresh_token,
            status: 'active',
          },
        })
      } else {
        let authToken = snapshot.docs[0]

        await req.payload.update({
          req,
          collection: 'auth-tokens',
          id: authToken.id,
          data: {
            id: userInfo.accountId,
            accessToken: tokenData.access_token,
            expiresAt: moment().add(tokenData.expires_in, 'seconds').format(DB_TIME_FORMAT),
            scope: tokenData.scope,
            refreshToken: tokenData.refresh_token,
            status: 'active',
          },
        })
      }

      // /////////////////////////////////////
      // beforeLogin - Collection
      // /////////////////////////////////////
      await collectionConfig.hooks.beforeLogin.reduce(async (priorHook, hook) => {
        await priorHook
        req.user
        user =
          (await hook({
            collection: collectionConfig,
            context: req.context,
            req,
            user: req.user,
          })) || req.user
      }, Promise.resolve())

      // /////////////////////////////////////
      // login - OAuth2
      // /////////////////////////////////////
      let fieldsToSign

      req.user = { ...user, collection: 'users' }
      try {
        fieldsToSign = getFieldsToSign({
          collectionConfig,
          email: user.email,
          user: req.user,
        })
      } catch (error) {
        console.log('getFieldsToSign', error)
        throw error
      }

      const token = jwt.sign(fieldsToSign, req.payload.secret, {
        expiresIn: collectionConfig.auth.tokenExpiration,
      })

      // /////////////////////////////////////
      // afterLogin - Collection
      // /////////////////////////////////////

      await collectionConfig.hooks.afterLogin.reduce(async (priorHook, hook) => {
        await priorHook

        user =
          (await hook({
            collection: collectionConfig,
            context: req.context,
            req,
            token,
            user,
          })) || user
      }, Promise.resolve())

      // /////////////////////////////////////
      // afterRead - Fields
      // /////////////////////////////////////
      // Not implemented

      // /////////////////////////////////////
      // generate and set cookie
      // /////////////////////////////////////
      let cookie
      try {
        cookie = generatePayloadCookie({
          collectionAuthConfig: collectionConfig.auth,
          cookiePrefix: req.payload.config.cookiePrefix,
          token,
        })
      } catch (error) {
        console.log('generatePayloadCookie', error)
        throw error
      }
      console.log('cookie', cookie)

      // /////////////////////////////////////
      // success redirect
      // /////////////////////////////////////
      return new Response(null, {
        headers: {
          'Set-Cookie': cookie,
          Location: await pluginOptions.successRedirect(req),
        },
        status: 302,
      })
    } catch (error) {
      // /////////////////////////////////////
      // failure redirect
      // /////////////////////////////////////
      console.log('Error: Callback Endpoint', error)
      return new Response(null, {
        headers: {
          'Content-Type': 'application/json',
          Location: await pluginOptions.failureRedirect(req, error),
        },
        status: 302,
      })
    }
  },
})
