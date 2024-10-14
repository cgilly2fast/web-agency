import type { Access } from 'payload'

import { isSuperAdmin } from '../utilities/isSuperAdmin'

export const tenantUserCollectionAccess: Access = ({ req: { user } }) => {
  if (isSuperAdmin(user)) return true

  if (!user) return false

  return {
    id: {
      equals: typeof user.tenant === 'string' ? user.tenant : user.tenant.id,
    },
  }
}
