import type { CollectionConfig } from 'payload'
import { firmAdminCollectionAccess } from '../lib/access/firmAdminCollectionAccess'
import { anyone } from '../lib/access/anyone'
import FirmField from '../lib/fields/FirmField'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: firmAdminCollectionAccess,
    read: anyone,
    update: firmAdminCollectionAccess,
    delete: firmAdminCollectionAccess,
  },
  admin: {
    pagination: {
      defaultLimit: 20,
    },
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
    FirmField,
  ],
}
