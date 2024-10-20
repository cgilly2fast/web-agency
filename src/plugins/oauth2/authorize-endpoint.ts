import { Endpoint, PayloadHandler, PayloadRequest } from 'payload'
import { PluginTypes } from './types'

export const createAuthorizeEndpoint = (pluginOptions: PluginTypes): Endpoint => ({
  method: 'get',
  path: pluginOptions.authorizePath || '/oauth/authorize',
  handler: async (req: PayloadRequest) => {
    const clientId = pluginOptions.clientId
    const authCollection = pluginOptions.authCollection || 'users'
    const callbackPath = pluginOptions.callbackPath || '/oauth/callback'
    const redirectUri = encodeURIComponent(
      `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/${authCollection}${callbackPath}`,
    )

    const userId = String(req.query.userId)
    const integrationId = String(req.query.integrationId)

    console.log(userId, integrationId)

    if (!userId || !integrationId) {
      const origin = req.headers.get('origin') || 'https://firmleads.io/admin/login' // How send back to their domain?
      return Response.redirect(origin)
    }

    const stateObj = await req.payload.create({
      collection: 'oauth-states',
      data: {
        user: userId,
        integration: integrationId,
      },
    })

    const integration = await req.payload.findByID({
      collection: 'integrations',
      id: integrationId,
    })
    const requiredScopes = integration.requiredScopes || []

    const state = stateObj.id
    const scope = encodeURIComponent(requiredScopes.join(' '))
    const responseType = 'code'
    const accessType = 'offline'
    const includeGrantedScopes = 'true'
    const prompt = 'select_account consent'

    const authorizeUrl = `${pluginOptions.providerAuthorizationUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=${accessType}&include_granted_scopes=${includeGrantedScopes}&prompt=${encodeURIComponent(prompt)}&state=${encodeURIComponent(state)}`

    return Response.redirect(authorizeUrl)
  },
})
