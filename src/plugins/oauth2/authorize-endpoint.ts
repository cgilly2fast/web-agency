import { Endpoint, PayloadHandler, PayloadRequest } from 'payload'
import { PluginTypes } from './types'
import { makeAuthorizationUrl } from '@/lib/factories/makeAuthorizationUrl'

export const createAuthorizeEndpoint = (pluginOptions: PluginTypes): Endpoint => ({
  method: 'get',
  path: pluginOptions.authorizePath || '/oauth/authorize',
  handler: async (req: PayloadRequest) => {
    const userId = req.query.userId as string | undefined | null
    const integrationId = req.query.integrationId as string | undefined | null

    const origin = req.headers.get('origin') || 'https://firmleads.io/admin/login'

    if (!userId || !integrationId) {
      return Response.redirect(origin)
    }

    const integration = await req.payload.findByID({
      collection: 'integrations',
      id: integrationId,
    })

    const stateObj = await req.payload.create({
      collection: 'oauth-states',
      data: {
        user: userId,
        integration: integrationId,
      },
    })

    const authorizeUrl = makeAuthorizationUrl(integration, stateObj.id, origin)

    return Response.redirect(authorizeUrl)
  },
})
