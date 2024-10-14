import type { User, Tenant } from '../../../payload-types'

export const checkTenantRoles = (
  tenantRole: ('admin' | 'user')[],
  user: User | undefined,
  tenant: string | Tenant | undefined,
): boolean => {
  if (!user || !tenant || !user.tenant || user.tenant === '') return false

  const id = typeof tenant === 'string' ? tenant : tenant?.id

  const tenantID = typeof user.tenant === 'string' ? user.tenant : user.tenant?.id

  for (let i = 0; i < tenantRole.length; i++) {
    const role = tenantRole[i]!

    if (tenantID === id && user.tenantRole === role) {
      return true
    }
  }

  return false
}
