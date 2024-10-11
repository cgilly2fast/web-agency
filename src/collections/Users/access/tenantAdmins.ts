import type { FieldAccess } from 'payload'
import { checkUserRoles } from '../../utilities/checkUserRoles'
import { checkTenantRoles } from '../utilities/checkTenantRoles'
import type { User } from '@/payload-types'

interface Tenant {
  id: string
  // Add other tenant properties if needed
}

interface DocWithTenants {
  id: string | number
  tenants?: Array<{
    tenant: string | Tenant
  }>
}

export const tenantAdmins: FieldAccess<DocWithTenants, any> = ({ req: { user }, doc }) => {
  if (checkUserRoles(['super-admin'], user as User)) {
    return true
  }

  const tenants = doc?.tenants ?? []

  for (let i = 0; i < tenants.length; i++) {
    const tenant = tenants[i]!.tenant
    const id = typeof tenant === 'string' ? tenant : tenant?.id
    // console.log(['admin'], user as User, id)
    // console.log(checkTenantRoles(['admin'], user as User, id))
    if (checkTenantRoles(['admin'], user as User, id)) {
      return true
    }
  }
  // console.log('user', user)
  if (!user || !user.lastLoggedInTenant) return false

  const lastTenantId =
    typeof user!.lastLoggedInTenant === 'string'
      ? user!.lastLoggedInTenant
      : user!.lastLoggedInTenant!.id
  // console.log('second')
  // console.log(['admin'], user as User)
  // console.log(checkTenantRoles(['admin'], user as User, lastTenantId))

  return checkTenantRoles(['admin'], user as User, lastTenantId)
}
