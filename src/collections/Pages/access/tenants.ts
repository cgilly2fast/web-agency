import type { Access } from 'payload'

import { isSuperAdmin } from '../../utilities/isSuperAdmin'

export const tenants: Access = ({ req: { user }, data }) => {
  let lastTenantId = ''
  if (typeof user?.lastLoggedInTenant === 'string') {
    lastTenantId = user.lastLoggedInTenant
  } else if (user?.lastLoggedInTenant?.id) {
    lastTenantId = user.lastLoggedInTenant.id
  }

  let currTenantId = ''
  if (typeof data?.tenant === 'string') {
    currTenantId = data?.tenant
  } else if (data?.tenant?.id) {
    lastTenantId = data.tenant.id
  }

  if (currTenantId && lastTenantId) {
    return currTenantId === lastTenantId
  }

  if (lastTenantId && isSuperAdmin(user)) {
    return true
  }

  return {
    tenant: {
      equals: lastTenantId,
    },
  }
}
