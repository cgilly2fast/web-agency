import { isSuperAdmin } from '@/collections/utilities/isSuperAdmin'
import { Validate } from 'payload'

export const validateTenant: Validate = async (value, { siblingData, req }) => {
  if (isSuperAdmin(req.user)) {
    return true
  }
  if (value === siblingData.tenant) {
    return true
  }

  return 'Only super admins can change a users tenant'
}
