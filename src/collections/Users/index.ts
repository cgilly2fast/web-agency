import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { superAdminFieldAccess } from '../access/superAdmins'
import { adminsAndSelf } from './access/adminsAndSelf'
import { tenantAdmins } from './access/tenantAdmins'
import { loginAfterCreate } from './hooks/loginAfterCreate'
import { recordLastLoggedInTenant } from './hooks/recordLastLoggedInTenant'
import { isSuperOrTenantAdmin } from './utilities/isSuperOrTenantAdmin'
import { meToo } from '@/lib/meToo'
import { isSuperAdmin } from '../utilities/isSuperAdmin'
import { validateTenant } from './validation/tenantValidation'

export const Users: CollectionConfig = {
  slug: 'users',
  endpoints: [
    {
      handler: meToo,

      method: 'get',

      path: '/me-too',
    },
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
    create: isSuperOrTenantAdmin,
    update: adminsAndSelf,
    delete: adminsAndSelf,
    admin: isSuperOrTenantAdmin,
  },
  hooks: {
    afterChange: [loginAfterCreate],
    afterLogin: [recordLastLoggedInTenant],
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
      name: 'tenants',
      type: 'array',
      label: 'Tenants',
      access: {
        create: tenantAdmins,
        update: tenantAdmins,
        read: tenantAdmins,
      },
      fields: [
        {
          name: 'tenant',
          type: 'relationship',
          relationTo: 'tenants',
          hasMany: false,
          required: true,
          validate: validateTenant,
          hooks: {
            beforeValidate: [
              ({ req, originalDoc, value }) => {
                if (isSuperAdmin(req.user)) {
                  return value
                }
                return originalDoc.tenant
              },
            ],
          },
        },
        {
          name: 'roles',
          type: 'select',
          hasMany: true,
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
      ],
    },
    {
      name: 'lastLoggedInTenant',
      type: 'relationship',
      relationTo: 'tenants',
      index: true,
      access: {
        create: () => false,
        read: tenantAdmins,
        update: superAdminFieldAccess,
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
