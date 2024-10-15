'use client'
import React from 'react'

import { useField, useRowLabel } from '@payloadcms/ui'

const baseClass = 'row-label'

const TimezoneDisplayRowLabel: React.FC<{ label: string }> = (props) => {
  const { path } = useRowLabel()
  const { value: timezoneDisplay } = useField<string | undefined>({
    path: path + '.timezoneDisplay',
  })

  const getLabel = (tzDisplay?: string) => {
    if (!tzDisplay || tzDisplay === 'invitees') {
      return 'Timezone Display: Invitees'
    }

    return 'Timezone Display: Locked'
  }

  let label = getLabel(timezoneDisplay)

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
export default TimezoneDisplayRowLabel
