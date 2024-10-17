import { CollectionAfterOperationHook } from 'payload'

export const accountDelete: CollectionAfterOperationHook<'users'> = async ({
  operation,
  req,
  result,
}) => {
  if (operation === 'delete') {
    const { payload } = req
    for (let i = 0; i < result.docs.length; i++) {
      const doc = result.docs[i]
      await payload.delete({
        collection: 'availability-settings',
        where: {
          user: {
            equals: doc.id,
          },
          firm: {
            equals: doc.firm,
          },
        },
      })
    }
  }
  return result
}
