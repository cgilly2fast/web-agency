import type { Block, Field } from 'payload'

import type { FieldConfig, PaymentFieldConfig } from '@payloadcms/plugin-form-builder/types'

const name: Field = {
  name: 'name',
  type: 'text',
  label: 'Name (lowercase, no special characters)',
  required: true,
}

const label: Field = {
  name: 'label',
  type: 'text',
  label: 'Label',
  localized: true,
}

const required: Field = {
  name: 'required',
  type: 'checkbox',
  label: 'Required',
}

const width: Field = {
  name: 'width',
  type: 'number',
  label: 'Field Width (percentage)',
}

export const Select: Block = {
  slug: 'select',
  admin: {
    components: {
      Label: '@/components/BlocksRowLabel',
    },
  },
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
          ...label,
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
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'defaultValue',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Default Value',
          localized: true,
        },
      ],
    },
    {
      name: 'options',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              admin: {
                width: '50%',
              },
              label: 'Label',
              localized: true,
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              admin: {
                width: '50%',
              },
              label: 'Value',
              required: true,
            },
          ],
        },
      ],
      label: 'Select Attribute Options',
      labels: {
        plural: 'Options',
        singular: 'Option',
      },
    },
    required,
  ],
  labels: {
    plural: 'Select Fields',
    singular: 'Select',
  },
}

export const Text: Block = {
  slug: 'text',
  admin: {
    components: {
      Label: '@/components/BlocksRowLabel',
    },
  },
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
          ...label,
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
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'defaultValue',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Default Value',
          localized: true,
        },
      ],
    },
    required,
  ],
  labels: {
    plural: 'Text Fields',
    singular: 'Text',
  },
}

export const TextArea: Block = {
  slug: 'textarea',
  admin: {
    components: {
      Label: '@/components/BlocksRowLabel',
    },
  },
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
          ...label,
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
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'defaultValue',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Default Value',
          localized: true,
        },
      ],
    },
    required,
  ],
  labels: {
    plural: 'Text Area Fields',
    singular: 'Text Area',
  },
}

export const Number: Block = {
  slug: 'number',
  admin: {
    components: {
      Label: '@/components/BlocksRowLabel',
    },
  },
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
          ...label,
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
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'defaultValue',
          type: 'number',
          admin: {
            width: '50%',
          },
          label: 'Default Value',
        },
      ],
    },
    required,
  ],
  labels: {
    plural: 'Number Fields',
    singular: 'Number',
  },
}

export const Email: Block = {
  slug: 'email',
  admin: {
    components: {
      Label: '@/components/BlocksRowLabel',
    },
  },
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
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    width,
    required,
  ],
  labels: {
    plural: 'Email Fields',
    singular: 'Email',
  },
}

export const State: Block = {
  slug: 'state',
  admin: {
    components: {
      Label: '@/components/BlocksRowLabel',
    },
  },
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
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    width,
    required,
  ],
  labels: {
    plural: 'State Fields',
    singular: 'State',
  },
}

export const Country: Block = {
  slug: 'country',
  admin: {
    components: {
      Label: '@/components/BlocksRowLabel',
    },
  },
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
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    width,
    required,
  ],
  labels: {
    plural: 'Country Fields',
    singular: 'Country',
  },
}

export const Checkbox: Block = {
  slug: 'checkbox',
  admin: {
    components: {
      Label: '@/components/BlocksRowLabel',
    },
  },
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
          ...label,
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
          ...width,
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
      name: 'defaultValue',
      type: 'checkbox',
      label: 'Default Value',
    },
  ],
  labels: {
    plural: 'Checkbox Fields',
    singular: 'Checkbox',
  },
}

export const Payment = (fieldConfig: PaymentFieldConfig): Block => {
  let paymentProcessorField = null
  if (fieldConfig?.paymentProcessor) {
    paymentProcessorField = {
      name: 'paymentProcessor',
      type: 'select',
      label: 'Payment Processor',
      options: [],
      admin: {
        components: {
          Label: '@/components/BlocksRowLabel',
        },
      },
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
            ...label,
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
            ...width,
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
  admin: {
    components: {
      Label: '@/components/BlocksRowLabel',
    },
  },
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

export const fields = {
  checkbox: Checkbox,
  country: Country,
  email: Email,
  message: Message,
  number: Number,
  payment: Payment,
  select: Select,
  state: State,
  text: Text,
  textarea: TextArea,
} as {
  [key: string]: ((fieldConfig?: boolean | FieldConfig) => Block) | Block
}
