'use client'
import React from 'react'

import { useField, useRowLabel } from '@payloadcms/ui'

const baseClass = 'row-label'

const BufferTimeRowLabel: React.FC<{ label: string }> = (props) => {
  const { path } = useRowLabel()
  const { value: bufferTimeBefore } = useField<string | undefined>({
    path: path + '.bufferTimeBefore',
  })
  const { value: bufferTimeAfter } = useField<string | undefined>({
    path: path + '.bufferTimeAfter',
  })

  const getLabel = (before?: string, after?: string) => {
    if (!before && !after) {
      return 'Buffer Time: Not set'
    }

    let str = 'Buffer Time: '
    if (before) {
      str += before + ' before'
    }

    if (after) {
      str += ', ' + after + ' after'
    }

    return str
  }

  let label = getLabel(bufferTimeBefore, bufferTimeAfter)

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
export default BufferTimeRowLabel
