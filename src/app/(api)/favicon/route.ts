import { Media } from '@/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async (req: Request) => {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'firms',
    where: {
      name: {
        equals: req.headers.get('host'),
      },
    },
    depth: 0,
    limit: 1,
  })

  if (data && data.docs && data.docs.length > 0 && data.docs[0].favicon) {
    return Response.redirect(
      process.env.PAYLOAD_PUBLIC_SERVER_URL + (data.docs[0].favicon as Media).url!,
    )
  }

  return Response.redirect(process.env.PAYLOAD_PUBLIC_SERVER_URL + '/api/media/file/flFavicon.svg')
}
