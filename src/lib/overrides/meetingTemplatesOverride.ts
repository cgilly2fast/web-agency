import { FieldsOverride } from 'node_modules/@payloadcms/plugin-form-builder/dist/types'
import { BlocksField, Field, TabsField, UnnamedTab } from 'payload'
import {
  lexicalEditor,
  BoldFeature,
  UnderlineFeature,
  OrderedListFeature,
  UnorderedListFeature,
  LinkFeature,
  ItalicFeature,
  FixedToolbarFeature,
  BlockFields,
} from '@payloadcms/richtext-lexical'
import FirmField from '../../lib/fields/FirmField'
import { User } from '@/payload-types'
import {
  Checkbox,
  Country,
  Email,
  Message,
  Number,
  Text,
  Payment,
  Select,
  State,
  TextArea,
} from '@/lib/formBuilderBlocks'

function arrayToObject(arr: any[]) {
  let obj: Record<string, Field> = {}
  for (let i = 0; i < arr.length; i++) {
    obj[arr[i].name] = arr[i]
  }
  return obj
}

const meetingTemplatesOverride: FieldsOverride = ({ defaultFields }) => {
  const map = arrayToObject(defaultFields)

  let eventDetails: UnnamedTab = {
    label: 'Event Details',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
        admin: {
          style: {
            maxWidth: '580px',
          },
        },
      },
      {
        name: 'type',
        type: 'select',
        label: 'Meeting Type',
        required: true,
        options: [
          { value: 'one_on_one', label: 'One-on-One' },
          // { value: 'group', label: 'Group' },
          // { value: 'collective', label: 'Collective' },
          // { value: 'round-robin', label: 'Round Robin' },
        ],
        admin: {
          style: {
            maxWidth: '285px',
          },
        },
        validate: (val: any, { data }: any) => {
          if ((val === 'one_on_one' || val === 'group') && !data.host) {
            return 'Make sure to set a host.'
          }

          if ((val === 'collective' || val === 'round_robin') && !data.hosts) {
            return 'Make sure to set at least one host.'
          }
          return true
        },
      },
      {
        name: 'duration',
        label: 'Duration',
        type: 'select',
        admin: {
          style: {
            maxWidth: '285px',
          },
        },
        validate: (val: any, { data }: any) => {
          if (val === 'Custom') {
            if (data.durationTime && data.durationTime > 0) return true

            return 'Make sure Rolling Availability Time is set and is greater than 0.'
          }

          return true
        },
        options: ['15 min', '30 min', '45 min', '60 min', 'Custom'],
      },
      {
        type: 'row',
        admin: {
          condition: (_, siblingData) => {
            return siblingData?.duration === 'Custom'
          },
        },

        fields: [
          {
            name: 'durationTime',
            type: 'number',
            label: false,
            defaultValue: 20,
            admin: {
              style: {
                marginTop: '-12px',
                maxWidth: '135px',
              },
            },
          },
          {
            name: 'durationUnit',
            type: 'select',
            label: false,
            defaultValue: 'min',
            options: ['min', 'hrs'],
            admin: {
              style: {
                marginTop: '-12px',
                maxWidth: '140px',
              },
            },
          },
        ],
      },

      {
        name: 'location',
        type: 'select',
        label: 'Event Type Location',
        required: true,
        options: [
          { value: 'in_person', label: 'In-person meeting' },
          { value: 'zoom', label: 'Zoom' },
          { value: 'google_meet', label: 'Google Meet' },
          { value: 'phone_call', label: 'Phone call' },
        ],
        admin: {
          style: {
            maxWidth: '285px',
          },
        },
      },
      {
        name: 'hosts',
        label: 'Host',
        type: 'relationship',
        relationTo: 'users',
        defaultValue: ({ user }: { user: User }) => user.id,
        admin: {
          style: {
            maxWidth: '285px',
          },
          condition: (_, siblingData) =>
            siblingData?.type === 'one_on_one' || siblingData?.type === 'group',
        },
        filterOptions: ({ user }) => {
          return {
            firm: {
              equals: typeof user?.firm === 'string' ? user?.firm : user?.firm?.id,
            },
          }
        },
      },
      {
        name: 'hostsMulti',
        label: 'Hosts',
        type: 'relationship',
        relationTo: 'users',
        hasMany: true,
        admin: {
          style: {
            maxWidth: '285px',
          },
          condition: (_, siblingData) =>
            siblingData?.type === 'collective' || siblingData?.type === 'round_robin',
        },
        filterOptions: ({ user }) => {
          return {
            firm: {
              equals: typeof user?.firm === 'string' ? user?.firm : user?.firm?.id,
            },
          }
        },
      },
      {
        name: 'invites',
        label: 'Allow invitees to add guests',
        type: 'checkbox',
      },
      {
        name: 'description',
        type: 'richText',
        label: 'Description/Instructions',
        editor: lexicalEditor({
          features: [
            BoldFeature(),
            UnderlineFeature(),
            OrderedListFeature(),
            UnorderedListFeature(),
            LinkFeature(),
            ItalicFeature(),
            FixedToolbarFeature(),
          ],
        }),
        admin: {
          style: {
            maxWidth: '580px',
          },
        },
      },
    ],
  }

  let scheduleSettings: UnnamedTab = {
    label: 'Schedule Settings',
    fields: [
      {
        name: 'daysOutType',
        label: 'Date Range',
        type: 'radio',
        defaultValue: 'rolling',
        admin: {
          description: 'Invitees can schedule...',
        },
        validate: (val, { data }: any) => {
          if (val === 'rolling') {
            if (data.rollingTime && data.rollingTime > 0) return true

            return 'Make sure Rolling Availability Time is set and is greater than 0.'
          }

          if (val === 'date_range') {
            if (!data.dateRangeStart) {
              return 'Make sure Date Range Start is set.'
            }

            if (!data.dateRangeEnd) {
              return 'Make sure Date Range Start is set.'
            }
            return true
          }

          return true
        },
        options: [
          {
            label: 'Rolling into the future',
            value: 'rolling',
          },
          {
            label: 'Within a date range',
            value: 'date_range',
          },
          {
            label: 'Indefinitely into the future',
            value: 'indefinitely',
          },
        ],
      },

      {
        type: 'row',
        admin: {
          condition: (_, siblingData) => siblingData?.daysOutType === 'rolling',
        },
        fields: [
          {
            name: 'rollingTime',
            type: 'number',
            label: false,
            defaultValue: 2,
            admin: {
              style: {
                marginTop: '-12px',
                maxWidth: '210px',
              },
              description: 'into the future.',
            },
            validate: (value: number | null | undefined) => {
              if (!value || value > 0) return true

              return 'Enter a value greater than 0 or leave blank'
            },
          },
          {
            name: 'rollingUnit',
            type: 'select',
            label: false,
            defaultValue: 'calendar_days',
            options: [
              { value: 'calendar_days', label: 'Calendar Days' },
              { value: 'weekdays', label: 'Weekdays' },
            ],
            admin: {
              style: {
                marginTop: '-12px',
                maxWidth: '360px',
              },
            },
          },
        ],
      },
      {
        type: 'row',
        admin: {
          condition: (_, siblingData) => siblingData?.daysOutType === 'date_range',
        },
        fields: [
          {
            name: 'dateRangeStart',
            label: 'Date Range Start',
            type: 'date',
            admin: {
              style: {
                maxWidth: '285px',
              },
            },
          },

          {
            name: 'dateRangeEnd',
            label: 'Date Range End',
            type: 'date',
            admin: {
              style: {
                maxWidth: '285px',
              },
            },
          },
        ],
      },

      {
        name: 'limits',
        label: 'Event Limits',
        type: 'group',
        fields: [
          {
            type: 'collapsible',
            admin: {
              description: 'Add time before or after booked events.',
              initCollapsed: true,
              style: {
                maxWidth: '580px',
              },
              components: {
                RowLabel: '@/components/BufferTimeRowLabel',
              },
            },
            fields: [
              {
                name: 'bufferTimeBefore',
                type: 'select',
                label: 'Buffer Time Before',
                options: [
                  '0 min',
                  '5 min',
                  '10 min',
                  '15 min',
                  '30 min',
                  '45 min',
                  '1 hr',
                  '1 hr 30 min',
                  '2 hrs',
                  '2hrs 30 min',
                  '3 hrs',
                ],
                admin: {
                  description: 'Add time before or after booked appointment events.',
                },
              },
              {
                name: 'bufferTimeAfter',
                type: 'select',
                label: 'Buffer Time After',
                options: [
                  '0 min',
                  '5 min',
                  '10 min',
                  '15 min',
                  '30 min',
                  '45 min',
                  '1 hr',
                  '1 hr 30 min',
                  '2 hrs',
                  '2hrs 30 min',
                  '3 hrs',
                ],
                admin: {
                  description: 'Add time before or after booked appointment events.',
                },
              },
            ],
          },
          {
            type: 'collapsible',
            admin: {
              description: 'Set the minimum amount of notice that is required.',
              initCollapsed: true,
              style: {
                maxWidth: '580px',
              },
              components: {
                RowLabel: '@/components/MinNoticeRowLabel',
              },
            },
            fields: [
              {
                name: 'minNoticeUnit',
                type: 'select',
                hasMany: true,
                label: 'Min Notice Unit',
                defaultValue: 'hours',
                options: [
                  {
                    label: 'Minutes',
                    value: 'minutes',
                  },
                  {
                    label: 'Hours',
                    value: 'hours',
                  },
                  {
                    label: 'Days',
                    value: 'days',
                  },
                ],
              },
              {
                name: 'minNoticeTime',
                type: 'number',
                label: 'Min Notice Time',
                validate: (value: number | null | undefined) => {
                  if (!value || value >= 0) return true

                  return 'Enter a non-negative number or leave blank'
                },
              },
            ],
          },
          {
            type: 'collapsible',
            admin: {
              description: 'Set the maximum events allowed per day.',
              initCollapsed: true,
              style: {
                maxWidth: '580px',
              },
              components: {
                RowLabel: '@/components/DailyLimitRowLabel',
              },
            },
            fields: [
              {
                name: 'dailyLimit',
                type: 'number',
                validate: (value: number | null | undefined) => {
                  if (!value || value > 0) return true

                  return 'Enter a value greater than 0 or leave blank'
                },
              },
            ],
          },
        ],
      },
      {
        name: 'options',
        label: 'Additional Options',
        type: 'group',
        fields: [
          {
            type: 'collapsible',
            admin: {
              description: 'Add time before or after booked events.',
              initCollapsed: true,
              style: {
                maxWidth: '580px',
              },
              components: {
                RowLabel: '@/components/TimezoneDisplayRowLabel',
              },
            },
            fields: [
              {
                name: 'timezoneDisplay',
                type: 'radio',
                defaultValue: 'invitees',
                options: [
                  {
                    label: "Automatically detect and show the times in my invitee's time zone",
                    value: 'invitees',
                  },
                  {
                    label: 'Lock the timezone (best for in-person events)',
                    value: 'lock',
                  },
                ],
                admin: {
                  description: 'Sets how timezone shows on your booking page.',
                },
              },
            ],
          },
          {
            type: 'collapsible',
            admin: {
              description: 'Add time before or after booked appointments.',
              initCollapsed: true,
              style: {
                maxWidth: '580px',
              },
              components: {
                RowLabel: '@/components/IncrementsRowLabel',
              },
            },
            fields: [
              {
                name: 'increments',
                type: 'select',
                label: false,
                options: [
                  '5 min',
                  '10 min',
                  '15 min',
                  '20 min',
                  '30 min',
                  '45 min',
                  '60 min',
                  'Custom',
                ],
                admin: {
                  description: 'Show available start times in increments of...',
                },
                validate: (val: any, { data }: any) => {
                  if (val === 'Custom') {
                    if (data.incrementTime && data.incrementTime > 0) return true

                    return 'Make sure Increment Time is set and is greater than 0.'
                  }

                  return true
                },
              },
              {
                type: 'row',
                fields: [
                  {
                    name: 'incrementTime',
                    type: 'number',
                    label: 'Increment Time',
                    admin: {
                      description: 'Set the frequency time of available time slots for invitees.',
                      condition: (_, siblingData) => siblingData?.increments === 'Custom',
                      width: '50%',
                    },
                    validate: (value: number | null | undefined) => {
                      if (!value || value > 0) return true

                      return 'Enter a value greater than 0 or leave blank'
                    },
                  },
                  {
                    name: 'incrementUnit',
                    type: 'select',
                    label: 'Increment Unit',
                    defaultValue: 'min',
                    options: ['min', 'hrs'],
                    admin: {
                      description: 'Set the frequency units of available time slots for invitees.',
                      condition: (_, siblingData) => siblingData?.increments === 'Custom',
                      width: '50%',
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

  let bookingPage: UnnamedTab = {
    label: 'Booking Page Options',
    fields: [
      {
        name: 'link',
        type: 'text',

        admin: {
          description:
            "Direct Event URL is the link you can share with your invitees and go directly to the 'Pick Date & Time' step. We'll automatically generate an Event URL for you if you don't specify one.",
          style: { maxWidth: '580px', marginBottom: '36px' },
          components: {
            beforeInput: ['@/components/BookingPageUrlPreview'],
          },
        },
        validate: (val: any) => {
          const regex = /^[a-z0-9_-]+$/
          if (!regex.test(val)) {
            return "Invalid. Please use lowercase only 'a-z', '0-9', '-', or '_' characters"
          }
          return true
        },
      },
      {
        name: 'bookingForm',
        type: 'group',
        fields: [
          {
            // ...map.fields,
            label: false,
            labels: { singular: 'New Question', plural: 'Invitee Questions' },
            admin: {
              style: {
                maxWidth: '580px',
              },
              description: 'Questions given to the invitee before booking is completed.',
              initCollapsed: true,
            },
            name: 'fields',
            type: 'blocks',
            blocks: [
              Select,
              Text,
              TextArea,
              Number,
              Email,
              State,
              Country,
              Checkbox,
              // Payment,
              Message,
            ],
          } as BlocksField,
          {
            name: 'payment',
            type: 'radio',
            defaultValue: 'none',
            admin: {
              style: {
                maxWidth: '285px',
                marginTop: '36px',
              },
            },
            options: [
              { label: 'Do not collect payments for this event', value: 'none' },
              { label: 'Accept payments with Stripe', value: 'stripe' },
              // { label: 'Accept payments with PayPal', value: 'paypal' },
            ],
          },
          {
            type: 'row',
            fields: [
              {
                name: 'paymentAmount',
                type: 'number',
                defaultValue: 0.0,
                admin: {
                  style: { maxWidth: '155px' },
                  condition: (_, siblingData) => siblingData?.payment !== 'none',
                },
                validate: (val: any) => {
                  if (val < 0) {
                    return 'Please specify a number greater than 0'
                  }

                  if ((val * 100) % 1 !== 0) {
                    return 'Make sure your amount is round to the nearest .00'
                  }
                  return true
                },
              },
              {
                name: 'dollarType',
                type: 'select',
                defaultValue: 'USD',
                options: ['USD', 'EUR', 'CAD', 'GBP', 'AUD'],
                admin: {
                  style: { maxWidth: '120px' },
                  condition: (_, siblingData) => siblingData?.payment !== 'none',
                },
              },
            ],
          },
          {
            name: 'paymentTerms',
            type: 'textarea',
            admin: {
              description:
                'Make sure you have your selected payment method set up in your integrations tab!',
              style: {
                maxWidth: '285px',
              },
              condition: (_, siblingData) => siblingData?.payment !== 'none',
            },
          },
        ],
      },
      {
        name: 'confirmation',
        type: 'group',
        fields: [
          {
            name: 'confirmationType',
            type: 'radio',
            admin: {
              description:
                'Choose whether to display an on-page message or redirect to a different page after they submit the form.',
              layout: 'horizontal',
              style: {
                maxWidth: '580px',
              },
            },
            defaultValue: 'message',
            options: [
              {
                label: 'Message',
                value: 'message',
              },
              {
                label: 'Redirect',
                value: 'redirect',
              },
            ],
          },
          {
            name: 'confirmationMessage',
            type: 'richText',
            admin: {
              condition: (_, siblingData) => siblingData?.confirmationType === 'message',
            },
            localized: true,
            editor: lexicalEditor({
              features: [
                BoldFeature(),
                UnderlineFeature(),
                OrderedListFeature(),
                UnorderedListFeature(),
                LinkFeature(),
                ItalicFeature(),
                FixedToolbarFeature(),
              ],
            }),
          },

          {
            name: 'url',
            type: 'text',
            label: 'URL to redirect to',
            required: true,
            admin: {
              style: {
                maxWidth: '580px',
              },
              condition: (_, siblingData) => siblingData?.confirmationType === 'redirect',
            },
          },
        ],
      },
    ],
  }

  let notifications: UnnamedTab = {
    label: 'Notifications',
    fields: [
      {
        name: 'replyToAddress',
        type: 'select',
        label: 'Reply-to Address',
        defaultValue: 'host',
        options: [
          { label: "Host's email address", value: 'host' },
          { label: 'No-reply address', value: 'no-reply' },
        ],
        admin: {
          description:
            'The email address that will show to your contacts. Select No-reply address if you do not want your invitee to see your email address. This setting applies to all emails for this event.',
          style: {
            maxWidth: '580px',
          },
        },
      },
      {
        name: 'confirmationNotif',
        label: 'Confirmation Notification',
        type: 'group',
        fields: [
          {
            name: 'confirmType',
            label: 'Confirmation Notification Type',
            type: 'radio',
            defaultValue: 'calendar',
            admin: {
              style: {
                maxWidth: '580px',
              },
              description:
                'Choose how invitees will receive event confirmation. Calendar invite sends a calendar event invite, email confirmation sends an email confirmation.',
            },

            options: [
              {
                label: 'Calendar Invitation',
                value: 'calendar',
              },
              {
                label: 'Email Confirmation',
                value: 'email',
              },
            ],
          },
          {
            label: 'Calendar Invitation',
            type: 'collapsible',
            admin: {
              description:
                'A calendar invitation is sent to your invitee when booking, which adds the event to their calendar.',
              condition: (_, siblingData) => siblingData?.confirmType === 'calendar',
              initCollapsed: true,
              style: {
                maxWidth: '580px',
              },
            },
            fields: [
              {
                name: 'calendarInvitation',
                type: 'group',
                label: false,
                fields: [
                  {
                    name: 'title',
                    type: 'richText',
                    admin: {
                      style: {
                        maxWidth: '580px',
                      },
                      description: 'Calendar event invite title.',
                    },
                    localized: true,
                    editor: lexicalEditor({
                      features: [FixedToolbarFeature()],
                    }),
                  },
                  {
                    name: 'body',
                    type: 'richText',
                    admin: {
                      style: {
                        maxWidth: '580px',
                      },
                      description: 'Calendar event invite body.',
                    },
                    localized: true,
                    editor: lexicalEditor({
                      features: [FixedToolbarFeature()],
                    }),
                  },
                ],
              },
            ],
          },
          {
            label: 'Email Confirmation',
            type: 'collapsible',
            admin: {
              description:
                'Your invitee will receive an email confirmation with links to create their own calendar event.',
              initCollapsed: true,
              condition: (_, siblingData) => siblingData?.confirmType === 'email',
              style: {
                maxWidth: '580px',
              },
            },
            fields: [
              {
                name: 'emailConfirmation',
                type: 'group',
                label: false,
                fields: [
                  {
                    name: 'replyToAddress',
                    type: 'select',
                    label: 'Reply-to Address',
                    defaultValue: 'host',
                    options: [
                      { label: "Host's email address", value: 'host' },
                      { label: 'No-reply address', value: 'no-reply' },
                    ],
                    admin: {
                      description:
                        'The email address that will show to your contacts. Select No-reply address if you do not want your invitee to see your email address. This setting applies to all emails for this event.',
                    },
                  },
                  {
                    name: 'subject',
                    type: 'richText',
                    admin: {
                      style: {
                        maxWidth: '580px',
                      },
                      description: 'Cancelation email subject',
                    },
                    localized: true,
                    editor: lexicalEditor({
                      features: [FixedToolbarFeature()],
                    }),
                  },
                  {
                    name: 'body',
                    type: 'richText',
                    admin: {
                      style: {
                        maxWidth: '580px',
                      },
                      description: 'Cancelation email body',
                    },
                    localized: true,
                    editor: lexicalEditor({
                      features: [
                        BoldFeature(),
                        LinkFeature(),
                        ItalicFeature(),
                        FixedToolbarFeature(),
                      ],
                    }),
                  },
                ],
              },
            ],
          },
          {
            label: 'Email Cancelation',
            type: 'collapsible',
            admin: {
              description:
                'Your invitee will receive a cancellation email when the event is cancelled.',
              initCollapsed: true,
              condition: (_, siblingData) => siblingData?.confirmType === 'email',
              style: {
                maxWidth: '580px',
              },
            },
            fields: [
              {
                name: 'emailCancelation',
                type: 'group',
                label: false,
                fields: [
                  {
                    name: 'subject',
                    type: 'richText',
                    admin: {
                      style: {
                        maxWidth: '580px',
                      },
                    },
                    localized: true,
                    editor: lexicalEditor({
                      features: [FixedToolbarFeature()],
                    }),
                  },
                  {
                    name: 'body',
                    type: 'richText',
                    admin: {
                      style: {
                        maxWidth: '580px',
                      },
                    },
                    localized: true,
                    editor: lexicalEditor({
                      features: [
                        BoldFeature(),
                        LinkFeature(),
                        ItalicFeature(),
                        FixedToolbarFeature(),
                      ],
                    }),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'scheduledNotifs',
        label: 'Scheduled Notifications',
        type: 'group',
        fields: [
          {
            label: 'Email Reminders',
            type: 'collapsible',
            admin: {
              description:
                'An invitee will receive a reminder email before a scheduled event at specified times.',
              initCollapsed: true,
              style: {
                maxWidth: '580px',
              },
            },
            fields: [
              {
                name: 'emailReminders',
                type: 'group',
                label: false,
                admin: {},
                fields: [
                  {
                    name: 'active',
                    type: 'checkbox',
                    label: 'Active',
                    admin: {
                      description: 'Check box to activate.',
                    },
                  },
                  {
                    name: 'subject',
                    type: 'richText',
                    admin: {
                      style: {
                        maxWidth: '580px',
                      },
                      description: 'Cancelation email subject',
                    },
                    localized: true,
                    editor: lexicalEditor({
                      features: [FixedToolbarFeature()],
                    }),
                  },
                  {
                    name: 'body',
                    type: 'richText',
                    admin: {
                      style: {
                        maxWidth: '580px',
                      },
                      description: 'Cancelation email body',
                    },
                    localized: true,
                    editor: lexicalEditor({
                      features: [
                        BoldFeature(),
                        LinkFeature(),
                        ItalicFeature(),
                        FixedToolbarFeature(),
                      ],
                    }),
                  },
                  {
                    name: 'timing',
                    type: 'array',
                    labels: { singular: 'Reminder', plural: 'Reminders' },
                    maxRows: 8,
                    admin: {
                      initCollapsed: true,
                      components: {
                        RowLabel: '@/components/TimingReminderRowLabel',
                      },
                    },
                    fields: [
                      {
                        type: 'row',

                        fields: [
                          {
                            name: 'time',
                            type: 'number',
                            label: false,
                            defaultValue: 20,
                            admin: {
                              style: {
                                maxWidth: '135px',
                              },
                              description: 'Before event..',
                            },
                          },
                          {
                            name: 'unit',
                            type: 'select',
                            label: false,
                            defaultValue: 'min',
                            options: ['min', 'hrs'],
                            admin: {
                              style: {
                                maxWidth: '140px',
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
          },
          {
            label: 'Text Reminders',
            type: 'collapsible',
            admin: {
              description:
                'Your invitees will have the option of receiving text reminders before a scheduled event at specified times.',
              initCollapsed: true,
              style: {
                maxWidth: '580px',
              },
            },
            fields: [
              {
                name: 'textReminders',
                type: 'group',
                label: false,
                admin: {},
                fields: [
                  {
                    name: 'active',
                    type: 'checkbox',
                    label: 'Active',
                    admin: {
                      description: 'Check box to activate.',
                    },
                  },
                  {
                    name: 'message',
                    label: 'Text Message',
                    type: 'richText',
                    admin: {
                      style: {
                        maxWidth: '580px',
                      },
                    },
                    localized: true,
                    editor: lexicalEditor({
                      features: [FixedToolbarFeature()],
                    }),
                  },
                  {
                    name: 'timing',
                    type: 'array',
                    labels: { singular: 'Reminder', plural: 'Reminders' },
                    maxRows: 8,
                    admin: {
                      initCollapsed: true,
                      components: {
                        RowLabel: '@/components/TimingReminderRowLabel',
                      },
                    },
                    fields: [
                      {
                        type: 'row',

                        fields: [
                          {
                            name: 'time',
                            type: 'number',
                            label: false,
                            defaultValue: 20,
                            admin: {
                              style: {
                                maxWidth: '135px',
                              },
                              description: 'Before event..',
                            },
                          },
                          {
                            name: 'unit',
                            type: 'select',
                            label: false,
                            defaultValue: 'min',
                            options: ['min', 'hrs'],
                            admin: {
                              style: {
                                maxWidth: '140px',
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
          },
          {
            label: 'Email Follow-Up',
            type: 'collapsible',
            admin: {
              description:
                'An invitee will receive a reminder email before a scheduled event at specified times.',
              initCollapsed: true,
              style: {
                maxWidth: '580px',
              },
            },
            fields: [
              {
                name: 'emailFollowUp',
                type: 'group',
                label: false,
                fields: [
                  {
                    name: 'active',
                    type: 'checkbox',
                    label: 'Active',
                    admin: {
                      description: 'Check box to activate.',
                    },
                  },
                  {
                    name: 'subject',
                    type: 'richText',
                    admin: {
                      style: {
                        maxWidth: '580px',
                      },
                      description: 'Cancelation email subject',
                    },
                    localized: true,
                    editor: lexicalEditor({
                      features: [FixedToolbarFeature()],
                    }),
                  },
                  {
                    name: 'body',
                    type: 'richText',
                    admin: {
                      style: {
                        maxWidth: '580px',
                      },
                      description: 'Cancelation email body',
                    },
                    localized: true,
                    editor: lexicalEditor({
                      features: [
                        BoldFeature(),
                        LinkFeature(),
                        ItalicFeature(),
                        FixedToolbarFeature(),
                      ],
                    }),
                  },
                  {
                    name: 'timing',
                    type: 'array',
                    labels: { singular: 'Follow-Up', plural: 'Follow-Ups' },
                    maxRows: 8,
                    admin: {
                      initCollapsed: true,
                      components: {
                        RowLabel: '@/components/TimingFollowUpRowLabel',
                      },
                    },
                    fields: [
                      {
                        type: 'row',

                        fields: [
                          {
                            name: 'time',
                            type: 'number',
                            label: false,
                            defaultValue: 20,
                            admin: {
                              style: {
                                maxWidth: '135px',
                              },
                              description: 'After event..',
                            },
                          },
                          {
                            name: 'unit',
                            type: 'select',
                            label: false,
                            defaultValue: 'min',
                            options: ['min', 'hrs'],
                            admin: {
                              style: {
                                maxWidth: '140px',
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
          },
        ],
      },
      {
        name: 'cancelationPolicy',
        type: 'textarea',
        admin: {
          style: {
            maxWidth: '580px',
          },
          description:
            'Use this optional setting to add a cancellation policy for your event. The text entered here will appear in all email notifications sent to your invitee.',
        },
      },
    ],
  }

  let tabs: TabsField = {
    type: 'tabs',
    tabs: [eventDetails, scheduleSettings, bookingPage, notifications],
  }
  return [tabs, FirmField]
}

export default meetingTemplatesOverride
