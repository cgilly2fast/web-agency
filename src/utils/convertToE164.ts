export function convertToE164(phoneNumber: string) {
  const cleanedNumber = phoneNumber.replace(/\D/g, '')

  if (phoneNumber[0] === '+') {
    return '+' + cleanedNumber
  }

  if (cleanedNumber.length === 10) {
    return `+1${cleanedNumber}`
  }

  return `+${cleanedNumber}`
}
