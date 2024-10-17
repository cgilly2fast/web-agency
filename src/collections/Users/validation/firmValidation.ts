import { isSuperAdmin } from '@/utils/collections/isSuperAdmin'
import { Validate } from 'payload'

export const validateFirm: Validate = async (value, { siblingData, req }) => {
  if (isSuperAdmin(req.user)) {
    return true
  }
  if (value === siblingData.firm) {
    return true
  }

  return 'Only super admins can change a users firm'
}
