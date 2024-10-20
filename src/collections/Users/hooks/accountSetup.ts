import { CollectionAfterOperationHook } from 'payload'

export const accountSetup: CollectionAfterOperationHook<'users'> = async ({
  operation,
  req,
  result,
}) => {
  if (operation === 'create') {
    const { payload } = req

    await payload.create({
      collection: 'availability-settings',
      data: {
        firm: result.firm,
        user: result.id,
      },
    })
  }
  return result
}
