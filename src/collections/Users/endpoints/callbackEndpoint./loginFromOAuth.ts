import jwt from 'jsonwebtoken'
import { User } from '@/payload-types'
import { generatePayloadCookie, getFieldsToSign, PayloadRequest } from 'payload'

export const loginFromOAuth = async (req: PayloadRequest, user: User, successRedirect: string) => {
  const collectionConfig = req.payload.collections['users'].config
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

  // /////////////////////////////////////
  // success redirect
  // /////////////////////////////////////
  return new Response(null, {
    headers: {
      'Set-Cookie': cookie,
      Location: successRedirect,
    },
    status: 302,
  })
}
