import { Integration } from '@/payload-types'

export const getTokenData = async (integration: Integration, code: string) => {
  const redirectUri = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/users/oauth/callback`
  let clientId = ''
  let clientSecret = ''

  if (integration.provider === 'google') {
    clientId = process.env.GOOGLE_OAUTH_CLIENT_ID || ''
    clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET || ''
  } else if (integration.provider === 'microsoft') {
    clientId = process.env.MS_OAUTH_CLIENT_ID || ''
    clientSecret = process.env.MS_OAUTH_CLIENT_SECRET || ''
  }

  if (clientId === '' || clientSecret === '' || !integration.tokenUrl) {
    throw new Error('Cannot make call, null params')
  }
  console.log(integration.tokenUrl, {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })
  const tokenResponse = await fetch(integration.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
  })

  return await tokenResponse.json()
}
