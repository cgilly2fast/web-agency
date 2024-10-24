'use client'
import { toTitleCase } from '@/utils/toTitleCase'
import { Pill, SectionTitle, useField, useFormFields } from '@payloadcms/ui'
import { Row } from 'payload'
import { useMemo } from 'react'

const baseClass = 'blocks-field'

interface CustomMeetingFormBlockLabelProps {
  blockKind: string
  formData: Row
}

const CustomMeetingFormBlockLabel: React.FC<CustomMeetingFormBlockLabelProps> = ({
  blockKind,
  formData,
}) => {
  const field = useField({})

  const rowIndex = useMemo(() => {
    return field.rows?.findIndex((row) => row.id === formData.id) ?? 0
  }, [field.rows, formData.id])

  const block = useField({ path: field.path + '.' + rowIndex })

  const blockType: any = useFormFields(
    ([fields, dispatch]) => fields['bookingForm.fields.' + rowIndex + '.blockType'],
  )

  return (
    <div className={`${baseClass}__block-header`}>
      <span className={`${baseClass}__block-number`}>{'Q' + String(rowIndex + 1) + ':'}</span>
      <Pill
        className={`${baseClass}__block-pill ${baseClass}__block-pill-${formData.blockType}`}
        pillStyle="white"
      >
        {toTitleCase((blockType.value as String).replaceAll('-', ' '))}
      </Pill>
      {blockType.value !== 'email' && blockType.value !== 'name' && (
        <SectionTitle path={`${block.path}.question`} readOnly={true} />
      )}
      {/* {fieldHasErrors && <ErrorPill count={errorCount} i18n={i18n} withMessage />} */}
    </div>
  )
}

export default CustomMeetingFormBlockLabel
