import { CollectionConfig } from 'payload'
// import { accountFilterOption } from '../validatation/accountFilterOption'
// import { accountValidation } from '../validatation/accountValidation'
import { readByDomain } from '../Pages/access/readByDomain'
import { superAdminFieldAccess, superAdminsCollectionAccess } from '../../lib/access/superAdmins'
import { firmUserCollectionAccess } from '../../lib/access/firmUserCollectionAccess'
import FirmFieldUnique from '../fields/FirmField/FirmFieldUnique'
import { filterUserCalendars } from './filter/filterUserCalendars'

const availabilityOptions = [
  '12:00am',
  '12:15am',
  '12:30am',
  '12:45am',
  '1:00am',
  '1:15am',
  '1:30am',
  '1:45am',
  '2:00am',
  '2:15am',
  '2:30am',
  '2:45am',
  '3:00am',
  '3:15am',
  '3:30am',
  '3:45am',
  '4:00am',
  '4:15am',
  '4:30am',
  '4:45am',
  '5:00am',
  '5:15am',
  '5:30am',
  '5:45am',
  '6:00am',
  '6:15am',
  '6:30am',
  '6:45am',
  '7:00am',
  '7:15am',
  '7:30am',
  '7:45am',
  '8:00am',
  '8:15am',
  '8:30am',
  '8:45am',
  '9:00am',
  '9:15am',
  '9:30am',
  '9:45am',
  '10:00am',
  '10:15am',
  '10:30am',
  '10:45am',
  '11:00am',
  '11:15am',
  '11:30am',
  '11:45am',
  '12:00pm',
  '12:15pm',
  '12:30pm',
  '12:45pm',
  '1:00pm',
  '1:15pm',
  '1:30pm',
  '1:45pm',
  '2:00pm',
  '2:15pm',
  '2:30pm',
  '2:45pm',
  '3:00pm',
  '3:15pm',
  '3:30pm',
  '3:45pm',
  '4:00pm',
  '4:15pm',
  '4:30pm',
  '4:45pm',
  '5:00pm',
  '5:15pm',
  '5:30pm',
  '5:45pm',
  '6:00pm',
  '6:15pm',
  '6:30pm',
  '6:45pm',
  '7:00pm',
  '7:15pm',
  '7:30pm',
  '7:45pm',
  '8:00pm',
  '8:15pm',
  '8:30pm',
  '8:45pm',
  '9:00pm',
  '9:15pm',
  '9:30pm',
  '9:45pm',
  '10:00pm',
  '10:15pm',
  '10:30pm',
  '10:45pm',
  '11:00pm',
  '11:15pm',
  '11:30pm',
  '11:45pm',
]

const AvailabilitySettings: CollectionConfig = {
  slug: 'availability-settings',
  labels: {
    singular: 'Availability Setting',
    plural: 'Availability Settings',
  },
  access: {
    read: readByDomain,
    create: superAdminsCollectionAccess,
    update: firmUserCollectionAccess,
    delete: superAdminsCollectionAccess,
  },
  admin: {
    components: { edit: { SaveButton: '@/components/GlobalTitle' } },
    pagination: {
      defaultLimit: 20,
    },
  },
  fields: [
    {
      name: 'timezone',
      type: 'select',
      label: 'Timezone',
      admin: {
        style: {
          maxWidth: '480px',
        },
        position: 'sidebar',
      },
      options: [
        { label: 'Hawaii Time', value: 'Pacific/Honolulu' },
        { label: 'Alaska Time', value: 'America/Anchorage' },
        { label: 'Pacific Time', value: 'America/Los_Angeles' },
        { label: 'Mountain Time', value: 'America/Denver' },
        { label: 'Central Time', value: 'America/Chicago' },
        { label: 'Eastern Time', value: 'America/New_York' },
        { label: 'Atlantic Time', value: 'America/Halifax' },
        { label: 'Newfoundland Time', value: 'America/St_Johns' },
        { label: 'Greenwich Mean Time', value: 'Etc/GMT' },
        { label: 'British Summer Time', value: 'Europe/London' },
        { label: 'Central European Time', value: 'Europe/Berlin' },
        { label: 'Eastern European Time', value: 'Europe/Kiev' },
        { label: 'Moscow Time', value: 'Europe/Moscow' },
        { label: 'India Standard Time', value: 'Asia/Kolkata' },
        { label: 'China Standard Time', value: 'Asia/Shanghai' },
        { label: 'Japan Standard Time', value: 'Asia/Tokyo' },
        { label: 'Australian Eastern Standard Time', value: 'Australia/Sydney' },
        { label: 'New Zealand Standard Time', value: 'Pacific/Auckland' },
      ],
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'User',
      required: true,
      index: true,
      unique: true,
      access: {
        create: superAdminFieldAccess,
        update: superAdminFieldAccess,
      },
      admin: {
        position: 'sidebar',
        readOnly: true,
        style: {
          maxWidth: '470px',
        },
      },
      // filterOptions: accountFilterOption,
      // validate: accountValidation('contacts'),
    },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'calendars',
              label: 'My Calendars',
              type: 'relationship',
              relationTo: 'auth-tokens',
              filterOptions: filterUserCalendars,
              admin: {
                readOnly: true,
                style: {
                  maxWidth: '580px',
                },
                components: {
                  Description: '@/components/MyCalendarsDescription',
                },
              },
            },

            {
              name: 'checkConflicts',
              label: 'Check for conflicts',
              type: 'relationship',
              relationTo: 'auth-tokens',
              hasMany: true,
              filterOptions: filterUserCalendars,
              admin: {
                description:
                  'Set the calendar(s) to check for conflicts to prevent double bookings.',
                condition: (_, siblingData) =>
                  siblingData.calendars && siblingData.calendars.length > 0,
                style: {
                  maxWidth: '580px',
                },
              },
            },
            {
              name: 'addToCalendars',
              label: 'Add To Calendar',
              type: 'relationship',
              relationTo: 'auth-tokens',
              hasMany: true,
              filterOptions: filterUserCalendars,
              admin: {
                description:
                  'Set the calendar you would like to add new events to as they’re scheduled.',
                condition: (_, siblingData) =>
                  siblingData.calendars && siblingData.calendars.length > 0,
                style: {
                  maxWidth: '580px',
                },
              },
            },
          ],
        },
        {
          label: 'Availability',
          fields: [
            {
              name: 'weeklyHours',
              label: false,
              type: 'group',
              // admin: {
              //   style: {
              //     boxSizing: 'content-box',
              //     maxWidth: '580px',
              //   },
              // },
              admin: {
                style: {
                  maxWidth: '580px',
                },
              },
              fields: [
                {
                  name: 'monday',
                  type: 'array',
                  label: 'Monday',
                  labels: { singular: 'Monday Availability', plural: 'Monday Availabilities' },
                  admin: {
                    initCollapsed: true,
                    width: '50%',
                    style: {
                      maxWidth: '580px',
                    },
                    components: {
                      RowLabel: '@/components/AvailabilityRowLabel',
                    },
                  },
                  defaultValue: [{ startTime: '9:00am', endTime: '5:00pm' }],
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'startTime',
                          type: 'select',
                          label: false,
                          defaultValue: '9:00am',
                          options: availabilityOptions,
                        },
                        {
                          name: 'endTime',
                          type: 'select',
                          label: false,
                          defaultValue: '5:00pm',
                          options: availabilityOptions,
                        },
                      ],
                    },
                  ],
                },

                {
                  name: 'tuesday',
                  type: 'array',
                  label: 'Tuesday',
                  labels: { singular: 'Tuesday Availability', plural: 'Tuesday Availabilities' },
                  admin: {
                    initCollapsed: true,
                    style: {
                      // maxWidth: '580px',
                      width: '50%',
                    },
                    components: {
                      RowLabel: '@/components/AvailabilityRowLabel',
                    },
                  },
                  defaultValue: [{ startTime: '9:00am', endTime: '5:00pm' }],
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'startTime',
                          type: 'select',
                          label: false,
                          defaultValue: '9:00am',
                          options: availabilityOptions,
                        },
                        {
                          name: 'endTime',
                          type: 'select',
                          label: false,
                          defaultValue: '5:00pm',
                          options: availabilityOptions,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'wednesday',
                  type: 'array',
                  label: 'Wednesday',
                  labels: {
                    singular: 'Wednesday Availability',
                    plural: 'Wednesday Availabilities',
                  },
                  admin: {
                    initCollapsed: true,
                    style: {
                      maxWidth: '580px',
                    },
                    components: {
                      RowLabel: '@/components/AvailabilityRowLabel',
                    },
                  },
                  defaultValue: [{ startTime: '9:00am', endTime: '5:00pm' }],
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'startTime',
                          type: 'select',
                          label: false,
                          defaultValue: '9:00am',
                          options: availabilityOptions,
                        },
                        {
                          name: 'endTime',
                          type: 'select',
                          label: false,
                          defaultValue: '5:00pm',
                          options: availabilityOptions,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'thursday',
                  type: 'array',
                  label: 'Thursday',
                  labels: { singular: 'Thursday Availability', plural: 'Thursday Availabilities' },
                  admin: {
                    initCollapsed: true,
                    style: {
                      maxWidth: '580px',
                    },
                    components: {
                      RowLabel: '@/components/AvailabilityRowLabel',
                    },
                  },
                  defaultValue: [{ startTime: '9:00am', endTime: '5:00pm' }],
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'startTime',
                          type: 'select',
                          label: false,
                          defaultValue: '9:00am',
                          options: availabilityOptions,
                        },
                        {
                          name: 'endTime',
                          type: 'select',
                          label: false,
                          defaultValue: '5:00pm',
                          options: availabilityOptions,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'friday',
                  type: 'array',
                  label: 'Friday',
                  labels: { singular: 'Friday Availability', plural: 'Friday Availabilities' },
                  admin: {
                    initCollapsed: true,
                    style: {
                      maxWidth: '580px',
                    },
                    components: {
                      RowLabel: '@/components/AvailabilityRowLabel',
                    },
                  },
                  defaultValue: [{ startTime: '9:00am', endTime: '5:00pm' }],
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'startTime',
                          type: 'select',
                          label: false,
                          defaultValue: '9:00am',
                          options: availabilityOptions,
                        },
                        {
                          name: 'endTime',
                          type: 'select',
                          label: false,
                          defaultValue: '5:00pm',
                          options: availabilityOptions,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'saturday',
                  type: 'array',
                  label: 'Saturday',
                  labels: { singular: 'Saturday Availability', plural: 'Saturday Availabilities' },
                  admin: {
                    initCollapsed: true,
                    style: {
                      maxWidth: '580px',
                    },
                    components: {
                      RowLabel: '@/components/AvailabilityRowLabel',
                    },
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'startTime',
                          type: 'select',
                          label: false,
                          defaultValue: '9:00am',
                          options: availabilityOptions,
                        },
                        {
                          name: 'endTime',
                          type: 'select',
                          label: false,
                          defaultValue: '5:00pm',
                          options: availabilityOptions,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'Sunday',
                  type: 'array',
                  label: 'Sunday',
                  labels: { singular: 'Sunday Availability', plural: 'Sunday Availabilities' },
                  admin: {
                    initCollapsed: true,
                    style: {
                      maxWidth: '580px',
                    },
                    components: {
                      RowLabel: '@/components/AvailabilityRowLabel',
                    },
                  },
                  fields: [
                    {
                      type: 'row',

                      fields: [
                        {
                          name: 'startTime',
                          type: 'select',
                          label: false,
                          defaultValue: '9:00am',
                          options: availabilityOptions,
                        },
                        {
                          name: 'endTime',
                          type: 'select',
                          label: false,
                          defaultValue: '5:00pm',
                          options: availabilityOptions,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'lunchHours',
              type: 'group',
              label: 'Lunch Hours',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'startTime',
                      type: 'select',
                      label: 'Start Time',
                      defaultValue: '9:00am',
                      options: availabilityOptions,
                      admin: {
                        style: {
                          maxWidth: '235px',
                        },
                      },
                    },
                    {
                      name: 'endTime',
                      type: 'select',
                      label: 'End Time',
                      defaultValue: '5:00pm',
                      options: availabilityOptions,
                      admin: {
                        style: {
                          maxWidth: '235px',
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

    FirmFieldUnique,
  ],
}

export default AvailabilitySettings
