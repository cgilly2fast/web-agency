import { User } from '@/payload-types'
import { OAuthProvider } from '../types'

import configPromise from '@payload-config'
import { BasePayload, getPayload } from 'payload'
import { refreshGoogleAccessToken } from '../refresh/refreshGoogleTokens'
import { refreshMicrosoftAccessToken } from '../refresh/refreshMicrosoftToken'

export const revalidateOAuthToken = async (
  oAuthProvider: OAuthProvider,
  user: User | string,
  payload?: BasePayload,
) => {
  if (!payload) {
    payload = await getPayload({
      config: configPromise,
    })
  }

  const userId = typeof user === 'string' ? user : user.id

  const snapshot = await payload.find({
    collection: 'user-tokens',
    where: {
      user: {
        equals: userId,
      },
    },
  })

  const tokenData = snapshot.docs[0]

  let resp
  switch (oAuthProvider) {
    case OAuthProvider.GOOGLE:
      if (!tokenData?.google?.refreshToken) break

      resp = await refreshGoogleAccessToken(tokenData.google.refreshToken)
      if (resp.success) {
        const { data } = resp
        await payload.update({
          collection: 'user-tokens',
          id: tokenData.id,
          data: {
            google: {
              id: tokenData.google.id,
              accessToken: data.access_token,
              expiresIn: data.expires_in,
              refreshToken: data.refresh_token,
              scope: data.scope,
              tokenType: data.token_type,
            },
          },
        })
        break
      }

      if (resp.error !== 'invalid_grant') {
        break
      }

      await payload.update({
        collection: 'user-tokens',
        id: tokenData.id,
        data: {
          google: {
            id: tokenData.google.id,
            accessToken: undefined,
            expiresIn: undefined,
            refreshToken: undefined,
            scope: undefined,
            tokenType: undefined,
          },
        },
      })

    case OAuthProvider.MICROSOFT:
      if (!tokenData.microsoft?.refreshToken) break
      resp = await refreshMicrosoftAccessToken(tokenData.microsoft.refreshToken)
      if (resp.success) {
        const { data } = resp
        await payload.update({
          collection: 'user-tokens',
          id: tokenData.id,
          data: {
            microsoft: {
              id: tokenData.microsoft.id,
              accessToken: data.access_token,
              tokenType: data.token_type,
              expiresIn: data.expires_in,
              scope: data.scope,
              refreshToken: data.refresh_token,
              idToken: data.id_token,
            },
          },
        })
        break
      }

      if (resp.error !== 'invalid_grant') {
        break
      }

      await payload.update({
        collection: 'user-tokens',
        id: tokenData.id,
        data: {
          microsoft: {
            id: tokenData.microsoft.id,
            accessToken: undefined,
            tokenType: undefined,
            expiresIn: undefined,
            scope: undefined,
            refreshToken: undefined,
            idToken: undefined,
          },
        },
      })
  }

  return resp
}
