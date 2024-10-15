'use client'
import React from 'react'

import { useField, useRowLabel } from '@payloadcms/ui'

const baseClass = 'row-label'

const DailyLimitRowLabel: React.FC<{ label: string }> = (props) => {
  const { path } = useRowLabel()
  const { value: dailyLimit } = useField<number | undefined>({
    path: path + '.dailyLimit',
  })

  const getLabel = (limit?: number) => {
    if (!limit) {
      return 'Daily Limit: Not set'
    }

    let str = 'Daily Limit: ' + limit + ' event'

    if (limit > 1) {
      return str + 's'
    }
    return str
  }

  let label = getLabel(dailyLimit)

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
export default DailyLimitRowLabel
