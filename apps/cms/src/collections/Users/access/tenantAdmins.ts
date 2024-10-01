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
  return (
    checkUserRoles(['super-admin'], user as User) ||
    doc?.tenants?.some(({ tenant }) => {
      const id = typeof tenant === 'string' ? tenant : tenant?.id
      return checkTenantRoles(['admin'], user as User, id)
    }) ||
    false
  )
}
