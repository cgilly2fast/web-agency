import { CollectionConfig } from 'payload'
import { superAdminsCollectionAccess } from '../lib/access/superAdmins'

const Interactions: CollectionConfig = {
  slug: 'interactions',
  labels: { singular: 'Interaction', plural: 'Interaction' },
  access: {
    read: superAdminsCollectionAccess,
    create: superAdminsCollectionAccess,
    update: superAdminsCollectionAccess,
    delete: superAdminsCollectionAccess,
  },
  admin: {
    pagination: {
      defaultLimit: 20,
    },
  },
  fields: [
    {
      name: 'callAgain',
      type: 'checkbox',
      label: 'Call Again',
    },
    {
      name: 'error',
      type: 'text',
      label: 'Error Message',
    },
    {
      name: 'fromEmail',
      type: 'email',
      label: 'From Email',
      admin: {
        description: 'Origin email.',
      },
    },
    {
      name: 'fromPhone',
      type: 'text',
      label: 'From Phone Number',
      admin: {
        description: 'Origin phone number from FirmLeads. Must in following format +15183831312',
      },
    },
    {
      name: 'firm',
      type: 'relationship',
      relationTo: 'firms',
      label: 'Firm',
    },
    {
      name: 'meeting',
      type: 'relationship',
      relationTo: 'meetings',
      label: 'Meeting',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Users',
      // required: true,
    },
    // {
    //   name: 'requestUrl',
    //   type: 'text',
    //   label: 'Request URL',
    //   required: true,
    // },
    {
      name: 'emailReplyType',
      type: 'select',
      options: [
        {
          label: 'Host',
          value: 'host',
        },
        {
          label: 'No-Reply',
          value: 'noreply',
        },
      ],
    },
    {
      name: 'emailProvider',
      type: 'select',
      options: [
        {
          label: 'Google',
          value: 'google',
        },
        {
          label: 'Microsoft',
          value: 'microsoft',
        },
      ],
    },
    {
      name: 'emailIntegration',
      type: 'relationship',
      relationTo: 'integrations',
      label: 'Email Integration',
    },
    {
      name: 'scheduledTime',
      type: 'date',
      label: 'Scheduled Time',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Delivered', value: 'delivered' },
        { label: 'Failed', value: 'failed' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Sent', value: 'sent' },
        { label: 'Unknown', value: 'unknown' },
        { label: 'Canceled', value: 'canceled' },
      ],
    },
    {
      name: 'toPhone',
      type: 'text',
      label: 'To Phone Number',
      admin: {
        description: `Destination phone number. Must in following format +15183831312`,
      },
    },
    {
      name: 'toEmail',
      type: 'email',
      label: 'To Email',
      admin: {
        description: `Destination email. `,
      },
    },
    {
      name: 'subject',
      type: 'text',
      admin: {
        description: `Email subject line.`,
      },
    },
    {
      name: 'textBody',
      type: 'text',
      admin: {
        description: `Text message body`,
      },
    },
    {
      name: 'emailBody',
      type: 'text',
      admin: {
        description: `Email body`,
      },
    },
    {
      name: 'transferTo',
      type: 'text',
      label: 'Transfer To Phone Number',
      admin: {
        description: `Destination, the the law firm's phone number. Must in following format +15183831312`,
      },
    },
    {
      name: 'type',
      type: 'select',
      label: 'Interaction Type',
      options: [
        { label: 'Text Message', value: '0' },
        { label: 'Email', value: '1' },
        { label: 'Phone Call', value: '2' },
      ],
      required: true,
    },
  ],
}

export default Interactions
