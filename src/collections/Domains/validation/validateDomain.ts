import { Validate } from 'payload'

export const validateDomain: Validate = (url) => {
  if (!url) return 'Required'
  if (url.includes('/')) return 'Domain cannot have a path. Remove any "/" and everything after.'

  //   url = value.replace(/\.$/, '')

  const parts = url.split('.')

  if (parts.length < 2) return 'Not a valid domain name. Try something like this: example.com.'

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]

    if (part.length === 0)
      return 'Cannot have an empty part. Try something like this: example.com. First and last character cannot be a period "."'

    if (part.length > 63) return 'Not a valid domain name.'

    if (part.startsWith('-') || part.endsWith('-')) return 'Parts cannot start or end with a  -'

    if (!/^[a-zA-Z0-9-]+$/.test(part)) return 'Not allowed characters used.'
  }

  const tld = parts[parts.length - 1]
  if (tld.length < 2 || tld.length > 6 || !/^[a-zA-Z]+$/.test(tld))
    return 'The last part (TLD) is not between 2 and 6 characters and only letters'

  if (parts[0] === 'www') return 'Cannot start with www, remove "www."'

  return true
}
