import { CollectionConfig } from 'payload'
import FirmField from './fields/FirmField'
import { firmUserCollectionAccess } from '../lib/access/firmUserCollectionAccess'
import { readByDomain } from './Pages/access/readByDomain'
import {
  lexicalEditor,
  BoldFeature,
  UnderlineFeature,
  OrderedListFeature,
  UnorderedListFeature,
  LinkFeature,
  ItalicFeature,
  FixedToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { ColorPickerField } from './fields/ColorPicker'

const EventTypes: CollectionConfig = {
  slug: 'event-types',
  labels: {
    singular: 'Event Type',
    plural: 'Event Types',
  },
  access: {
    read: readByDomain,
    create: firmUserCollectionAccess,
    update: firmUserCollectionAccess,
    delete: firmUserCollectionAccess,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    FirmField,
    {
      name: 'afterBooking',
      type: 'select',
      label: 'Event Type Type',
      required: true,
      options: [
        { value: 'redirect', label: 'Redirect To URL' },
        { value: 'confirm', label: 'Send To Confirmation Page' },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
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
      name: 'durationTime',
      type: 'number',
      label: 'Duration Time',
    },
    {
      name: 'durationUnit',
      type: 'select',
      label: 'Duration Unit',
      options: ['min', 'hrs'],
    },
    ColorPickerField(
      {
        name: 'color',
        label: 'Event Type Color',
        required: true,
      },
      {
        type: 'hexA',
      },
    ),
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
    },
    {
      name: 'name',
      type: 'text',
      label: 'Event Type Name',
      required: true,
    },
    {
      name: 'redirectUrl',
      type: 'text',
      label: 'RedirectUrl',
    },
    {
      name: 'type',
      type: 'select',
      label: 'Event Type Type',
      required: true,
      options: [
        { value: 'one_on_one', label: 'One-on-One' },
        { value: 'group', label: 'Group' },
        { value: 'collective', label: 'Collective' },
        { value: 'round-robin', label: 'Round Robin' },
      ],
    },
  ],
}

export default EventTypes
