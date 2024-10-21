import { CollectionConfig } from 'payload'

const OAuthStates: CollectionConfig = {
  slug: 'oauth-states',
  labels: { singular: 'OAuth State', plural: 'OAuth States' },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      index: true,
    },
    {
      name: 'integration',
      type: 'relationship',
      relationTo: 'integrations',
      required: true,
      index: true,
    },
  ],
}

export default OAuthStates
