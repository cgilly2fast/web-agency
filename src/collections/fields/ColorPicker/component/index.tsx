import type { Payload, TextField } from 'payload'
import React from 'react'

import ColorPickerComponentClient from './ColorPicker.client'
import { Config } from '..'

function isConfig(obj: unknown): obj is Config {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }

  const possibleConfig = obj as Record<string, unknown>

  if (
    !('type' in possibleConfig) ||
    typeof possibleConfig.type !== 'string' ||
    !['hex', 'hexA', 'rgb', 'rgbA', 'hsl', 'hslA'].includes(possibleConfig.type)
  ) {
    return false
  }

  if ('expanded' in possibleConfig && typeof possibleConfig.expanded !== 'boolean') {
    return false
  }

  if ('showPreview' in possibleConfig && typeof possibleConfig.showPreview !== 'boolean') {
    return false
  }

  return true
}

const TenantFieldComponent: React.FC<{
  path: string
  payload: Payload
  readOnly: boolean
  field: TextField
}> = async (args) => {
  if (!isConfig(args.field.custom)) return null
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
