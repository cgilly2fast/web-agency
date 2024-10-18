import { superAdminFieldAccess, superAdminsCollectionAccess } from '@/lib/access/superAdmins'
import { CollectionConfig } from 'payload'

export const UserTokens: CollectionConfig = {
  slug: 'user-tokens',
  labels: { singular: 'User Tokens', plural: 'User Tokens' },
  admin: {
    hidden: true,
  },
  access: {
    read: superAdminsCollectionAccess,
    create: superAdminsCollectionAccess,
    update: superAdminsCollectionAccess,
    delete: superAdminsCollectionAccess,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'User',
      required: true,
      index: true,
      unique: true,
      access: {
        create: superAdminFieldAccess,
        update: superAdminFieldAccess,
      },
      admin: {
        readOnly: true,
        style: {
          maxWidth: '470px',
        },
      },
      // filterOptions: accountFilterOption,
      // validate: accountValidation('contacts'),
    },
    {
      name: 'google',
      type: 'group',
      hidden: true,
      fields: [
        {
          name: 'id',
          type: 'text',
          admin: {
            description: 'sub id from OAuth workflow.',
          },
        },
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
          name: 'id',
          type: 'text',
          admin: {
            description: 'sub id from OAuth workflow.',
          },
        },
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
