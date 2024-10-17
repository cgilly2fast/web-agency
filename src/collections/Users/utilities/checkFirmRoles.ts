import type { User, Firm } from '../../../payload-types'

export const checkFirmRoles = (
  firmRole: ('admin' | 'user')[],
  user: User | undefined,
  firm: string | Firm | undefined,
): boolean => {
  if (!user || !firm || !user.firm || user.firm === '') return false

  const id = typeof firm === 'string' ? firm : firm?.id

  const firmID = typeof user.firm === 'string' ? user.firm : user.firm?.id

  for (let i = 0; i < firmRole.length; i++) {
    const role = firmRole[i]!

    if (firmID === id && user.firmRole === role) {
      return true
    }
  }

  return false
}
