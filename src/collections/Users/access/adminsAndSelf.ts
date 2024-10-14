import type { Access, Where } from 'payload'
import type { User } from '../../../payload-types'
import { isSuperAdmin } from '../../utilities/isSuperAdmin'

export const adminsAndSelf: Access<User> = async ({ req: { user } }) => {
  if (!user) {
    return false
  }

  const isSuper = isSuperAdmin(user)

  if (isSuper && !user?.lastLoggedInTenant) {
    return true
  }

  const baseConditions: Where = {
    id: {
      equals: user.id,
    },
  }

  const tenantID = typeof user.tenant === 'string' ? user.tenant : user.tenant.id

  const tenantCondition: Where = isSuper
    ? {
        tenant: {
          in: [
            typeof user?.lastLoggedInTenant === 'string'
              ? user?.lastLoggedInTenant
              : user?.lastLoggedInTenant?.id,
          ].filter(Boolean) as string[],
        },
      }
    : {
        tenant: {
          equals: tenantID,
        },
        tenantRole: {
          equals: 'admin',
        },
      }

  return {
    or: [baseConditions, tenantCondition],
  }
}
