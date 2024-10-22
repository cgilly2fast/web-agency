import { notFound } from 'next/navigation'
import React, { Fragment } from 'react'
import type { Firm, Page as PageType } from '../../../payload-types'
import config from '../../../payload.config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Gutter } from '../_components/Gutter'
import { RefreshRouteOnSave } from './RefreshRouteOnSave'
import classes from './index.module.scss'

type PageParams = {
  params: Promise<{
    domain: string
    slug?: string[]
  }>
}

export default async function Page({ params }: PageParams) {
  const { domain, slug = [] } = await params
  const slugPath = slug.length > 0 ? slug.join('/') : 'home'

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
              equals: slugPath,
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

    const page = pageRes?.docs?.[0] as PageType | null

    if (!page) {
      return notFound()
    }

    return (
      <Fragment>
        <RefreshRouteOnSave />
        <main className={classes.page}>
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
      depth: 1,
      draft: true,
      limit: 1000,
    })
    const pages = pagesRes?.docs || []

    return pages.map(({ slug, firm }) => ({
      domain: (firm as Firm).domain,
      slug: slug === 'home' ? undefined : slug!.split('/'),
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
