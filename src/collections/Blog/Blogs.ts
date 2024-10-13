import { CollectionConfig } from 'payload'

// import { revalidateBlog } from './hooks/revalidateBlog'
// import Calix from '../../blocks/firmleads/Calix'
import { readByDomain } from '../Pages/access/readByDomain'
import { tenantAdmins } from '../access/tenantAdmins'
import { tenantUser } from '../access/tenantUser'
import { Tenant } from '@/payload-types'
import formatSlug from '../Pages/hooks/formatSlug'
import ensureUniqueSlug from '../Pages/hooks/enureUniqueSlug'
import { TenantField } from '../fields/TenantField'

const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],

    livePreview: {
      url: async ({ data, payload }) => {
        let tenant: Tenant | string = data.tenant
        if (typeof tenant === 'string') {
          tenant = await payload.findByID({
            collection: 'tenants',
            id: data.tenant,
          })
        }
        return `https://${tenant.domain}/blog/${data.slug}`
      },
    },
  },
  labels: { singular: 'Blog', plural: 'Blogs' },
  versions: {
    drafts: true,
  },

  access: {
    read: readByDomain,
    create: tenantUser,
    update: tenantUser,
    delete: tenantAdmins,
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
    TenantField,
    // {
    //   name: 'layout',
    //   label: 'Layout',
    //   type: 'blocks',
    //   blocks: [Calix],
    // },
  ],
}

export default Blogs
