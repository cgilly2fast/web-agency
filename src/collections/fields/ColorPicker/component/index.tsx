import type { Payload, TextField } from 'payload'

import { cookies as getCookies, headers as getHeaders } from 'next/headers'
import React from 'react'

import ColorPickerComponentClient from './ColorPicker.client'
import { FieldType } from '@payloadcms/ui'
import { FieldServerComponent } from 'node_modules/payload/dist/admin/forms/Field'

const TenantFieldComponent: React.FC<{
  path: string
  payload: Payload
  readOnly: boolean
  field: TextField
}> = async (args) => {
  return (
    <ColorPickerComponentClient
      readOnly={args.field.admin?.readOnly}
      description={args.field.admin?.description}
      defaultValue={args.field.defaultValue}
      label={args.field.label}
      custom={args.field.custom}
      required={args.field.required}
    />
  )
}

export default TenantFieldComponent
