import type { Access } from 'payload'

import { isSuperAdmin } from '../../utils/collections/isSuperAdmin'

export const firmAdminCollectionAccess: Access = ({ req: { user } }) => {
  if (isSuperAdmin(user)) return true

  if (!user || !user.firmRole.includes('admin')) return false

  return {
    id: {
      equals: typeof user.firm === 'string' ? user.firm : user.firm.id,
    },
  }
}
