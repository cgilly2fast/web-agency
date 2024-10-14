import type { CollectionConfig } from 'payload'

import Link from './fields/LinkField'
import TenantFieldUnique from './fields/TenantField/TenantFieldUnique'
import { superAdminsCollectionAccess } from './access/superAdmins'
import { readByDomain } from './Pages/access/readByDomain'
import { tenantUserCollectionAccess } from './access/tenantUserCollectionAccess'
import { imageFilterOption, videoFilterOption } from '@/utils/imageFilterOption'

const ChatSettings: CollectionConfig = {
  slug: 'chat-settings',
  access: {
    read: readByDomain,
    create: superAdminsCollectionAccess,
    update: tenantUserCollectionAccess,
    delete: superAdminsCollectionAccess,
  },
  admin: {
    useAsTitle: 'agentName',
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
              name: 'active',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Toggle live chat on/off',
                style: {
                  maxWidth: '580px',
                },
              },
            },
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              hasMany: false,
              admin: {
                description:
                  'Select a form to define what information you would like the AI live agent to collect. The form will also define how the routed to you. (Email, Clio Grow, Lead Docket, etc.)',
                style: {
                  maxWidth: '580px',
                  marginBottom: '48px',
                },
              },
            },
            {
              name: 'agentName',
              type: 'text',
              defaultValue: 'Izan Davis',
              admin: {
                description: 'The name the chat agent goes by. Please put a first and last name.',
                style: {
                  maxWidth: '580px',
                },
              },
            },
            {
              name: 'picture',
              label: 'Agent Picture',
              type: 'upload',
              relationTo: 'media',
              filterOptions: imageFilterOption,
              admin: {
                description:
                  'The chat agent image seen when a potential client is messaging the AI agent.',
                style: {
                  maxWidth: '580px',
                  marginBottom: '48px',
                },
              },
            },
            TenantFieldUnique,
          ],
        },
        {
          label: 'Chat Window',
          // description: 'This will appear within the tab above the fields.',
          fields: [
            {
              name: 'previewType',
              label: 'Preview Type',
              type: 'radio',
              admin: {
                description:
                  'Select whether to display a picture or a video as a preview in the live chat bubble. This bubble appears in the bottom right corner of the website.',
                layout: 'horizontal',
                style: {
                  maxWidth: '580px',
                },
              },
              defaultValue: 'message',
              options: [
                {
                  label: 'Image',
                  value: 'image',
                },
                {
                  label: 'Video',
                  value: 'video',
                },
              ],
            },
            {
              name: 'previewImage',
              label: 'Preview Image',
              type: 'upload',
              relationTo: 'media',
              filterOptions: imageFilterOption,
              admin: {
                description:
                  'The bubble picture shown in lower left of website to entice potential client to open chat window.',
                condition: (_, siblingData) => siblingData?.previewType === 'image',
                style: {
                  maxWidth: '580px',
                },
              },
            },
            {
              name: 'previewVideo',
              label: 'Preview Video',
              type: 'upload',
              relationTo: 'media',
              filterOptions: videoFilterOption,
              admin: {
                description:
                  'The video played on repeat in bottom right corner to entice potential clients to click and open chat window. A short 3-5 second video, with no audio that is 100 px by 100 px will lead to the best results.',
                condition: (_, siblingData) => siblingData?.previewType === 'video',
                style: {
                  maxWidth: '580px',
                },
              },
            },

            {
              name: 'introType',
              type: 'radio',
              admin: {
                description: 'Choose whether to show an intro ',
                layout: 'horizontal',
                style: {
                  marginTop: '48px',
                },
              },
              defaultValue: 'message',
              options: [
                {
                  label: 'Intro Video (Recommended)',
                  value: 'video',
                },
                {
                  label: 'No Intro (Directly to message thread)',
                  value: 'direct',
                },
              ],
            },
            {
              name: 'introVideo',
              label: 'Intro Video',
              type: 'upload',
              relationTo: 'media',
              filterOptions: {
                mimeType: {
                  equals: 'application/x-mpegURL',
                },
              },
              admin: {
                description:
                  'If set potential clients with cline the chat bubble in the lower corner, will be presented with a this video, as an introduction to you and your firm. Upload a video to the media collection and wait for it to process. You will see a new entry in your media will a .m3u8 extension. Select this optimized video here.',
                condition: (_, siblingData) => siblingData?.introType === 'video',
                style: {
                  maxWidth: '580px',
                },
              },
            },
            {
              name: 'introOptions',
              label: { singular: 'Intro Option', plural: 'Intro Options' },
              type: 'array',
              maxRows: 3,
              minRows: 1,
              admin: {
                description:
                  'Option button displayed at the bottom of the intro video while playing. When clicked, the message thread opens. Example options: "Need Divorce", "Custody Issue", Something Else"',
                condition: (_, siblingData) => siblingData?.introType === 'video',
                style: {
                  maxWidth: '580px',
                },
              },
              fields: [
                {
                  name: 'option',
                  type: 'text',
                  label: 'Option',
                  admin: {
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
    },
  ],
}

export default ChatSettings
