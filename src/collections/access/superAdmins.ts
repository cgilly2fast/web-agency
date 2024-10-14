import type { FieldAccess, Access } from 'payload'

import { checkUserRoles } from '../utilities/checkUserRoles'

export const superAdminsCollectionAccess: Access = ({ req: { user } }) =>
  checkUserRoles(['super-admin'], user)

export const superAdminFieldAccess: FieldAccess = ({ req: { user } }) =>
  checkUserRoles(['super-admin'], user)
