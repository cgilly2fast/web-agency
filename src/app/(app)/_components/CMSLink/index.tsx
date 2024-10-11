import Link from 'next/link'
import React from 'react'

import type { Page } from '@/payload-types'

import { Button } from '../Button'

export type CMSLinkType = {
  appearance?: 'default' | 'primary' | 'secondary' | null
  children?: React.ReactNode | null
  className?: string
  label?: string
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages'
    value: Page | string
  } | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = ({
  type,
  appearance,
  children,
  className,
  label,
  newTab,
  reference,
  url,
}) => {
  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `/${reference.value.slug === 'home' ? '' : reference.value.slug}`
      : url

  if (!appearance) {
    const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

    if (type === 'custom') {
      return (
        <a href={url || ''} {...newTabProps} className={className}>
          {label && label}
          {children && children}
        </a>
      )
    }

    if (href) {
      return (
        <Link href={href} {...newTabProps} className={className} prefetch={false}>
          {label && label}
          {children && children}
        </Link>
      )
    }
  }

  const buttonProps = {
    appearance,
    href,
    label,
    newTab,
  }

  return <Button className={className} {...buttonProps} el="link" />
}
