import { revalidateOAuthToken } from '@/lib/factories/revalidateOAuthToken'
import { DB_TIME_FORMAT } from '@/lib/types'
import moment from 'moment-timezone'
import { Endpoint } from 'payload'

export const revalidateTokensEndpoint: Endpoint = {
  method: 'get',
  path: '/revalidate',
  handler: async ({ payload }) => {
    const snapshot = await payload.find({
      collection: 'auth-tokens',
      where: {
        expiresAt: {
          less_than_equal: moment().add(5, 'minutes').format(DB_TIME_FORMAT),
        },
      },
    })
    const len = snapshot.docs.length
    let i = 0
    while (i < len) {
      const doc = snapshot.docs[i]
      try {
        revalidateOAuthToken(doc, payload)
      } catch (error) {
        console.log(error)
      }
      i++
    }

    return Response.json(200)
  },
}
