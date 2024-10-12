// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
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
import { Tenants } from './collections/Tenants'
import { serviceAccount } from './config'
import { MainMenu } from './collections/MainMenu'
import { Domains } from './collections/Domains'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    avatar: {
      Component: '@/views/ProfilePicture',
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
      afterLogin: ['@/components/GoogleOAuthButton', '@/components/MicrosoftOAuthButton'],
      afterNavLinks: ['@/views/Chat/components/ChatNavLink'],
      views: {
        chat: {
          Component: '@/views/Chat/index',
          path: '/chat',
        },
      },
    },
    meta: {
      icons: [{ url: process.env.PAYLOAD_PUBLIC_SERVER_URL + '/favicon' }],
    },
  },
  cors: '*',
  collections: [Users, Media, Pages, Tenants, Domains],
  editor: lexicalEditor(),
  globals: [MainMenu],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  upload: {
    limits: {
      fileSize: 15000000,
    },
  },
  plugins: [
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
    formBuilderPlugin({}),
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET!,
      rest: true,
    }),
    seoPlugin({ collections: ['pages'], uploadsCollection: 'media' }),
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
        'openid',
      ],
      providerAuthorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      getUserInfo: async (accessToken: string) => {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        console.log('GOOGLE OAUTH RESPONSE', response)
        const user = await response.json()
        console.log('GOOGLE OAUTH USER', user)
        return { email: user.email, sub: user.sub }
      },
      useEmailAsIdentity: true,
      successRedirect: () => '/admin',
      failureRedirect: () => '/admin/login',
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
      scopes: ['https://graph.microsoft.com/User.Read', 'openid', 'email', 'profile'],
      providerAuthorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      getUserInfo: async (accessToken: string) => {
        const response = await fetch('https://graph.microsoft.com/v1.0/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const user = await response.json()
        return { email: user.mail || user.userPrincipalName, sub: user.id }
      },
      useEmailAsIdentity: true,
      successRedirect: () => '/admin',
      failureRedirect: () => '/admin/login',
      strategyName: 'microsoft',
      subFieldName: 'microsoft',
    }),
  ],
})
