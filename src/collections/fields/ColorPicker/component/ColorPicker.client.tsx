'use client'
import React, { useState, useCallback, useMemo, useRef } from 'react'
import { extend } from 'colord'
import namesPlugin from 'colord/plugins/names'
import { useField, FieldDescription, FieldLabel, useTranslation } from '@payloadcms/ui'

import {
  HexColorPicker,
  HexAlphaColorPicker,
  HslaStringColorPicker,
  HslStringColorPicker,
  RgbaStringColorPicker,
  RgbStringColorPicker,
} from 'react-colorful'
import { Config } from '../index'
import { Description, LabelFunction, StaticLabel, TextField } from 'payload'

extend([namesPlugin])
const defaultColor = '#9A9A9A'

type Props = {
  custom?: Config
  defaultValue?: any
  label?: false | LabelFunction | StaticLabel
  description?: Description
  readOnly?: boolean
  required?: boolean
}

const ColorComponents: Record<Config['type'], any> = {
  hex: HexColorPicker,
  hexA: HexAlphaColorPicker,
  hsl: HslStringColorPicker,
  hslA: HslaStringColorPicker,
  rgb: RgbStringColorPicker,
  rgbA: RgbaStringColorPicker,
}

const ColorPickerComponent: React.FC<Props> = (props) => {
  const { custom, defaultValue, readOnly, required, description, label } = props

  const { value = '', setValue } = useField({})
  const isExpanded = Boolean(custom?.expanded ?? false)
  const [color, setColor] = useState(value ?? defaultValue ?? defaultColor)
  const [isAdding, setIsAdding] = useState(isExpanded)

  const field = useField({})
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  const Picker = useMemo(() => {
    return ColorComponents[custom?.type ?? 'hex']
  }, [custom?.type])

  const handleAddColorViaPicker = useCallback(
    (val?: string) => {
      if (val !== value && !readOnly) {
        setColor(val)
        if (inputRef.current) {
          inputRef.current.value = val ?? ''
        }
      }
    },
    [setColor, inputRef, readOnly, value],
  )

  const handleAddColor = useCallback(
    (val?: string) => {
      if (val !== value && !readOnly) {
        setColor(val)
      }
    },
    [setColor, readOnly, value],
  )

  if (!custom) return null

  return (
    <div className={`mr-1 max-w-fit mb-5`}>
      {/* {Array.isArray(beforeInput) && beforeInput.map((Component, i) => <Component key={i} />)} */}
      <FieldLabel
        label={label ? (typeof label === 'function' ? label({ t: t as any }) : label) : undefined}
        required={required}
      />
      {(isExpanded || isAdding) && (
        <div className="field-type text">
          <div
            className={['field-type__wrap', readOnly && 'readOnly'].filter(Boolean).join(' ')}
            // @ts-expect-error
            inert={readOnly ? '' : null}
          >
            <Picker
              onChange={handleAddColorViaPicker}
              color={value}
              onBlur={(e: FocusEvent) => {
                if (e.relatedTarget === null) {
                  setIsAdding(false)
                }
              }}
              onKeyDown={(e: KeyboardEvent) =>
                (e.key === 'Enter' || e.key === 'Escape') && setIsAdding(false)
              }
              onMouseUp={(e: MouseEvent) => setValue(color)}
            />
          </div>

          <input
            ref={inputRef}
            onChange={({ currentTarget }) => {
              handleAddColor(currentTarget.value)
            }}
            defaultValue={color}
            readOnly={readOnly}
            className={`field-type text mt-4`}
          />
        </div>
      )}
      {!isExpanded && (
        <div className="flex items-center">
          <button
            type="button"
            className={`cursor-pointer border-[1px] border-solid border-white h-8 w-8 mt-4`}
            style={{ backgroundColor: color }}
            aria-label={color}
            onClick={() => {
              setIsAdding(!isAdding)
            }}
          />
          {custom.showPreview && (
            <>
              <label className="srOnly">Preview</label>
              <input className="previewField" disabled value={color} />
            </>
          )}
        </div>
      )}
      <FieldDescription
        description={
          description
            ? typeof description === 'function'
              ? description({ t: t as any })
              : description
            : undefined
        }
        field={field as any}
      />
      {/* {Array.isArray(afterInput) && afterInput.map((Component, i) => <Component key={i} />)} */}
    </div>
  )
}
export default ColorPickerComponent
