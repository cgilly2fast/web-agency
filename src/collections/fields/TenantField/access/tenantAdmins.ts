import type { FieldAccess } from 'payload'

import { isSuperAdmin } from '@/collections/utilities/isSuperAdmin'

export const tenantAdminFieldAccess: FieldAccess = ({ req: { user }, doc }) => {
  return (
    isSuperAdmin(user) ||
    (doc?.tenant &&
      user?.tenants?.some(
        ({ tenant: userTenant, roles }) =>
          (typeof doc?.tenant === 'string' ? doc?.tenant : doc?.tenant.id) ===
            (typeof userTenant === 'string' ? userTenant : userTenant?.id) &&
          roles?.includes('admin'),
      ))
  )
}
