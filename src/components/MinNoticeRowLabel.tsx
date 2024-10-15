'use client'
import React from 'react'

import { useField, useRowLabel } from '@payloadcms/ui'

const baseClass = 'row-label'

const MinNoticeRowLabel: React.FC<{ label: string }> = (props) => {
  const { path } = useRowLabel()
  const { value: minNoticeTime } = useField<string | undefined>({
    path: path + '.minNoticeTime',
  })
  const { value: minNoticeUnit } = useField<string | undefined>({
    path: path + '.minNoticeUnit',
  })

  const getLabel = (minTime?: string, minUnit?: string) => {
    if (!minTime) {
      return 'Minimum Notice: Not set'
    }

    return 'Minimum Notice: ' + minTime + ' ' + minUnit
  }

  let label = getLabel(minNoticeTime, minNoticeUnit)

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
export default MinNoticeRowLabel
