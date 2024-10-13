import type { CollectionConfig } from 'payload'

import { TenantField } from '../fields/TenantField'
import { loggedIn } from './access/loggedIn'
import { tenantAdmins } from '../access/tenantAdmins'
import formatSlug from './hooks/formatSlug'
import { ensureUniqueSlug } from './hooks/enureUniqueSlug'
import { readByDomain } from './access/readByDomain'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const isHomePage = data.slug === 'home'
        return `${process.env.PAYLOAD_PUBLIC_SITE_URL}${!isHomePage ? `/${data.slug}` : ''}`
      },
    },
  },
  access: {
    read: readByDomain,
    create: loggedIn,
    update: tenantAdmins,
    delete: tenantAdmins,
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
