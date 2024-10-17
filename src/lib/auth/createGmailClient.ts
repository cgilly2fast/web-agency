import { google } from 'googleapis'
import { AuthType, JWTCredentials, OAuthCredentials } from '../types'
import { serviceAccount } from '@/config'

export async function createGmailClient(authType: AuthType, oAuthCredentials?: OAuthCredentials) {
  let auth

  if (authType === AuthType.OAUTH) {
    if (!oAuthCredentials) {
      throw new Error('When passing authType === "oauth" you must pass oAuthCredentials')
    }

    const { accessToken, refreshToken, expiresIn } = oAuthCredentials
    if (!accessToken || !refreshToken || !expiresIn) {
      throw new Error('Invalid Google OAuth credentials')
    }

    auth = new google.auth.OAuth2()
    auth.setCredentials({
      access_token: oAuthCredentials.accessToken,
      refresh_token: oAuthCredentials.refreshToken,
      expiry_date: oAuthCredentials.expiresIn,
    })
  } else if (authType === AuthType.JWT) {
    const jwtCredentials: JWTCredentials = {
      clientEmail: serviceAccount.client_email!,
      privateKey: serviceAccount.private_key,
    }
    auth = new google.auth.JWT(jwtCredentials.clientEmail, undefined, jwtCredentials.privateKey, [
      'https://www.googleapis.com/auth/gmail.send',
    ])
  } else {
    throw new Error('Invalid authentication type')
  }

  return google.gmail({ version: 'v1', auth, key: process.env.FB_API_KEY! })
}
