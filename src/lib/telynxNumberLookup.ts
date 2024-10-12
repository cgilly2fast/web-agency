import { convertToE164 } from '@/utils/convertToE164'
// @ts-ignore
import Telnyx from 'telnyx'

export async function telynxNumberLookup(phone: string) {
  // @ts-ignore
  const telnyx = Telnyx('')
  console.log('phone', phone)
  console.log('converted phone', convertToE164(phone))
  const response = await telnyx.number_lookup.retrieve(convertToE164(phone))
  console.log('response', response)
  return {
    regionCode: response.data.country_code,
    valid: response.data.valid_number,
    phoneNumber: response.data.phone_number,
  }
}
