import type { CollectionConfig } from 'payload'

import { superAdmins } from '../access/superAdmins'
import { tenantAdmins } from '../access/tenantAdmins'
import { anyone } from '../access/anyone'
import { validateDomain } from './validation/validateDomain'

export const Domains: CollectionConfig = {
  slug: 'domains',
  access: {
    create: superAdmins,
    read: anyone,
    update: tenantAdmins,
    delete: superAdmins,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Domain Name',
          validate: validateDomain,
          admin: {
            description:
              'The domain name where your site is deployed. Example: hawaiilegalhelp.com. Do not include https://',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Firm Name',
          maxLength: 50,
          admin: {
            description: 'Firm name. Example: Okoye Law Group LP ',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'logo',
          type: 'relationship',
          relationTo: 'media',
          label: 'Logo',
          admin: {
            description: 'The full logo to be used in contexts like the Login view.',
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
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'icon',
          type: 'relationship',
          relationTo: 'media',
          label: 'Icon',
          admin: {
            description:
              'Used as a graphic within the Nav component. Often represents a condensed version of a full logo.',
          },
        },
        {
          name: 'iconDarkMode',
          type: 'relationship',
          relationTo: 'media',
          label: 'Icon For Dark Mode',
          admin: {
            description:
              'Used as a graphic within the Nav component during dark. Often represents a condensed version of a full logo. Defaults to Icon if not set.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'favicon',
          type: 'relationship',
          relationTo: 'media',
          label: 'Favicon',
          admin: {
            description: ' Image that will be displayed as the tab icon.',
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
          },
        },
      ],
    },
  ],
}
