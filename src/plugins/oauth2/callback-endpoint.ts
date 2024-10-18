import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { CollectionSlug, Endpoint, generatePayloadCookie, getFieldsToSign } from 'payload'
import { PluginTypes } from './types'
import { refreshMicrosoftAccessToken } from '@/lib/refresh/refreshMicrosoftToken'
import { User } from '@/payload-types'
import { OAuthProvider } from '@/lib/types'
import { revalidateOAuthToken } from '@/lib/factories/refreshOAuthToken'

export const createCallbackEndpoint = (pluginOptions: PluginTypes): Endpoint => ({
  method: 'get',
  path: pluginOptions.callbackPath || '/oauth/callback',
  handler: async (req) => {
    try {
      const { code, state } = req.query
      if (typeof code !== 'string')
        throw new Error(`Code not in query string: ${JSON.stringify(req.query)}`)

      // /////////////////////////////////////
      // shorthands
      // /////////////////////////////////////
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
        req,
        collection: 'user-tokens',
        where: { email: { equals: userInfo.email } },
        showHiddenFields: true,
        limit: 1,
      })
      if (!snapshot || !snapshot.docs || snapshot.docs.length === 0) {
        throw Error('Only existing users can OAuth login')
      }
      let userToken = snapshot.docs[0]

      const data = await req.payload.find({
        collection: 'firms',
        where: {
          domain: {
            equals: userInfo.email.split('@')[1],
          },
        },
      })

      if (!data.docs || data.docs.length === 0) {
        throw Error('The domain of the email you are trying to login with is not a firm.')
      }

      if (subFieldName === 'microsoft' && userToken.microsoft?.refreshToken) {
        await revalidateOAuthToken(OAuthProvider.MICROSOFT, userToken.id, req.payload)
      }

      if (
        !(userToken as any)[subFieldName] ||
        !(userToken as any)[subFieldName].scope ||
        (userToken as any)[subFieldName].scope.length < tokenData.scope.length
      ) {
        let updateData: any = {
          [subFieldName]: {
            id: userInfo.sub,
            accessToken: tokenData.access_token,
            tokenType: tokenData.token_type,
            expiresIn: tokenData.expires_in,
            scope: tokenData.scope,
            refreshToken: tokenData.refresh_token,
          },
        }

        if (subFieldName === 'microsoft') {
          updateData[subFieldName].idToken = tokenData.id_token
        }

        try {
          await req.payload.update({
            req,
            collection: 'user-tokens',
            id: userToken.id,
            data: updateData,
            showHiddenFields: true,
          })
        } catch (error) {
          console.log('User Update Error:', error)
          throw error
        }
      }

      // /////////////////////////////////////
      // beforeLogin - Collection
      // /////////////////////////////////////
      let user: any = req.user
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
      try {
        fieldsToSign = getFieldsToSign({
          collectionConfig,
          email: user.email,
          user,
        })
      } catch (error) {
        console.log('getFieldsToSign', error)
        throw error
      }

      const token = jwt.sign(fieldsToSign, req.payload.secret, {
        expiresIn: collectionConfig.auth.tokenExpiration,
      })

      req.user = user

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
