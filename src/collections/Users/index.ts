import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { superAdminFieldAccess } from '../access/superAdmins'
import { adminsAndSelf } from './access/adminsAndSelf'
import { tenantAdminFieldAccess } from '../access/tenantAdminFieldAccess'
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
    afterOperation: [
      async ({ operation, req, result }) => {
        if (operation === 'create') {
          const { payload } = req

          await payload.create({
            collection: 'calendar-settings',
            data: {
              tenant: result.tenant,
              user: result.id,
            },
          })
        }
        return result
      },
      async ({ operation, req, result }) => {
        if (operation === 'delete') {
          const { payload } = req
          for (let i = 0; i < result.docs.length; i++) {
            const doc = result.docs[i]
            await payload.delete({
              collection: 'calendar-settings',
              where: {
                user: {
                  equals: doc.id,
                },
                tenant: {
                  equals: doc.tenant,
                },
              },
            })
          }
        }
        return result
      },
    ],
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
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      label: 'Tenants',
      hasMany: false,
      required: true,
      validate: validateTenant,
      access: {
        create: tenantAdminFieldAccess,
        update: tenantAdminFieldAccess,
        read: tenantAdminFieldAccess,
      },
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
      name: 'tenantRole',
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
      name: 'lastLoggedInTenant',
      type: 'relationship',
      relationTo: 'tenants',
      index: true,
      access: {
        create: () => false,
        read: tenantAdminFieldAccess,
        update: superAdminFieldAccess,
      },
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'google',
      type: 'group',
      hidden: true,
      fields: [
        {
          name: 'accessToken',
          type: 'text',
          admin: {
            description: 'The token that your application sends to authorize a Google API request.',
          },
        },
        {
          name: 'expiresIn',
          type: 'number',
          admin: {
            description: 'The remaining lifetime of the access token in seconds.',
          },
        },
        {
          name: 'refreshToken',
          type: 'text',
          admin: {
            description:
              'A token that you can use to obtain a new access token. Refresh tokens are valid until the user revokes access. Only present if access_type parameter was set to offline in the initial request.',
          },
        },
        {
          name: 'scope',
          type: 'text',
          admin: {
            description:
              'The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.',
          },
        },
        {
          name: 'tokenType',
          type: 'text',
          admin: {
            description:
              'The type of token returned. At this time, this field\'s value is always set to "Bearer".',
          },
        },
      ],
    },
    {
      name: 'microsoft',
      type: 'group',
      hidden: true,
      fields: [
        {
          name: 'accessToken',
          type: 'text',
          admin: {
            description:
              'The requested access token. The app can use this token to authenticate to the secured resource, such as a web API.',
          },
        },
        {
          name: 'tokenType',
          type: 'text',
          admin: {
            description:
              'Indicates the token type value. The only type that Microsoft Entra ID supports is "Bearer".',
          },
        },
        {
          name: 'expiresIn',
          type: 'number',
          admin: {
            description: 'How long the access token is valid, in seconds.',
          },
        },
        {
          name: 'scope',
          type: 'text',
          admin: {
            description:
              'The scopes that the access_token is valid for. Optional. This parameter is non-standard and, if omitted, the token is for the scopes requested on the initial leg of the flow.',
          },
        },
        {
          name: 'refreshToken',
          type: 'text',
          admin: {
            description:
              'An OAuth 2.0 refresh token. The app can use this token to acquire other access tokens after the current access token expires. Only provided if offline_access scope was requested.',
          },
        },
        {
          name: 'idToken',
          type: 'text',
          admin: {
            description:
              'A JSON Web Token. The app can decode the segments of this token to request information about the user who signed in. Only provided if openid scope was requested.',
          },
        },
      ],
    },
  ],
}
