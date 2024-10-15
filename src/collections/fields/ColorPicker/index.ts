import { Field } from 'payload'
import { TextField } from 'payload'
import { PartialRequired } from '../../../utils/partialRequired'
import deepMerge from '../../utilities/deepMerge'

export type Config = {
  type: 'hex' | 'hexA' | 'rgb' | 'rgbA' | 'hsl' | 'hslA'
  expanded?: boolean
  showPreview?: boolean
}

type ColorPicker = (
  /**
   * Slug field overrides
   */
  overrides: PartialRequired<TextField, 'name'>,
  config?: Config,
) => Field

export const ColorPickerField: ColorPicker = (overrides, config = { type: 'hex' }) => {
  const configWithDefaults = deepMerge<Config, Partial<Config>>(
    {
      type: 'hex',
      expanded: false,
      showPreview: false,
    },
    config,
  )

  const field = deepMerge<TextField, Partial<TextField>>(
    {
      name: 'ColorPickerField',
      type: 'text',
      admin: {
        components: {
          Field: '@/collections/fields/ColorPicker/component/index',
        },
      },
      custom: configWithDefaults,
    },
    overrides,
  )

  return field
}
