import { notFound } from 'next/navigation'
import React, { Fragment } from 'react'
import type { Firm, Page as PageType } from '../../payload-types'
import config from '../../payload.config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Gutter } from './_components/Gutter'

export default async function PageRoot({ params }: { params: Promise<{ domain: string }> }) {
  console.log('IN HERE ROUTE')
  const { domain } = await params

  try {
    const payload = await getPayloadHMR({ config })
    const pageRes = await payload.find({
      collection: 'pages',
      draft: true,
      limit: 1,
      where: {
        and: [
          {
            slug: {
              equals: 'home',
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
    console.log('pageRes Inside', pageRes)
    const page = pageRes?.docs?.[0] as PageType | null

    if (!page) {
      return notFound()
    }
    console.log(page)
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
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
      depth: 1,
      draft: true,
      limit: 1000,
    })
    console.log('pageRes', pagesRes)
    const pages = pagesRes?.docs || []
    console.log('pages', pages)
    const map = pages.map(({ slug, firm }) => ({
      domain: (firm as Firm).domain,
      slug: slug!.split('/'),
    }))
    console.log('map', map)
    return map
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
