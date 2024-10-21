import { makeAuthorizationUrl } from '@/lib/factories/makeAuthorizationUrl'
import { Endpoint, parseCookies } from 'payload'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import ObjectId from 'bson-objectid'

export const authorizeEndpoint: Endpoint = {
  method: 'get',
  path: '/oauth/authorize',
  handler: async ({ payload, headers, query }) => {
    const start = performance.now()
    const userId = query.userId as string | undefined | null
    const integrationId = query.integrationId as string | undefined | null

    const origin = headers.get('origin') || 'https://firmleads.io/admin/login'
    console.log(userId, integrationId, origin, headers)
    if (!integrationId) {
      return Response.redirect(origin)
    }

    const integration = await payload.findByID({
      collection: 'integrations',
      id: integrationId,
    })

    if (
      !userId &&
      integrationId !== '671430fa84ee29114c970306' &&
      integrationId !== '6714317784ee29114c9704fd'
    ) {
      return Response.redirect(origin)
    }
    if (userId) {
      const cookie = parseCookies(headers)
      const token = cookie.get(`${payload.config.cookiePrefix}-token`)
      if (!token) {
        console.log('No token passed but passed a userId')
        return Response.redirect(origin)
      }

      let jwtUser: jwt.JwtPayload | string
      try {
        jwtUser = jwt.verify(
          token,
          crypto.createHash('sha256').update(payload.config.secret).digest('hex').slice(0, 32),
          { algorithms: ['HS256'] },
        )
      } catch (error) {
        console.log('Error in verifying token')
        return Response.redirect(origin)
      }
      if (typeof jwtUser === 'string') return Response.redirect(origin)

      if (jwtUser.id !== userId) {
        console.log('Invalid token for userId: ', userId)
        return Response.redirect(origin)
      }
    }

    const id = new ObjectId().toHexString()

    await payload.create({
      collection: 'oauth-states',
      data: {
        //@ts-ignore
        _id: id,
        user: userId,
        integration: integrationId,
      },
    })

    const authorizeUrl = makeAuthorizationUrl(integration, id, origin)
    console.log(authorizeUrl)
    console.log('authorization time', performance.now() - start)
    return Response.redirect(authorizeUrl)
  },
}
