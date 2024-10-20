import type { CollectionConfig } from 'payload'

import Link from './fields/LinkField'
import FirmFieldUnique from './fields/FirmField/FirmFieldUnique'
import { superAdminsCollectionAccess } from '../lib/access/superAdmins'
import { firmUserCollectionAccess } from '../lib/access/firmUserCollectionAccess'
import { readByDomain } from './Pages/access/readByDomain'

const Footers: CollectionConfig = {
  slug: 'footers',
  access: {
    read: readByDomain,
    create: superAdminsCollectionAccess,
    update: firmUserCollectionAccess,
    delete: superAdminsCollectionAccess,
  },
  admin: {
    components: { edit: { SaveButton: '@/components/GlobalTitle' } },
    pagination: {
      defaultLimit: 20,
    },
  },
  fields: [
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'navItemsColumns',
      label: { singular: 'Nav Item Column', plural: 'Nav Item Columns' },
      type: 'array',
      maxRows: 4,
      fields: [
        {
          name: 'navItems',
          label: { singular: 'Nav Item', plural: 'Nav Items' },
          type: 'array',
          maxRows: 6,
          fields: [Link({})],
        },
      ],
    },
    FirmFieldUnique,
    {
      name: 'socials',
      label: 'Social Media Links',
      type: 'array',
      maxRows: 8,
      fields: [
        {
          name: 'socialUrl',
          label: 'Social URL',
          type: 'text',
        },
        {
          name: 'socialIcon',
          label: 'Social Icon',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    { name: 'ctaText', label: 'CTA Text', type: 'text' },
  ],
}

export default Footers
