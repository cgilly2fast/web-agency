import { DB_TIME_FORMAT } from '@/lib/types'
import moment from 'moment'
import { Endpoint } from 'payload'

export const cleanStateEndpoint: Endpoint = {
  method: 'get',
  path: '/clean-state',
  handler: async ({ payload }) => {
    await payload.delete({
      collection: 'oauth-states',
      where: {
        createdAt: {
          less_than_equal: moment().subtract(10, 'minutes').format(DB_TIME_FORMAT),
        },
      },
    })

    return Response.json(200)
  },
}
