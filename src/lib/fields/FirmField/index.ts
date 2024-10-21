import type { Field } from 'payload'

import { superAdminFieldAccess } from '../../../lib/access/superAdmins'
import { isSuperAdmin } from '../../../utils/collections/isSuperAdmin'
import { firmAdminFieldAccess } from '../../../lib/access/firmAdminFieldAccess'

const FirmField: Field = {
  name: 'firm',
  type: 'relationship',
  relationTo: 'firms',
  // required: true,
  index: true,
  admin: {
    position: 'sidebar',
    components: {
      Field: '@/lib/fields/FirmField/components/index',
    },
    style: {
      maxWidth: '580px',
    },
  },
  hasMany: false,
  access: {
    create: superAdminFieldAccess,
    read: firmAdminFieldAccess,
    update: superAdminFieldAccess,
  },
  hooks: {
    // automatically set the firm to the last logged in firm
    // for super admins, allow them to set the firm
    beforeChange: [
      async ({ req, req: { user }, data }) => {
        if ((await isSuperAdmin(req.user)) && data?.firm) {
          return data.firm
        }

        if (typeof user?.lastLoggedInFirm === 'string') {
          return user.lastLoggedInFirm
        }

        if (user?.lastLoggedInFirm?.id) {
          return user.lastLoggedInFirm.id
        }

        return undefined
      },
    ],
  },
}

export default FirmField
