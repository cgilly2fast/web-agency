import type { Access, Where } from 'payload'
import type { User } from '../../../payload-types'
import { isSuperAdmin } from '../../utilities/isSuperAdmin'

export const adminsAndSelf: Access<User> = async ({ req: { user } }) => {
  if (!user) {
    return false
  }

  const isSuper = isSuperAdmin(user)

  // allow super-admins through only if they have not scoped their user via `lastLoggedInTenant`
  if (isSuper && !user?.lastLoggedInTenant) {
    return true
  }

  const baseConditions: Where = {
    id: {
      equals: user.id,
    },
  }

  const tenantCondition: Where = isSuper
    ? {
        'tenants.tenant': {
          in: [
            typeof user?.lastLoggedInTenant === 'string'
              ? user?.lastLoggedInTenant
              : user?.lastLoggedInTenant?.id,
          ].filter(Boolean) as string[],
        },
      }
    : {
        'tenants.tenant': {
          in: (user?.tenants
            ?.map(({ tenant, roles }) =>
              roles.includes('admin') ? (typeof tenant === 'string' ? tenant : tenant.id) : null,
            )
            .filter(Boolean) || []) as string[],
        },
      }

  return {
    or: [baseConditions, tenantCondition],
  }
}
