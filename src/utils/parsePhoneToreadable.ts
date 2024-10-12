import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'

export function parsePhoneToReadable(phone: string) {
  const phoneUtil = PhoneNumberUtil.getInstance()

  try {
    const number = phoneUtil.parse(phone)

    const formattedNumber = phoneUtil.format(number, PhoneNumberFormat.NATIONAL)

    const countryCode = number.getCountryCode()

    if (countryCode === 1) {
      return formattedNumber
    }

    return '+' + countryCode + ' ' + formattedNumber
  } catch (error) {
    return phone
  }
}
