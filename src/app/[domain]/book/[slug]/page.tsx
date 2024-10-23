import { notFound } from 'next/navigation'
import React, { Fragment } from 'react'
import type { Firm, Page as PageType } from '../../../../payload-types'
import config from '../../../../payload.config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Gutter } from '../../_components/Gutter'
import BookingPage from './components/BookingPage'

type PageParams = {
  params: Promise<{
    domain: string
    slug: string
  }>
}

export default async function Page({ params }: PageParams) {
  const { domain, slug } = await params

  try {
    const payload = await getPayloadHMR({ config })
    const snapshot = await payload.find({
      collection: 'meeting-templates',
      draft: true,
      limit: 1,
      where: {
        and: [
          {
            link: {
              equals: slug,
            },
          },
          {
            'firm.domain': {
              equals: domain,
            },
          },
        ],
      },
    })

    const template = snapshot?.docs?.[0] as PageType | null

    if (!template) {
      return notFound()
    }

    return <BookingPage />
  } catch (error) {
    console.error('Error fetching template:', error)
    return notFound()
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadHMR({ config })
    const templatesRes = await payload.find({
      collection: 'meeting-templates',
      depth: 1,
      draft: true,
      limit: 1000,
    })
    const templates = templatesRes?.docs || []

    return templates.map(({ link, firm }) => ({
      domain: (firm as Firm).domain,
      slug: link,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
