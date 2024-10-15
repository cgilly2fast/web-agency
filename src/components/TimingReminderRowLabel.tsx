'use client'
import React from 'react'

import { useField, useRowLabel } from '@payloadcms/ui'

const baseClass = 'row-label'

const TimingFollowUpRowLabel: React.FC<{ label: string }> = (props) => {
  const { path } = useRowLabel()
  const { value: time } = useField<number | undefined>({
    path: path + '.time',
  })
  const { value: unit } = useField<string | undefined>({
    path: path + '.unit',
  })

  const getLabel = (time?: number, unit?: string) => {
    if (!time) {
      return 'Reminder not set'
    }

    return time + ' ' + unit + ' before event'
  }

  let label = getLabel(time, unit)

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
export default TimingFollowUpRowLabel
