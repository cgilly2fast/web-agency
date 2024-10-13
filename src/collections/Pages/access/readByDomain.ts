import { isPayloadAdminPanel } from '@/collections/utilities/isPayloadAdminPanel'
import { Access } from 'payload'
import { filterByTenantRead } from './filterByTenantRead'

export const readByDomain: Access = (args) => {
  const { req, data } = args
  if (isPayloadAdminPanel(req)) {
    return filterByTenantRead(args)
  }

  return true
  //only allow pages to be accessed from their domains

  //   const payload = req.payload
  //   let tenant = args.data.tenant

  //   if (!tenant || tenant === '') {
  //     return false
  //   }

  //   tenant = typeof tenant !== 'string' ? tenant.id : tenant

  //   tenant = await payload.findByID({
  //     collection: 'tenants',
  //     id: tenant,
  //     depth: 1,
  //   })

  //   return args.req.headers.get('host')
}
