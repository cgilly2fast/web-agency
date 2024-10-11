import { Domain } from '@/payload-types'
import { LoadingOverlay } from '@payloadcms/ui'
import { PaginatedDocs } from 'payload'
import dynamic from 'next/dynamic'

const IconClient = dynamic(() => import('./Icon.client'), {
  loading: () => <LoadingOverlay />,
})

async function getData() {
  const res = await fetch(
    process.env.PAYLOAD_PUBLIC_SERVER_URL +
      '/api/domains?depth=1&draft=false&locale=undefined&limit=333',
    {
      headers: {
        Authorization: `users API-Key 476165bd-d304-4e5c-b1cb-cde748c5ff7b`,
      },
    },
  )
  const data = (await res.json()) as PaginatedDocs<Domain>
  const iconMap: Record<string, string> = {}
  const darkModeIconMap: Record<string, string> = {}

  for (let i = 0; i < data.docs.length; i++) {
    const doc = data.docs[i]!
    if (doc.icon && typeof doc.icon !== 'string') {
      iconMap[doc.name] = doc.icon.url!
      darkModeIconMap[doc.name] = doc.icon.url!
    }

    if (doc.iconDarkMode && typeof doc.iconDarkMode !== 'string') {
      darkModeIconMap[doc.name] = doc.iconDarkMode.url!
    }
  }

  return { iconMap, darkModeIconMap }
}

export default async function Icon() {
  const { iconMap, darkModeIconMap } = await getData()
  return <IconClient iconMap={iconMap} darkModeIconMap={darkModeIconMap} />
}
