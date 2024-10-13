import type { Field } from 'payload'

import { superAdminFieldAccess } from '../../access/superAdmins'
import { isSuperAdmin } from '../../utilities/isSuperAdmin'
import { tenantAdminFieldAccess } from './access/tenantAdmins'

export const TenantField: Field = {
  name: 'tenant',
  type: 'relationship',
  relationTo: 'tenants',
  // required: true,
  index: true,
  admin: {
    position: 'sidebar',
    components: {
      Field: '@/collections/fields/TenantField/components/index',
    },
  },
  hasMany: false,
  access: {
    create: superAdminFieldAccess,
    read: tenantAdminFieldAccess,
    update: superAdminFieldAccess,
  },
  hooks: {
    // automatically set the tenant to the last logged in tenant
    // for super admins, allow them to set the tenant
    beforeChange: [
      async ({ req, req: { user }, data }) => {
        if ((await isSuperAdmin(req.user)) && data?.tenant) {
          return data.tenant
        }

        if (typeof user?.lastLoggedInTenant === 'string') {
          return user.lastLoggedInTenant
        }

        if (user?.lastLoggedInTenant?.id) {
          return user.lastLoggedInTenant.id
        }

        return undefined
      },
    ],
  },
}
