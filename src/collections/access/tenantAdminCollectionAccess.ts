import type { Access } from 'payload'

import { isSuperAdmin } from '../utilities/isSuperAdmin'

export const tenantAdminCollectionAccess: Access = ({ req: { user } }) => {
  if (isSuperAdmin(user)) return true

  if (!user || !user.tenantRole.includes('admin')) return false

  return {
    id: {
      equals: typeof user.tenant === 'string' ? user.tenant : user.tenant.id,
    },
  }
}
