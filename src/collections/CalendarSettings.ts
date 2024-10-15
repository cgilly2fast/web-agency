import { CollectionConfig } from 'payload'
// import { accountFilterOption } from '../validatation/accountFilterOption'
// import { accountValidation } from '../validatation/accountValidation'
import { readByDomain } from './Pages/access/readByDomain'
import { superAdminsCollectionAccess } from './access/superAdmins'
import { tenantUserCollectionAccess } from './access/tenantUserCollectionAccess'
import TenantField from './fields/TenantField/TenantFieldUnique'

const CalendarSetting: CollectionConfig = {
  slug: 'calendar-settings',
  labels: {
    singular: 'Calendar Setting',
    plural: 'Calendar Settings',
  },
  access: {
    read: readByDomain,
    create: superAdminsCollectionAccess,
    update: tenantUserCollectionAccess,
    delete: superAdminsCollectionAccess,
  },
  admin: {
    useAsTitle: 'user',
  },
  fields: [
    TenantField,
    {
      name: 'bufferTime',
      type: 'select',
      label: 'Buffer Time',
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
      name: 'daysOutType',
      type: 'radio',
      options: [
        {
          label: 'Rolling',
          value: 'rolling',
        },
        {
          label: 'Date Range',
          value: 'date_range',
        },
        {
          label: 'Indefinitely',
          value: 'indefinitely',
        },
      ],
    },
    {
      name: 'incrementTime',
      type: 'number',
      label: 'Increment Time',
      admin: {
        description: 'Set the frequency time of available time slots for invitees.',
      },
    },
    {
      name: 'incrementUnit',
      type: 'select',
      label: 'Increment Unit',
      options: ['min', 'hrs'],
      admin: {
        description: 'Set the frequency units of available time slots for invitees.',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'User',
      required: true,
      index: true,
      unique: true,
      // filterOptions: accountFilterOption,
      // validate: accountValidation('contacts'),
    },

    {
      name: 'twoWaySync',
      type: 'checkbox',
      label: 'Two Way Sync',
    },
    {
      name: 'days',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Monday',
          value: 'monday',
        },
        {
          label: 'Tuesday',
          value: 'tuesday',
        },
        {
          label: 'wednesday',
          value: 'Wednesday',
        },
        {
          label: 'Thursday',
          value: 'thursday',
        },
        {
          label: 'Friday',
          value: 'friday',
        },
        {
          label: 'Saturday',
          value: 'saturday',
        },
        {
          label: 'Sunday',
          value: 'sunday',
        },
      ],
    },
    {
      name: 'monday',
      type: 'array',
      label: 'Monday Availability',
      minRows: 1,
      fields: [
        {
          name: 'startTime',
          type: 'text',
          label: 'Start Time',
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'End Time',
        },
      ],
    },
    {
      name: 'tuesday',
      type: 'array',
      label: 'Tuesday Availability',
      minRows: 1,
      fields: [
        {
          name: 'startTime',
          type: 'text',
          label: 'Start Time',
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'End Time',
        },
      ],
    },
    {
      name: 'wednesday',
      type: 'array',
      label: 'Wednesday Availability',
      minRows: 1,
      fields: [
        {
          name: 'startTime',
          type: 'text',
          label: 'Start Time',
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'End Time',
        },
      ],
    },
    {
      name: 'thursday',
      type: 'array',
      label: 'Thursday Availability',
      minRows: 1,
      fields: [
        {
          name: 'startTime',
          type: 'text',
          label: 'Start Time',
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'End Time',
        },
      ],
    },
    {
      name: 'friday',
      type: 'array',
      label: 'Friday Availability',
      minRows: 1,
      fields: [
        {
          name: 'startTime',
          type: 'text',
          label: 'Start Time',
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'End Time',
        },
      ],
    },
    {
      name: 'saturday',
      type: 'array',
      label: 'Saturday Availability',
      minRows: 1,
      fields: [
        {
          name: 'startTime',
          type: 'text',
          label: 'Start Time',
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'End Time',
        },
      ],
    },
    {
      name: 'Sunday',
      type: 'array',
      label: 'Sunday Availability',
      minRows: 1,
      fields: [
        {
          name: 'startTime',
          type: 'text',
          label: 'Start Time',
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'End Time',
        },
      ],
    },
    {
      name: 'lunchHours',
      type: 'group',
      label: 'Lunch Hours',
      fields: [
        {
          name: 'startTime',
          type: 'text',
          label: 'Start Time',
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'End Time',
        },
      ],
    },
    {
      name: 'minNoticeUnit',
      type: 'select',
      hasMany: true,
      label: 'Min Notice Unit',
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
    },
    {
      name: 'rollingUnit',
      type: 'select',
      label: 'Rolling Availability Units',
      options: [
        { value: 'calendar_days', label: 'Calendar Days' },
        { value: 'weekdays', label: 'Weekdays' },
      ],
    },
    {
      name: 'rollingTime',
      type: 'number',
      label: 'Rolling Availability Time',
    },
    {
      name: 'timezone',
      type: 'text',
      label: 'Timezone',
    },
  ],
}

export default CalendarSetting
