import type { CollectionConfig } from 'payload'

import Link from './fields/LinkField'
import TenantFieldUnique from './fields/TenantField/TenantFieldUnique'
import { superAdminsCollectionAccess } from './access/superAdmins'
import { readByDomain } from './Pages/access/readByDomain'
import { tenantUserCollectionAccess } from './access/tenantUserCollectionAccess'

const Headers: CollectionConfig = {
  slug: 'headers',
  access: {
    read: readByDomain,
    create: superAdminsCollectionAccess,
    update: tenantUserCollectionAccess,
    delete: superAdminsCollectionAccess,
  },
  admin: {
    components: { edit: { SaveButton: '@/components/GlobalTitle' } },
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
    TenantFieldUnique,
    { name: 'ctaText', label: 'CTA Text', type: 'text' },
  ],
}

export default Headers
