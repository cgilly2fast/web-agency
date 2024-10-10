import type { User, Tenant } from '../../../payload-types'

export const checkTenantRoles = (
  tenantRoles: ('admin' | 'user')[],
  user: User | undefined,
  tenant: string | Tenant | undefined,
): boolean => {
  if (!user || !tenant || !user.tenants) return false

  const id = typeof tenant === 'string' ? tenant : tenant?.id

  if (!user.tenants) return false

  for (let i = 0; i < tenantRoles.length; i++) {
    const role = tenantRoles[i]!

    for (let j = 0; j < user.tenants.length; i++) {
      const { tenant: userTenant, roles } = user.tenants[i]!
      const tenantID = typeof userTenant === 'string' ? userTenant : userTenant?.id
      return tenantID === id && roles?.includes(role)
    }
  }

  return false
}
