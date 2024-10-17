import { getFirmAccessIDs } from '@/utils/collections/getFirmAccessID'
import type { FieldHook } from 'payload'

import { ValidationError } from 'payload'

const ensureUniqueSlug: FieldHook = async ({ data, originalDoc, req, value }) => {
  // if value is unchanged, skip validation
  if (originalDoc.slug === value) {
    return value
  }

  const incomingFirmID = typeof data?.firm === 'object' ? data.firm.id : data?.firm
  const currentFirmID =
    typeof originalDoc?.firm === 'object' ? originalDoc.firm.id : originalDoc?.firm
  const firmIDToMatch = incomingFirmID || currentFirmID

  const findDuplicatePages = await req.payload.find({
    collection: 'pages',
    where: {
      and: [
        {
          firm: {
            equals: firmIDToMatch,
          },
        },
        {
          slug: {
            equals: value,
          },
        },
      ],
    },
  })

  if (findDuplicatePages.docs.length > 0 && req.user) {
    const firmIDs = getFirmAccessIDs(req.user)
    // if the user is an admin or has access to more than 1 firm
    // provide a more specific error message
    if (req.user.roles?.includes('super-admin') || firmIDs.length > 1) {
      const attemptedFirmChange = await req.payload.findByID({
        id: firmIDToMatch,
        collection: 'firms',
      })

      throw new ValidationError({
        errors: [
          {
            field: 'slug',
            message: `The "${attemptedFirmChange.name}" firm already has a page with the slug "${value}". Slugs must be unique per firm.`,
          },
        ],
      })
    }

    throw new ValidationError({
      errors: [
        {
          field: 'slug',
          message: `A page with the slug ${value} already exists. Slug must be unique per firm.`,
        },
      ],
    })
  }

  return value
}

export default ensureUniqueSlug
