import { CollectionConfig } from 'payload'

// import { revalidateBlog } from './hooks/revalidateBlog'
// import Calix from '../../blocks/firmleads/Calix'
import { readByDomain } from '../Pages/access/readByDomain'
import { firmAdminCollectionAccess } from '../../lib/access/firmAdminCollectionAccess'
import { firmUserCollectionAccess } from '../../lib/access/firmUserCollectionAccess'
import { Firm } from '@/payload-types'
import formatSlug from '../Pages/hooks/formatSlug'
import ensureUniqueSlug from '../Pages/hooks/enureUniqueSlug'
import FirmField from '../../lib/fields/FirmField'

const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    livePreview: {
      url: async ({ data, payload }) => {
        let firm: Firm | string = data.firm
        if (typeof firm === 'string') {
          firm = await payload.findByID({
            collection: 'firms',
            id: data.firm,
          })
        }
        return `https://${firm.domain}/blog/${data.slug}`
      },
    },
  },
  labels: { singular: 'Blog', plural: 'Blogs' },
  versions: {
    drafts: true,
  },

  access: {
    read: readByDomain,
    create: firmUserCollectionAccess,
    update: firmUserCollectionAccess,
    delete: firmAdminCollectionAccess,
  },

  fields: [
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      required: true,
      hooks: {
        beforeValidate: [formatSlug('title'), ensureUniqueSlug],
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'name',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      type: 'text',
    },
    {
      name: 'author',
      label: 'Author',
      type: 'relationship',
      relationTo: ['users'],
      maxDepth: 1,
      required: true,
    },
    {
      name: 'featuredContent',
      label: 'Featured Content',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'time',
      label: 'Time To Read (mins)',
      type: 'number',
      required: true,
    },
    {
      name: 'tags',
      label: 'Blog Tags',
      type: 'array',
      maxRows: 5,
      minRows: 1,
      fields: [{ name: 'tagName', label: 'Tag Name', type: 'text' }],
    },
    {
      name: 'content',
      label: 'Blog Content',
      type: 'richText',
      required: true,
    },
    FirmField,
    // {
    //   name: 'layout',
    //   label: 'Layout',
    //   type: 'blocks',
    //   blocks: [Calix],
    // },
  ],
}

export default Blogs
