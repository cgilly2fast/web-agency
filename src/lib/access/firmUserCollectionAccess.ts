import type { Access } from 'payload'

import { isSuperAdmin } from '../../utils/collections/isSuperAdmin'

export const firmUserCollectionAccess: Access = ({ req: { user } }) => {
  if (isSuperAdmin(user)) return true

  if (!user) return false

  return {
    id: {
      equals: typeof user.firm === 'string' ? user.firm : user.firm.id,
    },
  }
}
