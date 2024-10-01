import type { Page } from '@web-agency/types'

export const fetchPage = async (slug: string): Promise<Page | undefined | null> => {
  console.log(slug, `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/pages?where[slug][equals]=${slug}&depth=2`)
  const pageRes: {
    docs: Page[]
  } = await fetch(
    `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/pages?where[slug][equals]=${slug}&depth=2`,
    {
      method: 'GET',
    },
  ).then((res) => res.json())
console.log(pageRes)
  return pageRes?.docs?.[0] ?? null
}
