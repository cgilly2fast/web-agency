import { getTenantAccessIDs } from '@/collections/utilities/getTenantAccessID'
import { isSuperAdmin } from '@/collections/utilities/isSuperAdmin'
import type { Access } from 'payload'

import { parseCookies } from 'payload'

export const filterByTenantRead: Access = (args) => {
  const req = args.req
  const superAdmin = isSuperAdmin(args.req.user)
  const selectedTenant = args.data?.tenant === 'string' ? args.data?.tenant : args.data?.tenant?.id

  const tenantAccessIDs = getTenantAccessIDs(req.user)

  if (selectedTenant) {
    if (superAdmin) {
      return {
        tenant: {
          equals: selectedTenant,
        },
      }
    }

    const hasTenantAccess = tenantAccessIDs.some((id) => id === selectedTenant)

    // If NOT super admin,
    // give them access only if they have access to tenant ID set in cookie
    if (hasTenantAccess) {
      return {
        tenant: {
          equals: selectedTenant,
        },
      }
    }
  }

  // If no manually selected tenant,
  // but it is a super admin, give access to all
  if (superAdmin) {
    return true
  }

  // If not super admin,
  // but has access to tenants,
  // give access to only their own tenants
  if (tenantAccessIDs.length) {
    return {
      tenant: {
        in: tenantAccessIDs,
      },
    }
  }

  // Deny access to all others
  return false
}
