import { Integration } from '@/payload-types'

export const getUserInfo = async (integration: Integration, accessToken: string) => {
  if (integration.provider === 'google') {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const user = await response.json()
    return { accountEmail: user.email, accountId: user.localId }
  }

  if (integration.provider === 'microsoft') {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const user = await response.json()
    return { accountEmail: user.mail, accountId: user.id }
  }
  throw new Error('No user found')
}
