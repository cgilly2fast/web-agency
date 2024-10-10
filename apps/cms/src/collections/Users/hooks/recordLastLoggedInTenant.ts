import { CollectionAfterLoginHook } from 'payload'

export const recordLastLoggedInTenant: CollectionAfterLoginHook = async ({ req, user }) => {
  try {
    const relatedOrg = await req.payload.find({
      collection: 'tenants',
      where: {
        'domains.domain': {
          in: [req.headers.get('host')],
        },
      },
      depth: 0,
      limit: 1,
    })
    console.log('relatedOrg', relatedOrg)
    if (relatedOrg.docs && relatedOrg.docs.length > 0 && relatedOrg.docs[0]) {
      await req.payload.update({
        id: user.id,
        collection: 'users',
        data: {
          lastLoggedInTenant: relatedOrg.docs[0].id,
        },
      })
    }
  } catch (err: unknown) {
    req.payload.logger.error(`Error recording last logged in tenant for user ${user.id}: ${err}`)
  }

  return user
}
