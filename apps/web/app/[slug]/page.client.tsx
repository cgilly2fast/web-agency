'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'

import { Page } from '@web-agency/types'
import { Gutter } from '../_components/Gutter'

import classes from './index.module.scss'

export const PageTemplate: React.FC<{ page: Page | null | undefined }> = ({ page }) => {
  const { data } = useLivePreview({
    serverURL: process.env.NEXT_PUBLIC_PAYLOAD_URL || '',
    depth: 2,
    initialData: page,
  })

  return (
    <main className={classes.page}>
      <Gutter>
        <p>{data?.richText}</p>
      </Gutter>
    </main>
  )
}
