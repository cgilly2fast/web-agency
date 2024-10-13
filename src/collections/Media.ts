import type { CollectionConfig } from 'payload'
import { superAdmins } from './access/superAdmins'
import { tenantAdmins } from './access/tenantAdmins'
import { anyone } from './access/anyone'
import { TenantField } from './fields/TenantField'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: tenantAdmins,
    read: anyone,
    update: tenantAdmins,
    delete: tenantAdmins,
  },
  upload: {
    imageSizes: [
      {
        name: 'main',
        width: 760,
        height: 420,
        position: 'centre',
      },
      {
        name: 'preview',
        width: 670,
        height: 420,
        position: 'centre',
      },
      {
        name: 'thumbnail',
        width: 370,
        height: 270,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    TenantField,
  ],
}
