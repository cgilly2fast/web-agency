import type { CollectionConfig } from 'payload'

import { superAdminsCollectionAccess } from '../access/superAdmins'
import { tenantAdminCollectionAccess } from '../access/tenantAdminCollectionAccess'
import { anyone } from '../access/anyone'
import { validateDomain } from './validation/validateDomain'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  labels: { singular: 'Firm Setting', plural: 'Firm Settings' },
  access: {
    create: superAdminsCollectionAccess,
    read: anyone, //tenantAdmins, // add domains api access
    update: tenantAdminCollectionAccess,
    delete: superAdminsCollectionAccess,
  },
  admin: {
    components: { edit: { SaveButton: '@/components/GlobalTitle' } },
  },
  hooks: {
    afterOperation: [
      async ({ operation, req, result }) => {
        if (operation === 'create') {
          const { payload } = req

          await payload.create({
            collection: 'headers',
            data: {
              tenant: result.id,
            },
          })

          await payload.create({
            collection: 'footers',
            data: {
              tenant: result.id,
            },
          })

          await payload.create({
            collection: 'ai-configs',
            data: {
              tenant: result.id,
            },
          })
        }
        return result
      },
      async ({ operation, req, result }) => {
        if (operation === 'delete') {
          const { payload } = req
          for (let i = 0; i < result.docs.length; i++) {
            const doc = result.docs[i]
            await payload.delete({
              collection: 'headers',
              where: {
                tenant: {
                  equals: doc.id,
                },
              },
            })

            await payload.delete({
              collection: 'footers',
              where: {
                tenant: { equals: doc.id },
              },
            })

            await payload.delete({
              collection: 'ai-configs',
              where: {
                tenant: { equals: doc.id },
              },
            })
          }
        }
        return result
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          // description: 'This will appear within the tab above the fields.',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Firm Name',
              maxLength: 50,
              admin: {
                description: 'Firm name. Example: Okoye Law Group LP ',
                width: '50%',
              },
            },

            {
              name: 'domain',
              type: 'text',
              required: true,
              label: 'Domain Name',
              // validate: validateDomain,
              admin: {
                description:
                  'The domain name where your site is deployed. Example: hawaiilegalhelp.com. Do not include https://',
                width: '50%',
              },
            },
          ],
        },
        {
          label: 'Images',
          // description: 'This will appear within the tab above the fields.',
          fields: [
            {
              name: 'logo',
              type: 'relationship',
              relationTo: 'media',
              label: 'Logo',
              admin: {
                description: 'The full logo to be used in contexts like the Login view.',
                style: {
                  maxWidth: '580px',
                },
              },
            },
            {
              name: 'logoDarkMode',
              type: 'relationship',
              relationTo: 'media',
              label: 'Logo For Dark Mode',
              admin: {
                description:
                  'The full logo to be used in dark mode contexts like the Login view. Defaults to Icon if not set.',
                style: {
                  maxWidth: '580px',
                  marginBottom: '60px',
                },
              },
            },

            {
              name: 'icon',
              type: 'relationship',
              relationTo: 'media',
              label: 'Icon',
              admin: {
                description:
                  'Used as a graphic within the Nav component. Often represents a condensed version of a full logo.',
                style: {
                  maxWidth: '580px',
                },
              },
            },
            {
              name: 'iconDarkMode',
              type: 'relationship',
              relationTo: 'media',
              label: 'Icon For Dark Mode',
              admin: {
                description:
                  'Used as a graphic within the Nav component during dark mode. Defaults to Icon if not set.',
                style: {
                  maxWidth: '580px',
                  marginBottom: '60px',
                },
              },
            },

            {
              name: 'favicon',
              type: 'relationship',
              relationTo: 'media',
              label: 'Favicon',
              admin: {
                description: ' Image that will be displayed as the tab icon.',
                style: {
                  maxWidth: '580px',
                },
              },
            },
            {
              name: 'ogImage',
              type: 'relationship',
              relationTo: 'media',
              label: 'Social Media Preview Image',
              admin: {
                description:
                  'The image that appears when your page is shared on social media. Choose a relevant, eye-catching image to make your content stand out in social feeds. A square image at least 512px x 512px is recommended.',
                style: {
                  maxWidth: '580px',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
