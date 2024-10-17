import type { CollectionConfig } from 'payload'

import FirmField from '../fields/FirmField'
import { firmAdminCollectionAccess } from '../../lib/access/firmAdminCollectionAccess'
import formatSlug from './hooks/formatSlug'
import ensureUniqueSlug from './hooks/enureUniqueSlug'
import { readByDomain } from './access/readByDomain'
import { firmUserCollectionAccess } from '../../lib/access/firmUserCollectionAccess'
import { Firm } from '@/payload-types'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: async ({ data, payload }) => {
        let firm: Firm | string = data.firm
        if (typeof firm === 'string') {
          firm = await payload.findByID({
            collection: 'firms',
            id: data.firm,
          })
        }
        const isHomePage = data.slug === 'home'
        return `https://${firm.domain}${!isHomePage ? `/${data.slug}` : ''}`
      },
    },
  },
  access: {
    read: readByDomain,
    create: firmUserCollectionAccess,
    update: firmUserCollectionAccess,
    delete: firmAdminCollectionAccess,
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
    FirmField,
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
