import { Endpoint, PayloadRequest } from 'payload'
import ObjectID from 'bson-objectid'

export const revokeEndpoint: Endpoint = {
  method: 'post',
  path: '/oauth/revoke',
  handler: async (req: PayloadRequest) => {
    const { id } = req.query
    const { payload, user } = req

    if (!user) {
      return Response.json({ error: 'Failed to revoke token' }, { status: 500 })
    }

    if (!id || typeof id !== 'string' || !ObjectID.isValid(id)) {
      return Response.json({ error: 'Invalid token ID' }, { status: 400 })
    }

    try {
      await payload.delete({
        collection: 'auth-tokens',
        where: {
          id: {
            equals: id,
          },
          user: {
            equals: user.id,
          },
        },
      })

      return Response.json({ success: true, message: 'Token revoked successfully' })
    } catch (error) {
      console.error('Error revoking token:', error)
      return Response.json({ error: 'Failed to revoke token' }, { status: 500 })
    }
  },
}

// async function revokeGoogleToken(token: string) {
//   const params = new URLSearchParams({ token })
//   const response = await fetch(`https://oauth2.googleapis.com/revoke?${params}`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//   })

//   if (!response.ok) {
//     if (response.status === 400) {
//       console.log('Token already invalid or expired')
//     } else {
//       throw new Error(`Failed to revoke Google token: ${response.statusText}`)
//     }
//   }
// }
