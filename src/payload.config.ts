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

import { OAuth2Plugin } from './plugins/oauth2'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Firms } from './collections/Firms/index'
import { serviceAccount } from './config'
import { abrVideos } from './plugins/abrVideos'
import Blogs from './collections/Blog/Blogs'
import { readByDomain } from './collections/Pages/access/readByDomain'
import { firmUserCollectionAccess } from './lib/access/firmUserCollectionAccess'
import { firmAdminCollectionAccess } from './lib/access/firmAdminCollectionAccess'
import Headers from './collections/Headers'
import Footers from './collections/Footers'
import AvailabilitySettings from './collections/AvailabilitySettings'
import ChatSettings from './collections/ChatSettings'
import appointmentFormOverride from './lib/overrides/appointmentFormOverride'
import Interactions from './collections/Interactions'
import { UserTokens } from './collections/UserTokens'
import { FirmTokens } from './collections/FirmTokens'

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
    components: {
      graphics: {
        Logo: '@/graphics/Logo/index',
        Icon: '@/graphics/Icon/index',
      },
      afterLogin: ['@/components/GoogleOAuthButton'],
      Nav: '@/components/Nav/index',
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
    AvailabilitySettings,
    FirmTokens,
    ChatSettings,
    UserTokens,
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
          create: firmUserCollectionAccess,
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
        fields: appointmentFormOverride,
      },
      formSubmissionOverrides: {
        slug: 'meetings',
        access: {
          read: readByDomain,
          create: firmUserCollectionAccess,
          update: firmUserCollectionAccess,
          delete: firmAdminCollectionAccess,
        },
      },
    }),
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET!,
      rest: true,
    }),
    seoPlugin({ collections: ['pages', 'blogs'], uploadsCollection: 'media' }),
    OAuth2Plugin({
      enabled: true,
      serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
      authCollection: 'users',
      authorizePath: '/g/oauth/authorize',
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
      callbackPath: '/g/oauth/callback',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/calendar',
      ],
      providerAuthorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      getExistingScope: async (payload: BasePayload, userId: string) => {
        const snapshot = await payload.find({
          collection: 'user-tokens',
          where: {
            user: {
              equals: userId,
            },
          },
          limit: 1,
        })
        const tokens = snapshot.docs[0]
        if (!tokens || !tokens.google || !tokens.google.scope) return []

        return tokens.google.scope.split(' ')
      },
      getUserInfo: async (accessToken: string) => {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const user = await response.json()
        return { sub: user.sub }
      },
      useEmailAsIdentity: true,
      successRedirect: (req, state) => {
        if (state === 'integrations') {
          return '/admin/integrations'
        }
        return '/admin'
      },
      failureRedirect: (req, error, state) => {
        if (state === 'integrations') {
          return '/admin/integrations'
        }
        return '/admin/login'
      },
      strategyName: 'google',
      subFieldName: 'google',
    }),
    OAuth2Plugin({
      enabled: true,
      serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
      authCollection: 'users',
      authorizePath: '/ms/oauth/authorize',
      clientId: process.env.MS_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.MS_OAUTH_CLIENT_SECRET || '',
      callbackPath: '/ms/oauth/callback',
      tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      scopes: [
        'https://graph.microsoft.com/User.Read',
        'openid',
        'offline_access',
        'email',
        'profile',
        'https://graph.microsoft.com/Calendars.ReadWrite',
        'https://graph.microsoft.com/Calendars.ReadWrite.Shared',
      ],
      providerAuthorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      getExistingScope: async (payload: BasePayload, userId: string) => {
        const snapshot = await payload.find({
          collection: 'user-tokens',
          where: {
            user: {
              equals: userId,
            },
          },
          limit: 1,
        })
        const user = await payload.findByID({
          collection: 'users',
          id: userId,
        })
        const tokens = snapshot.docs[0]
        if (!tokens || !tokens.microsoft || !tokens.microsoft.scope) return []

        return tokens.microsoft.scope.split(' ')
      },
      getUserInfo: async (accessToken: string) => {
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const user = await response.json()
        return { sub: user.id }
      },
      useEmailAsIdentity: true,
      successRedirect: (req, state) => {
        if (state === 'integrations') {
          return '/admin/integrations'
        }
        return '/admin'
      },
      failureRedirect: (req, error, state) => {
        if (state === 'integrations') {
          return '/admin/integrations'
        }
        return '/admin/login'
      },
      strategyName: 'microsoft',
      subFieldName: 'microsoft',
    }),
  ],
  upload: {
    limits: {
      fileSize: 25000000,
    },
  },
})
