import type { Page } from '@web-agency/types'

export const fetchPages = async (): Promise<Page[]> => {
  console.log(process.env.NEXT_PUBLIC_PAYLOAD_URL)
  const pageRes: {
    docs: Page[]
  } = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/pages?depth=0&limit=100`).then(
    (res) => {
      console.log('res', res)
      return res.json()}, 
  ) // eslint-disable-line function-paren-newline
  console.log("after", pageRes?.docs)
  return pageRes?.docs ?? []
}
