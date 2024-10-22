import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { BasePayload, buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { gcsStorage } from '@payloadcms/storage-gcs'
import { seoPlugin } from '@payloadcms/plugin-seo'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Firms } from './collections/Firms/index'
import { serviceAccount } from './config'
import { abrVideos } from './plugins/abrVideos'
import Blogs from './collections/Blog'
import { readByDomain } from './collections/Pages/access/readByDomain'
import { firmUserCollectionAccess } from './lib/access/firmUserCollectionAccess'
import { firmAdminCollectionAccess } from './lib/access/firmAdminCollectionAccess'
import Headers from './collections/Headers'
import Footers from './collections/Footers'
import CalendarSettings from './collections/CalendarSettings'
import ChatSettings from './collections/ChatSettings'
import meetingTemplatesOverride from './lib/overrides/meetingTemplatesOverride'
import Interactions from './collections/Interactions'
import AuthTokens from './collections/AuthTokens'
import Integrations from './collections/Integrations'
import OAuthStates from './collections/OAuthState'
import { anyone } from './lib/access/anyone'
import meetingsOverride from './lib/overrides/meetingsOverrrides'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    avatar: {
      Component: '@/components/ProfilePicture',
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
    components: {
      graphics: {
        Logo: '@/graphics/Logo/index',
        Icon: '@/graphics/Icon/index',
      },
      afterLogin: ['@/components/GoogleOAuthButton'],
      Nav: '@/components/Nav/index',
      providers: ['@/providers/DirectDocumentProvider'],
      views: {
        chat: {
          Component: '@/views/Chat/index',
          path: '/chat',
        },
        integrations: {
          Component: '@/views/Integrations/index',
          path: '/integrations',
        },
        Dashboard: {
          Component: '@/views/Dashboard/index',
          path: '/',
        },
      },
    },
    meta: {
      icons: [{ url: process.env.PAYLOAD_PUBLIC_SERVER_URL + '/favicon' }],
    },
  },
  cors: '*',
  collections: [
    Users,
    Media,
    Pages,
    Blogs,
    Firms,
    Headers,
    Footers,
    CalendarSettings,
    AuthTokens,
    Integrations,
    OAuthStates,
    ChatSettings,
    Interactions,
  ],
  editor: lexicalEditor(),
  globals: [],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  telemetry: false,
  plugins: [
    abrVideos({
      collections: {
        media: {
          keepOriginal: true,
          segmentDuration: 1,
          resolutions: [
            { size: 480, bitrate: 1000 },
            { size: 720, bitrate: 1500 },
            { size: 1080, bitrate: 4000 },
            { size: 1440, bitrate: 6000 },
            { size: 2160, bitrate: 10000 },
          ],
        },
      },
      segmentsOverrides: {
        admin: {
          hidden: true,
        },
      },
    }),
    gcsStorage({
      collections: {
        media: {
          prefix: 'media',
        },
      },
      bucket: process.env.NEXT_PUBLIC_SB!,
      options: {
        projectId: serviceAccount.projectId,
        credentials: {
          client_email: serviceAccount.client_email,
          private_key: serviceAccount.private_key,
        },
      },
    }),
    formBuilderPlugin({
      formOverrides: {
        labels: { singular: 'Form Template', plural: 'Form Templates' },
        access: {
          read: readByDomain,
          create: firmUserCollectionAccess,
          update: firmUserCollectionAccess,
          delete: firmAdminCollectionAccess,
        },
      },
      fields: {
        payment: true,
      },
      formSubmissionOverrides: {
        access: {
          read: readByDomain,
          create: anyone, //firmUserCollectionAccess,
          update: firmUserCollectionAccess,
          delete: firmAdminCollectionAccess,
        },
      },
    }),
    formBuilderPlugin({
      formOverrides: {
        slug: 'meeting-templates',
        labels: { singular: ' Meeting Template', plural: 'Meeting Templates' },
        admin: {
          description: "Click 'Live Preview' to view a preview of your updates",
        },
        access: {
          read: readByDomain,
          create: firmUserCollectionAccess,
          update: firmUserCollectionAccess,
          delete: firmAdminCollectionAccess,
        },
        fields: meetingTemplatesOverride,
      },
      formSubmissionOverrides: {
        slug: 'meetings',
        access: {
          read: readByDomain,
          create: anyone, //firmUserCollectionAccess,
          update: firmUserCollectionAccess,
          delete: firmAdminCollectionAccess,
        },
        fields: meetingsOverride,
      },
    }),
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET!,
      rest: true,
    }),
    seoPlugin({ collections: ['pages', 'blogs'], uploadsCollection: 'media' }),
  ],
  upload: {
    limits: {
      fileSize: 25000000,
    },
  },
})
