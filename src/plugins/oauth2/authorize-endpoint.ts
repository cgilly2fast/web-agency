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
    const additionalScopes = req.query.scopes
      ? (req.query.scopes as string).split(',').map((scope) => decodeURIComponent(scope.trim()))
      : []

    let allScopes = []
    const userId = String(req.query.userId)
    if (userId) {
      const existingScope = await pluginOptions.getExistingScope(req.payload, userId)
      allScopes = [...new Set([...existingScope, ...additionalScopes])]
    } else {
      allScopes = [...new Set([...pluginOptions.scopes, ...additionalScopes])]
    }

    const scope = encodeURIComponent(allScopes.join(' '))
    const responseType = 'code'
    const accessType = 'offline'
    const includeGrantedScopes = 'true'
    const prompt = 'select_account consent'

    const authorizeUrl = `${pluginOptions.providerAuthorizationUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&access_type=${accessType}&include_granted_scopes=${includeGrantedScopes}&prompt=${encodeURIComponent(prompt)}`

    return Response.redirect(authorizeUrl)
  },
})
