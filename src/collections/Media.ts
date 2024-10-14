import type { CollectionConfig } from 'payload'
import { tenantAdminCollectionAccess } from './access/tenantAdminCollectionAccess'
import { anyone } from './access/anyone'
import TenantField from './fields/TenantField'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: tenantAdminCollectionAccess,
    read: anyone,
    update: tenantAdminCollectionAccess,
    delete: tenantAdminCollectionAccess,
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
