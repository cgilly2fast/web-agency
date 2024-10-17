'use client'
import {
  ErrorPill,
  Pill,
  SectionTitle,
  useField,
  useFormFields,
  useTranslation,
} from '@payloadcms/ui'
import { Row } from 'payload'
import { useMemo } from 'react'

const baseClass = 'blocks-field'

interface BlocksRowLabelProps {
  blockKind: string
  formData: Row
}

const CustomBlocksRowLabel: React.FC<BlocksRowLabelProps> = ({ blockKind, formData }) => {
  const { i18n } = useTranslation()
  const field = useField({})

  const rowIndex = useMemo(() => {
    return field.rows?.findIndex((row) => row.id === formData.id) ?? 0
  }, [field.rows, formData.id])

  const block = useField({ path: field.path + '.' + rowIndex })

  const test = useFormFields(([fields, dispatch]) => fields)
  console.log('TEST', test)

  return (
    <div className={`${baseClass}__block-header`}>
      <span className={`${baseClass}__block-number`}>{String(rowIndex + 1).padStart(2, '0')}</span>
      {/* <Pill
        className={`${baseClass}__block-pill ${baseClass}__block-pill-${formData.blockType}`}
        pillStyle="white"
      >
        {"Can't find block labels"}
        {getTranslation(block.labels.singular, i18n)}
      </Pill> */}
      <SectionTitle path={`${block.path}.label`} readOnly={true} />
      {/* {fieldHasErrors && <ErrorPill count={errorCount} i18n={i18n} withMessage />} */}
    </div>
  )
}

export default CustomBlocksRowLabel
