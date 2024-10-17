// @ts-ignore
import Telnyx from 'telnyx'

export async function sendText(to?: string | null, body?: string | null, from?: string | null) {
  //@ts-ignore
  const telnyx = Telnyx(process.env.TELYNX_APIKEY)
  try {
    if (!to || !body) {
      throw new Error('Invalid data passed: to:' + to + ', body: ' + body)
    }
    const response = telnyx.messages.create({
      to,
      from: from ?? '+18084049889',
      text: body,
    })
    return response.data
  } catch (error) {
    console.log('sendText error', error)
    return error
  }
}
