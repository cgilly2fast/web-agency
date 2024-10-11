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
      Component: '@/views/components/ProfilePicture',
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
    },
    // meta: {
    //   icons
    // }
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
  ],
})
