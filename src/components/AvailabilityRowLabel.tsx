'use client'
import React from 'react'

import { useField, useRowLabel } from '@payloadcms/ui'

const baseClass = 'row-label'

const AvailabilityRowLabel: React.FC<{ label: string }> = (props) => {
  const { path } = useRowLabel()
  const { value: startTime } = useField<string | undefined>({
    path: path + '.startTime',
  })
  const { value: endTime } = useField<string | undefined>({
    path: path + '.endTime',
  })

  const getLabel = (start?: string, end?: string) => {
    if (!start || !end) {
      return props.label
    }

    return props.label.split(' ')[0] + ': ' + start + ' - ' + end
  }

  let label = getLabel(startTime, endTime)

  return (
    <span
      className={[baseClass].filter(Boolean).join(' ')}
      style={{
        pointerEvents: 'none',
      }}
    >
      {label}
    </span>
  )
}
export default AvailabilityRowLabel
