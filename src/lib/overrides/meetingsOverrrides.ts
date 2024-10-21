import { FieldsOverride } from 'node_modules/@payloadcms/plugin-form-builder/dist/types'
import { Field } from 'payload'

const meetingsOverride: FieldsOverride = () => {
  const fields: Field[] = [
    {
      type: 'row',
      fields: [
        {
          name: 'startTime',
          type: 'date',
          admin: {
            readOnly: true,
            style: {
              maxWidth: '285px',
            },
          },
        },
        {
          name: 'endTime',
          type: 'date',
          admin: {
            readOnly: true,
            style: {
              maxWidth: '285px',
            },
          },
        },
      ],
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        readOnly: true,
        style: {
          maxWidth: '285px',
        },
      },
    },
    {
      name: 'hosts',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        style: {
          maxWidth: '285px',
        },
        readOnly: true,
      },
    },
    {
      name: 'invitees',
      type: 'array',
      admin: {
        style: {
          maxWidth: '285px',
        },
        readOnly: true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'email',
          type: 'email',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'meetingType',
      type: 'relationship',
      admin: {
        readOnly: true,
        style: {
          maxWidth: '285px',
        },
      },
      relationTo: 'meeting-templates',
      required: true,
      validate: async (value: any, { req: { payload }, req }: any): Promise<any> => {
        /* Don't run in the client side */
        if (!payload) {
          return true
        }

        if (payload) {
          let _existingForm

          try {
            _existingForm = await payload.findByID({
              id: value,
              collection: 'meeting-templates',
              req,
            })

            return true
          } catch (error) {
            return 'Cannot create this submission because this form does not exist.'
          }
        }
      },
    },
    {
      name: 'submissionData',
      type: 'array',
      admin: {
        readOnly: true,
        style: {
          maxWidth: '285px',
        },
      },
      fields: [
        {
          name: 'field',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          validate: (value: unknown) => {
            // TODO:
            // create a validation function that dynamically
            // relies on the field type and its options as configured.

            // How to access sibling data from this field?
            // Need the `name` of the field in order to validate it.

            // Might not be possible to use this validation function.
            // Instead, might need to do all validation in a `beforeValidate` collection hook.

            if (typeof value !== 'undefined') {
              return true
            }

            return 'This field is required.'
          },
        },
      ],
    },
  ]
  return fields
}

export default meetingsOverride
