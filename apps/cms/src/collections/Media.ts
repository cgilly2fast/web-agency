import type { CollectionConfig } from 'payload'
import { superAdmins } from './access/superAdmins'
import { tenantAdmins } from './access/tenantAdmins'
import { anyone } from './access/anyone'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: tenantAdmins,
    read: anyone,
    update: tenantAdmins,
    delete: tenantAdmins,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
