import NeverBounce from 'neverbounce'

export async function neverbounceEmailLookup(email: string) {
  const client = new NeverBounce({
    apiKey: process.env.NEVER_BOUNCE_APIKEY!,
  })
  try {
    const resp = (await client.single.check(email)) as any
    const respResult = resp.getResult()
    console.log('neverbounceResult', respResult)
    const result = respResult === 'valid' || respResult === 'catchall' || respResult === 'unknown'
    return { valid: result }
  } catch (err: any) {
    console.log(err.type)
    return { valid: false }
  }
}
