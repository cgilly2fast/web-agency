import type { PayloadRequest } from 'payload'

import { isSuperAdmin } from '../../../utils/collections/isSuperAdmin'

const logs = false

export const isSuperOrFirmAdmin = async (args: { req: PayloadRequest }): Promise<boolean> => {
  const {
    req,
    req: { user, payload },
  } = args

  // always allow super admins through
  if (isSuperAdmin(user)) {
    return true
  }

  if (!user) return false

  const userFirmID = typeof user.firm === 'string' ? user.firm : user.firm?.id

  if (logs) {
    const msg = `Finding firm with host: '${req.host}'`
    payload.logger.info({ msg })
  }

  // read `req.headers.host`, lookup the firm by `domain` to ensure it exists, and check if the user is an admin of that firm
  const foundFirms = await payload.find({
    collection: 'firms',
    where: {
      domain: {
        equals: req.host,
      },
    },
    depth: 0,
    limit: 1,
  })

  // if this firm does not exist, deny access
  if (foundFirms.totalDocs === 0 || !foundFirms.docs || foundFirms.docs.length === 0) {
    if (logs) {
      const msg = `No firm found for ${req.host}`
      payload.logger.info({ msg })
    }

    return false
  }

  if (logs) {
    const msg = `Found firm: '${foundFirms.docs?.[0]?.name}', checking if user is an firm admin`
    payload.logger.info({ msg })
  }

  // finally check if the user is an admin of this firm
  if (userFirmID !== foundFirms.docs[0]!.id) {
    return false
  }

  if (user.firmRole === 'admin' || user.firmRole === 'user') {
    if (logs) {
      const msg = `User is an admin of ${foundFirms.docs[0]!.name}, allowing access`
      payload.logger.info({ msg })
    }

    return true
  }

  if (logs) {
    const msg = `User is not an admin of ${foundFirms.docs[0]!.name}, denying access`
    payload.logger.info({ msg })
  }

  return false
}
