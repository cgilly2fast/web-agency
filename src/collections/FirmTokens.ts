import { CollectionConfig } from 'payload'
import { superAdminsCollectionAccess } from '@/lib/access/superAdmins'

export const FirmTokens: CollectionConfig = {
  slug: 'firm-tokens',
  labels: { singular: 'Token', plural: 'Tokens' },
  access: {
    read: superAdminsCollectionAccess,
    create: superAdminsCollectionAccess,
    update: superAdminsCollectionAccess,
    delete: superAdminsCollectionAccess,
  },
  fields: [
    {
      name: 'firm',
      type: 'relationship',
      relationTo: 'firms',
      unique: true,
      required: true,
    },
    // {
    //   name: 'plaid',
    //   type: 'group',
    //   label: 'Plaid Information',
    //   fields: [
    //     {
    //       name: 'accessToken',
    //       type: 'text',
    //       label: 'Access Token',
    //     },
    //     {
    //       name: 'itemId',
    //       type: 'text',
    //       label: 'Item ID',
    //     },
    //     {
    //       name: 'processorToken',
    //       type: 'text',
    //       label: 'Processor Token',
    //     },
    //     {
    //       name: 'ipAddress',
    //       type: 'text',
    //       label: 'IP Address',
    //     },
    //   ],
    // },
    // {
    //   name: 'stripe',
    //   type: 'group',
    //   label: 'Stripe Information',
    //   fields: [
    //     {
    //       name: 'customerId',
    //       type: 'text',
    //       label: 'Customer ID',
    //     },
    //     {
    //       name: 'paymentId',
    //       type: 'text',
    //       label: 'Payment ID',
    //     },
    //   ],
    // },
  ],
}
