import { Integration } from '@/payload-types'

export const makeAuthorizationUrl = (
  integration: Integration,
  stateId: string,
  onFailRedirect: string,
) => {
  let clientId = ''
  if (integration.provider === 'google') {
    clientId = process.env.GOOGLE_OAUTH_CLIENT_ID || ''
  } else if (integration.provider === 'microsoft') {
    clientId = process.env.MS_OAUTH_CLIENT_ID || ''
  }

  if (clientId === '') return onFailRedirect

  const redirectUri = encodeURIComponent(
    `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/users/callback`,
  )

  const requiredScopes = integration.requiredScopes || []
  const scope = encodeURIComponent(requiredScopes.map((scope) => scope.scope).join(' '))
  const responseType = 'code'
  const state = encodeURIComponent(stateId)

  if (integration.provider === 'google') {
    const accessType = 'offline'
    const includeGrantedScopes = 'true'
    const prompt = 'select_account consent'

    return `${integration.authorizationUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=${accessType}&include_granted_scopes=${includeGrantedScopes}&prompt=${encodeURIComponent(prompt)}&state=${state}`
  } else if (integration.provider === 'microsoft') {
    const prompt = 'select_account'

    return `${integration.authorizationUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&prompt=${prompt}&state=${state}`
  }

  return onFailRedirect
}
