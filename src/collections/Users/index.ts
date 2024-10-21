import type { CollectionConfig } from 'payload'

import { superAdminFieldAccess } from '../../lib/access/superAdmins'
import { adminsAndSelf } from './access/adminsAndSelf'
import { loginAfterCreate } from './hooks/loginAfterCreate'
import { recordLastLoggedInFirm } from './hooks/recordLastLoggedInFirm'
import { isSuperOrFirmAdmin } from './utilities/isSuperOrFirmAdmin'
import { meToo } from '@/endpoints/meToo'
import { isSuperAdmin } from '../../utils/collections/isSuperAdmin'
import { validateFirm } from './validation/firmValidation'
import { accountSetup } from './hooks/accountSetup'
import { accountDelete } from './hooks/accountDelete'
import { firmAdminFieldAccess } from '../../lib/access/firmAdminFieldAccess'
import { authorizeEndpoint } from './endpoints/authorizeEndpoint'
import { callbackEndpoint } from './endpoints/callbackEndpoint.'
import { revokeEndpoint } from './endpoints/revokeEndpoint'

export const Users: CollectionConfig = {
  slug: 'users',
  endpoints: [
    {
      handler: meToo,

      method: 'get',

      path: '/me-too',
    },
    authorizeEndpoint,
    callbackEndpoint,
    revokeEndpoint,
  ],
  auth: {
    tokenExpiration: 82800,
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: adminsAndSelf,
    create: isSuperOrFirmAdmin,
    update: adminsAndSelf,
    delete: adminsAndSelf,
    admin: isSuperOrFirmAdmin,
  },
  hooks: {
    afterChange: [loginAfterCreate],
    afterLogin: [recordLastLoggedInFirm],
    afterOperation: [accountSetup, accountDelete],
  },
  fields: [
    {
      name: 'avatar',
      type: 'relationship',
      relationTo: 'media',
      label: 'Avatar',
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: 'user',
      access: {
        create: superAdminFieldAccess,
        update: superAdminFieldAccess,
        read: superAdminFieldAccess,
      },
      options: [
        {
          label: 'Super Admin',
          value: 'super-admin',
        },
        {
          label: 'User',
          value: 'user',
        },
        {
          label: 'Domains API Access',
          value: 'domains-api',
        },
      ],
    },

    {
      name: 'firm',
      type: 'relationship',
      relationTo: 'firms',
      label: 'Firms',
      hasMany: false,
      required: true,
      validate: validateFirm,
      access: {
        create: firmAdminFieldAccess,
        update: firmAdminFieldAccess,
        read: firmAdminFieldAccess,
      },
      hooks: {
        beforeValidate: [
          ({ req, originalDoc, value }) => {
            if (isSuperAdmin(req.user)) {
              return value
            }
            return originalDoc.firm
          },
        ],
      },
    },
    {
      name: 'firmRole',
      type: 'select',
      hasMany: false,
      required: true,
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },

    {
      name: 'calendarSettings',
      type: 'relationship',
      relationTo: 'calendar-settings',
      access: {
        create: () => false,
        read: superAdminFieldAccess,
        update: superAdminFieldAccess,
      },
    },

    {
      name: 'lastLoggedInFirm',
      type: 'relationship',
      relationTo: 'firms',
      index: true,
      access: {
        create: () => false,
        read: firmAdminFieldAccess,
        update: superAdminFieldAccess,
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
