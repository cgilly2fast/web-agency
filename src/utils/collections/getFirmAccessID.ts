import type { User } from '../../payload-types'

export const getFirmAccessIDs = (user: null | User): string[] => {
  if (!user) {
    return []
  }

  const firmID = typeof user.firm === 'string' ? user.firm : user.firm.id
  return [firmID]
}

export const getFirmAdminFirmAccessIDs = (user: null | User): string[] => {
  if (!user || user.firmRole !== 'admin') {
    return []
  }

  const firmID = typeof user.firm === 'string' ? user.firm : user.firm.id
  return [firmID]
}
