import type { User, Tenant } from '../../../payload-types'

export const checkTenantRoles = (
  tenantRoles: ('admin' | 'user')[],
  user: User | undefined,
  tenant: string | Tenant | undefined,
): boolean => {
  if (!user || !tenant || !user.tenants) return false

  const id = typeof tenant === 'string' ? tenant : tenant?.id

  if (tenant) {
    if (
      tenantRoles.some((role) => {
        return user?.tenants?.some(({ tenant: userTenant, roles }) => {
          const tenantID = typeof userTenant === 'string' ? userTenant : userTenant?.id
          return tenantID === id && roles?.includes(role)
        })
      })
    )
      return true
  }

  return false
}
