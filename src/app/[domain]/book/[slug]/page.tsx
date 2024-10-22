import { notFound } from 'next/navigation'
import React, { Fragment } from 'react'
import type { Firm, Page as PageType } from '../../../../payload-types'
import config from '../../../../payload.config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Gutter } from '../../_components/Gutter'

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

    const page = snapshot?.docs?.[0] as PageType | null

    if (!page) {
      return notFound()
    }

    return (
      <Fragment>
        <main className="mt-5">
          <Gutter>
            <p>{page.richText}</p>
          </Gutter>
        </main>
      </Fragment>
    )
  } catch (error) {
    console.error('Error fetching page:', error)
    return notFound()
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadHMR({ config })
    const pagesRes = await payload.find({
      collection: 'meeting-templates',
      depth: 1,
      draft: true,
      limit: 1000,
    })
    const pages = pagesRes?.docs || []

    return pages.map(({ link, firm }) => ({
      domain: (firm as Firm).domain,
      slug: link,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
