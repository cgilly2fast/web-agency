import type { CollectionConfig } from 'payload'

import TenantField from '../fields/TenantField'
import { tenantAdminCollectionAccess } from '../access/tenantAdminCollectionAccess'
import formatSlug from './hooks/formatSlug'
import ensureUniqueSlug from './hooks/enureUniqueSlug'
import { readByDomain } from './access/readByDomain'
import { tenantUserCollectionAccess } from '../access/tenantUserCollectionAccess'
import { Tenant } from '@/payload-types'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: async ({ data, payload }) => {
        let tenant: Tenant | string = data.tenant
        if (typeof tenant === 'string') {
          tenant = await payload.findByID({
            collection: 'tenants',
            id: data.tenant,
          })
        }
        const isHomePage = data.slug === 'home'
        return `https://${tenant.domain}${!isHomePage ? `/${data.slug}` : ''}`
      },
    },
  },
  access: {
    read: readByDomain,
    create: tenantUserCollectionAccess,
    update: tenantUserCollectionAccess,
    delete: tenantAdminCollectionAccess,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('title'), ensureUniqueSlug],
      },
    },
    TenantField,
    {
      name: 'richText',
      type: 'textarea',
      label: 'Rich Text',
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
    },
  },
}
