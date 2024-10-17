import type { FieldAccess } from 'payload'

import { isSuperAdmin } from '@/utils/collections/isSuperAdmin'

export const firmAdminFieldAccess: FieldAccess = ({ req: { user }, doc }) => {
  if (isSuperAdmin(user)) return true

  if (!user || !user.firmRole || !user.firmRole.includes('admin')) return false

  const docFirm = typeof doc?.firm === 'string' ? doc?.firm : doc?.firm.id
  const userFirm = typeof user.firm === 'string' ? user.firm : user.firm?.id

  return docFirm === userFirm
}
