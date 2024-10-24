import type { Block, Field } from 'payload'

const name: Field = {
  name: 'name',
  type: 'text',
  label: 'Name (lowercase, no special characters)',
  required: true,
}

const question: Field = {
  name: 'question',
  type: 'text',
  label: 'Question',
  localized: true,
}

const required: Field = {
  name: 'required',
  type: 'checkbox',
  label: 'Required',
}

const active: Field = {
  name: 'active',
  type: 'checkbox',
  label: 'Active',
}

export const Name: Block = {
  slug: 'name',
  fields: [
    {
      name: 'nameType',
      type: 'select',
      label: 'Name',
      localized: true,
      admin: {
        style: { maxWidth: '285px' },
        description: 'Select Name question input type.',
      },
      options: [
        {
          label: 'Name',
          value: 'full',
        },
        {
          label: 'First Name, Last Name',
          value: 'split',
        },
      ],
    },
  ],
  labels: {
    plural: 'Name Fields',
    singular: 'Name',
  },
  admin: {
    components: {
      Label: '@/components/CustomMeetingFormBlockLabel',
    },
  },
}

export const OneLine: Block = {
  slug: 'one-line',
  fields: [
    {
      ...question,
      admin: {
        style: { maxWidth: '580px' },
      },
    },
    {
      type: 'row',
      fields: [
        {
          ...active,
          admin: {
            width: '50%',
          },
        },
        required,
      ],
    },
  ],
  labels: {
    plural: 'One Line Answers',
    singular: 'One Line Answer',
  },
  admin: {
    components: {
      Label: '@/components/CustomMeetingFormBlockLabel',
    },
  },
}

export const MultipleLines: Block = {
  slug: 'multiline',
  fields: [
    {
      ...question,
      admin: {
        style: { maxWidth: '285px' },
      },
    },
    {
      type: 'row',
      fields: [
        {
          ...active,
          admin: {
            width: '50%',
          },
        },
        required,
      ],
    },
  ],
  labels: {
    plural: 'Multiple Line Answers',
    singular: 'Multiple Line Answer',
  },
  admin: {
    components: {
      Label: '@/components/CustomMeetingFormBlockLabel',
    },
  },
}

export const RadioButtons: Block = {
  slug: 'radio',
  fields: [
    {
      ...question,
      admin: {
        style: { maxWidth: '285px' },
      },
    },
    {
      type: 'row',
      fields: [
        {
          ...active,
          admin: {
            width: '50%',
          },
        },
        required,
      ],
    },
    {
      name: 'options',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'option',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          localized: true,
          required: true,
        },
      ],
      label: 'Select Attribute Options',
      labels: {
        plural: 'Options',
        singular: 'Option',
      },
    },
  ],
  labels: {
    plural: 'Radio Buttons',
    singular: 'Radio Buttons',
  },
  admin: {
    components: {
      Label: '@/components/CustomMeetingFormBlockLabel',
    },
  },
}

export const Checkboxes: Block = {
  slug: 'checkboxes',
  fields: [
    {
      ...question,
      admin: {
        style: { maxWidth: '285px' },
      },
    },
    {
      type: 'row',
      fields: [
        {
          ...active,
          admin: {
            width: '50%',
          },
        },
        {
          ...required,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'options',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'option',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          localized: true,
          required: true,
        },
      ],
      label: 'Select Attribute Options',
      labels: {
        plural: 'Options',
        singular: 'Option',
      },
    },
  ],
  labels: {
    plural: 'Checkboxes',
    singular: 'Checkboxes',
  },
  admin: {
    components: {
      Label: '@/components/CustomMeetingFormBlockLabel',
    },
  },
}

export const Dropdown: Block = {
  slug: 'dropdown',
  fields: [
    {
      ...question,
      admin: {
        style: { maxWidth: '285px' },
      },
    },
    {
      type: 'row',
      fields: [
        {
          ...active,
          admin: {
            width: '50%',
          },
        },
        required,
      ],
    },
    {
      name: 'options',
      type: 'array',
      fields: [
        {
          name: 'option',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          localized: true,
          required: true,
        },
      ],
      label: 'Select Attribute Options',
      labels: {
        plural: 'Options',
        singular: 'Option',
      },
    },
  ],
  labels: {
    plural: 'Dropdowns',
    singular: 'Dropdown',
  },
  admin: {
    components: {
      Label: '@/components/CustomMeetingFormBlockLabel',
    },
  },
}

export const PhoneNumber: Block = {
  slug: 'phoneNumber',
  fields: [
    {
      ...question,
      admin: {
        style: { maxWidth: '285px' },
      },
    },
    {
      type: 'row',
      fields: [
        {
          ...active,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    required,
  ],
  labels: {
    plural: 'Phone Numbers',
    singular: 'Phone Number',
  },
  admin: {
    components: {
      Label: '@/components/CustomMeetingFormBlockLabel',
    },
  },
}

export const Number: Block = {
  slug: 'number',
  fields: [
    {
      ...question,
      admin: {
        style: { maxWidth: '285px' },
      },
    },
    {
      type: 'row',
      fields: [
        {
          ...active,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    required,
  ],
  labels: {
    plural: 'Number Fields',
    singular: 'Number',
  },
  admin: {
    components: {
      Label: '@/components/CustomMeetingFormBlockLabel',
    },
  },
}

export const Email: Block = {
  slug: 'email',
  fields: [
    // {
    //   ...question,
    //   admin: {
    //     style: { maxWidth: '285px' },
    //   },
    // },
    // active,
    // required,
  ],
  labels: {
    plural: 'Email Fields',
    singular: 'Email',
  },
  admin: {
    components: {
      Label: '@/components/CustomMeetingFormBlockLabel',
    },
  },
}

export const State: Block = {
  slug: 'state',
  fields: [
    {
      ...question,
      admin: {
        style: { maxWidth: '285px' },
      },
    },
    active,
    required,
  ],
  labels: {
    plural: 'State Fields',
    singular: 'State',
  },
}

export const Country: Block = {
  slug: 'country',
  fields: [
    {
      ...question,
      admin: {
        style: { maxWidth: '285px' },
      },
    },
    active,
    required,
  ],
  labels: {
    plural: 'Country Fields',
    singular: 'Country',
  },
}

export const Payment = (fieldConfig: any): Block => {
  let paymentProcessorField = null
  if (fieldConfig?.paymentProcessor) {
    paymentProcessorField = {
      name: 'paymentProcessor',
      type: 'select',
      label: 'Payment Processor',
      options: [],
      ...fieldConfig.paymentProcessor,
    }
  }

  const fields = {
    slug: 'payment',
    fields: [
      {
        type: 'row',
        fields: [
          {
            ...name,
            admin: {
              width: '50%',
            },
          },
          {
            ...question,
            admin: {
              width: '50%',
            },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            ...active,
            admin: {
              width: '50%',
            },
          },
          {
            name: 'basePrice',
            type: 'number',
            admin: {
              width: '50%',
            },
            label: 'Base Price',
          },
        ],
      },
      paymentProcessorField,
      {
        name: 'priceConditions',
        type: 'array',
        fields: [
          {
            name: 'fieldToUse',
            type: 'text',
            admin: {
              components: {
                Field: '@payloadcms/plugin-form-builder/client#DynamicFieldSelector',
              },
            },
          },
          {
            name: 'condition',
            type: 'select',
            defaultValue: 'hasValue',
            label: 'Condition',
            options: [
              {
                label: 'Has Any Value',
                value: 'hasValue',
              },
              {
                label: 'Equals',
                value: 'equals',
              },
              {
                label: 'Does Not Equal',
                value: 'notEquals',
              },
            ],
          },
          {
            name: 'valueForCondition',
            type: 'text',
            admin: {
              condition: (_: any, { condition }: any) =>
                condition === 'equals' || condition === 'notEquals',
            },
            label: 'Value',
          },
          {
            name: 'operator',
            type: 'select',
            defaultValue: 'add',
            options: [
              {
                label: 'Add',
                value: 'add',
              },
              {
                label: 'Subtract',
                value: 'subtract',
              },
              {
                label: 'Multiply',
                value: 'multiply',
              },
              {
                label: 'Divide',
                value: 'divide',
              },
            ],
          },
          {
            name: 'valueType',
            type: 'radio',
            admin: {
              width: '100%',
            },
            defaultValue: 'static',
            label: 'Value Type',
            options: [
              {
                label: 'Static Value',
                value: 'static',
              },
              {
                label: 'Value Of Field',
                value: 'valueOfField',
              },
            ],
          },
          {
            name: 'valueForOperator',
            type: 'text',
            admin: {
              components: {
                Field: '@payloadcms/plugin-form-builder/client#DynamicPriceSelector',
              },
            },
            label: 'Value',
          },
        ],
        label: 'Price Conditions',
        labels: {
          plural: 'Price Conditions',
          singular: 'Price Condition',
        },
      },
      required,
    ].filter(Boolean) as Field[],
    labels: {
      plural: 'Payment Fields',
      singular: 'Payment',
    },
  }

  return fields
}

export const Message: Block = {
  slug: 'message',
  fields: [
    {
      name: 'message',
      type: 'richText',
      localized: true,
    },
  ],
  labels: {
    plural: 'Message Blocks',
    singular: 'Message',
  },
}

// export const fields = {
//   checkbox: Checkbox,
//   country: Country,
//   email: Email,
//   message: Message,
//   number: Number,
//   payment: Payment,
//   dropdown: Dropdown,
//   state: State,
//   text: Text,
//   textarea: TextArea,
// } as {
//   [key: string]: ((fieldConfig?: boolean | FieldConfig) => Block) | Block
// }
