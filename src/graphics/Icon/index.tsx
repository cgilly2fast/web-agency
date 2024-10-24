import { Firm } from '@/payload-types'
import { LoadingOverlay } from '@payloadcms/ui'
import { PaginatedDocs } from 'payload'
import dynamic from 'next/dynamic'

const IconClient = dynamic(() => import('./Icon.client'), {
  loading: () => <LoadingOverlay />,
})

async function getData() {
  const res = await fetch(
    process.env.PAYLOAD_PUBLIC_SERVER_URL +
      '/api/firms?depth=1&draft=false&locale=undefined&limit=333',
    {
      headers: {
        Authorization: `users API-Key 476165bd-d304-4e5c-b1cb-cde748c5ff7b`,
      },
    },
  )
  const data = (await res.json()) as PaginatedDocs<Firm>
  const iconMap: Record<string, string> = {}
  const darkModeIconMap: Record<string, string> = {}

  for (let i = 0; i < data.docs.length; i++) {
    const doc = data.docs[i]!
    if (doc.icon && typeof doc.icon !== 'string') {
      iconMap[doc.domain] = doc.icon.url!
      darkModeIconMap[doc.domain] = doc.icon.url!
    }

    if (doc.iconDarkMode && typeof doc.iconDarkMode !== 'string') {
      darkModeIconMap[doc.domain] = doc.iconDarkMode.url!
    }
  }
  return { iconMap, darkModeIconMap }
}

export default async function Icon() {
  const { iconMap, darkModeIconMap } = await getData()
  // console.log(iconMap, darkModeIconMap)
  return <IconClient iconMap={iconMap} darkModeIconMap={darkModeIconMap} />
}
