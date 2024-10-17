import { isPayloadAdminPanel } from '@/utils/collections/isPayloadAdminPanel'
import { Access } from 'payload'
import { filterByFirmRead } from './filterByFirmRead'

export const readByDomain: Access = (args) => {
  const { req, data } = args
  if (isPayloadAdminPanel(req)) {
    return filterByFirmRead(args)
  }

  return true
  //only allow pages to be accessed from their domains

  //   const payload = req.payload
  //   let firm = args.data.firm

  //   if (!firm || firm === '') {
  //     return false
  //   }

  //   firm = typeof firm !== 'string' ? firm.id : firm

  //   firm = await payload.findByID({
  //     collection: 'firms',
  //     id: firm,
  //     depth: 1,
  //   })

  //   return args.req.headers.get('host')
}
