import type { User } from '../../payload-types'

export const getTenantAccessIDs = (user: null | User): string[] => {
  if (!user) {
    return []
  }

  const tenantID = typeof user.tenant === 'string' ? user.tenant : user.tenant.id
  return [tenantID]
}

export const getTenantAdminTenantAccessIDs = (user: null | User): string[] => {
  if (!user || user.tenantRole !== 'admin') {
    return []
  }

  const tenantID = typeof user.tenant === 'string' ? user.tenant : user.tenant.id
  return [tenantID]
}
