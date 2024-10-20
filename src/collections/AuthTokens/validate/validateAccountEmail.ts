import { Validate } from 'payload'

export const validateAccountEmail: Validate = async (value, { data, req }) => {
  const snapshot = await req.payload.find({
    collection: 'auth-tokens',
    where: {
      accountEmail: {
        equals: value,
      },
      integration: {
        equals: typeof data.integration === 'string' ? data.integration : data.integration.id,
      },
    },
  })

  if (snapshot.docs.length === 0) {
    return true
  }

  const search = snapshot.docs.some((doc: any) => doc.id !== data.id)

  if (search) {
    return 'Only one account email per integration type is allowed.'
  }
  return true
}
