'use client'
import React from 'react'

import { useField, useRowLabel } from '@payloadcms/ui'

const baseClass = 'row-label'

const IncrementsRowLabel: React.FC<{ label: string }> = (props) => {
  const { path } = useRowLabel()
  const { value: increments } = useField<string | undefined>({
    path: path + '.increments',
  })
  const { value: incrementTime } = useField<number | undefined>({
    path: path + '.incrementTime',
  })
  const { value: incrementUnit } = useField<string | undefined>({
    path: path + '.incrementUnit',
  })

  const getLabel = (amount?: string, time?: number, unit?: string) => {
    if (!amount) {
      return 'Start Time Increments: Not set'
    }

    if (amount === 'Custom') {
      if (!time) return 'Start Time Increments: Not set'

      return 'Start Time Increments: ' + time + ' ' + unit
    }

    return 'Start Time Increments: ' + amount
  }

  let label = getLabel(increments, incrementTime, incrementUnit)

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
export default IncrementsRowLabel
