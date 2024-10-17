import type { Access, Where } from 'payload'
import type { User } from '../../../payload-types'
import { isSuperAdmin } from '../../../utils/collections/isSuperAdmin'

export const adminsAndSelf: Access<User> = async ({ req: { user } }) => {
  if (!user) {
    return false
  }

  const isSuper = isSuperAdmin(user)

  if (isSuper && !user?.lastLoggedInFirm) {
    return true
  }

  const baseConditions: Where = {
    id: {
      equals: user.id,
    },
  }

  const firmID = typeof user.firm === 'string' ? user.firm : user.firm.id

  const firmCondition: Where = isSuper
    ? {
        firm: {
          in: [
            typeof user?.lastLoggedInFirm === 'string'
              ? user?.lastLoggedInFirm
              : user?.lastLoggedInFirm?.id,
          ].filter(Boolean) as string[],
        },
      }
    : {
        firm: {
          equals: firmID,
        },
        firmRole: {
          equals: 'admin',
        },
      }

  return {
    or: [baseConditions, firmCondition],
  }
}
