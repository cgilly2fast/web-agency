import { CollectionConfig } from 'payload'

const Integrations: CollectionConfig = {
  slug: 'integrations',
  labels: { singular: 'Integration', plural: 'Integrations' },
  admin: {
    useAsTitle: 'name',
    pagination: {
      defaultLimit: 20,
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'provider',
      type: 'select',
      options: [
        {
          label: 'Google',
          value: 'g',
        },
        {
          label: 'Microsoft',
          value: 'ms',
        },
        {
          label: 'Stripe',
          value: 'str',
        },
        {
          label: 'Clio',
          value: 'clio',
        },
        {
          label: 'Lead Docket',
          value: 'lead_docket',
        },
        {
          label: 'Zoom',
          value: 'z',
        },
      ],
    },
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'icon',
      type: 'relationship',
      relationTo: 'media',
    },
    { name: 'group', type: 'text' },
    {
      name: 'drawer',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        {
          name: 'features',
          type: 'array',
          fields: [
            {
              name: 'feature',
              type: 'text',
            },
          ],
        },
        {
          name: 'requirements',
          type: 'array',
          fields: [
            {
              name: 'requirement',
              type: 'text',
            },
          ],
        },
        {
          name: 'nowCan',
          type: 'array',
          fields: [
            {
              name: 'feature',
              type: 'text',
            },
          ],
        },
        {
          name: 'connectedText',
          type: 'text',
        },
        {
          name: 'connectedButtonText',
          type: 'text',
        },
        {
          name: 'connectedRouteTo',
          type: 'select',
          options: [
            { label: 'Disconnect', value: 'disconnect' },
            { label: 'Calendar Settings', value: 'calendar_settings' },
            { label: 'Firm Settings', value: 'firm_settings' },
          ],
        },
        {
          name: 'documentationLink',
          type: 'text',
        },
      ],
    },
    {
      name: 'apiVersion',
      type: 'text',
    },
    {
      name: 'authType',
      type: 'select',
      options: [
        {
          label: 'OAuth2',
          value: 'oauth',
        },
        {
          label: 'API Key',
          value: 'api_key',
        },
        {
          label: 'None',
          value: 'none',
        },
      ],
    },
    {
      name: 'requiredScopes',
      type: 'array',
      fields: [
        {
          name: 'scope',
          type: 'text',
        },
      ],
    },
  ],
}

export default Integrations
