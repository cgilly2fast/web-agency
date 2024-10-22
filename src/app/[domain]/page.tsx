import { notFound } from 'next/navigation'
import React, { Fragment } from 'react'
import type { Page as PageType } from '../../payload-types'
import config from '../../payload.config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { Gutter } from './_components/Gutter'
import { RefreshRouteOnSave } from './[...slug]/RefreshRouteOnSave'

export default async function Page({ params }: { params: Promise<{ domain: string }> }) {
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

    const page = pageRes?.docs?.[0] as PageType | null

    if (!page) {
      return notFound()
    }

    return (
      <Fragment>
        <RefreshRouteOnSave />
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
