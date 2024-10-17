'use client'

import React from 'react'
import { useField, useFieldProps, useTranslation } from '@payloadcms/ui'

const baseClass = 'field-description'

const BookingPageUrlPreview = () => {
  const { path } = useFieldProps()

  const { value } = useField({ path })

  return (
    <div
      className={[baseClass, `field-description-${path.replace(/\./g, '__')}`]
        .filter(Boolean)
        .join(' ')}
    >
      {window.location.hostname + '/appointments/' + (value ?? '')}
    </div>
  )

  return null
}

export default BookingPageUrlPreview
