import { Domain } from '@/payload-types'
import { LoadingOverlay } from '@payloadcms/ui'
import { PaginatedDocs } from 'payload'
import dynamic from 'next/dynamic'

const LogoClient = dynamic(() => import('./Logo.client'), {
  loading: () => <LoadingOverlay />,
})

async function getData() {
  const res = await fetch(
    'http://localhost:3000/api/domains?depth=1&draft=false&locale=undefined&limit=333',
    {
      headers: {
        Authorization: `users API-Key 476165bd-d304-4e5c-b1cb-cde748c5ff7b`,
      },
    },
  )
  const data = (await res.json()) as PaginatedDocs<Domain>
  const logoMap: Record<string, string> = {}
  const darkModeLogoMap: Record<string, string> = {}

  for (let i = 0; i < data.docs.length; i++) {
    const doc = data.docs[i]!
    if (doc.logo && typeof doc.logo !== 'string') {
      logoMap[doc.name] = doc.logo.url!
      darkModeLogoMap[doc.name] = doc.logo.url!
    }

    if (doc.logoDarkMode && typeof doc.logoDarkMode !== 'string') {
      darkModeLogoMap[doc.name] = doc.logoDarkMode.url!
    }
  }

  return { logoMap, darkModeLogoMap }
}

export default async function Logo() {
  const { logoMap, darkModeLogoMap } = await getData()
  return <LogoClient logoMap={logoMap} darkModeLogoMap={darkModeLogoMap} />
}
