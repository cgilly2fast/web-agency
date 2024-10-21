import { integrations } from 'googleapis/build/src/apis/integrations'
import { CollectionConfig, Validate } from 'payload'
import { validateAccountEmail } from './validate/validateAccountEmail'

const AuthTokens: CollectionConfig = {
  slug: 'auth-tokens',
  labels: { singular: 'Auth Token', plural: 'Auth Tokens' },
  admin: {
    pagination: {
      defaultLimit: 20,
    },
    useAsTitle: 'accountEmail',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'firm',
      type: 'relationship',
      relationTo: 'firms',
      required: true,
      index: true,
    },
    {
      name: 'integration',
      type: 'relationship',
      relationTo: 'integrations',
      required: true,
      index: true,
    },
    {
      name: 'status',
      type: 'radio',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Disconnected',
          value: 'disconnected',
        },
        {
          label: 'Error',
          value: 'error',
        },
      ],
    },
    {
      name: 'provider',
      type: 'text',
    },
    {
      name: 'accountEmail',
      type: 'text',
      index: true,
      validate: validateAccountEmail,
    },
    {
      name: 'accountId',
      type: 'text',
    },
    {
      name: 'accessToken',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'refreshToken',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'scope',
      type: 'text',
    },
  ],
}

export default AuthTokens
