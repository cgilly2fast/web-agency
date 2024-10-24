import type { CollectionConfig } from 'payload'

import Link from '../lib/fields/LinkField'
import FirmFieldUnique from '../lib/fields/FirmField/FirmFieldUnique'
import { superAdminsCollectionAccess } from '../lib/access/superAdmins'
import { readByDomain } from './Pages/access/readByDomain'
import { firmUserCollectionAccess } from '../lib/access/firmUserCollectionAccess'

const Headers: CollectionConfig = {
  slug: 'headers',
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
      name: 'navItems',
      type: 'array',
      maxRows: 8,
      fields: [Link({})],
    },
    FirmFieldUnique,
    { name: 'ctaText', label: 'CTA Text', type: 'text' },
  ],
}

export default Headers
