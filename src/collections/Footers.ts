import type { CollectionConfig } from 'payload'

import Link from './fields/LinkField'
import TenantFieldUnique from './fields/TenantField/TenantFieldUnique'
import { superAdminsCollectionAccess } from './access/superAdmins'
import { tenantUserCollectionAccess } from './access/tenantUserCollectionAccess'
import { readByDomain } from './Pages/access/readByDomain'

const Footers: CollectionConfig = {
  slug: 'footers',
  access: {
    read: readByDomain,
    create: superAdminsCollectionAccess,
    update: tenantUserCollectionAccess,
    delete: superAdminsCollectionAccess,
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
    TenantFieldUnique,
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
          required: true,
        },
        {
          name: 'socialIcon',
          label: 'Social Icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    { name: 'ctaText', label: 'CTA Text', type: 'text', required: true },
  ],
}

export default Footers
