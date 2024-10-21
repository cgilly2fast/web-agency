import { AuthToken, User } from '@/payload-types'
import { DB_TIME_FORMAT, OAuthProvider } from '../types'
import moment from 'moment-timezone'

import configPromise from '@payload-config'
import { BasePayload, getPayload } from 'payload'
import { refreshGoogleAccessToken } from '../refresh/refreshGoogleTokens'
import { refreshMicrosoftAccessToken } from '../refresh/refreshMicrosoftToken'

export const revalidateOAuthToken = async (authToken: AuthToken, payload?: BasePayload) => {
  if (!payload) {
    payload = await getPayload({
      config: configPromise,
    })
  }

  let resp
  switch (authToken.provider) {
    case OAuthProvider.GOOGLE:
      if (!authToken.refreshToken) break

      resp = await refreshGoogleAccessToken(authToken.refreshToken)
      if (resp.success) {
        const { data } = resp
        payload.update({
          collection: 'auth-tokens',
          id: authToken.id,
          data: {
            accessToken: data.access_token,
            expiresAt: moment().add(data.expires_in, 'seconds').format(DB_TIME_FORMAT),
            refreshToken: data.refresh_token,
            scope: data.scope,
            status: 'active',
          },
        })
        break
      }

      if (resp.error !== 'invalid_grant') {
        break
      }

      payload.update({
        collection: 'auth-tokens',
        id: authToken.id,
        data: {
          accessToken: undefined,
          expiresAt: undefined,
          refreshToken: undefined,
          scope: undefined,
          status: 'disconnected',
        },
      })

    case OAuthProvider.MICROSOFT:
      if (!authToken.refreshToken) break
      resp = await refreshMicrosoftAccessToken(authToken.refreshToken)
      if (resp.success) {
        const { data } = resp
        payload.update({
          collection: 'auth-tokens',
          id: authToken.id,
          data: {
            accessToken: data.access_token,
            expiresAt: moment().add(data.expires_in, 'seconds').format(DB_TIME_FORMAT),
            scope: data.scope,
            refreshToken: data.refresh_token,
            status: 'active',
          },
        })
        break
      }

      if (resp.error !== 'invalid_grant') {
        break
      }

      payload.update({
        collection: 'auth-tokens',
        id: authToken.id,
        data: {
          accessToken: undefined,
          expiresAt: undefined,
          scope: undefined,
          refreshToken: undefined,
          status: 'disconnected',
        },
      })
  }

  return resp
}
