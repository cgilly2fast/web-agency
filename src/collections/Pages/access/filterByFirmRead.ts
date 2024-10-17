import { getFirmAccessIDs } from '@/utils/collections/getFirmAccessID'
import { isSuperAdmin } from '@/utils/collections/isSuperAdmin'
import type { Access } from 'payload'

import { parseCookies } from 'payload'

export const filterByFirmRead: Access = (args) => {
  const req = args.req
  const superAdmin = isSuperAdmin(args.req.user)
  const selectedFirm = args.data?.firm === 'string' ? args.data?.firm : args.data?.firm?.id

  const firmAccessIDs = getFirmAccessIDs(req.user)

  if (selectedFirm) {
    if (superAdmin) {
      return {
        firm: {
          equals: selectedFirm,
        },
      }
    }

    const hasFirmAccess = firmAccessIDs.some((id) => id === selectedFirm)

    // If NOT super admin,
    // give them access only if they have access to firm ID set in cookie
    if (hasFirmAccess) {
      return {
        firm: {
          equals: selectedFirm,
        },
      }
    }
  }

  // If no manually selected firm,
  // but it is a super admin, give access to all
  if (superAdmin) {
    return true
  }

  // If not super admin,
  // but has access to firms,
  // give access to only their own firms
  if (firmAccessIDs.length) {
    return {
      firm: {
        in: firmAccessIDs,
      },
    }
  }

  // Deny access to all others
  return false
}
