import { AfterDeleteHook } from 'node_modules/payload/dist/collections/config/types'

export const removeOnDelete: AfterDeleteHook = async ({ id, req }) => {
  const snapshot = await req.payload.find({
    collection: 'calendar-settings',
    where: {
      or: [
        {
          calendars: {
            contains: id,
          },
        },
        {
          checkConflicts: {
            contains: id,
          },
        },
        {
          addToCalendars: {
            contains: id,
          },
        },
      ],
    },
    depth: 0,
    limit: 1,
  })
  if (snapshot.docs.length === 0) {
    return
  }

  const doc = snapshot.docs[0]
  req.payload.update({
    collection: 'calendar-settings',
    id: doc.id,
    data: {
      calendars: doc.calendars?.filter((v) => v !== id) || [],
      checkConflicts: doc.checkConflicts?.filter((v) => v !== id) || [],
      addToCalendars: doc.addToCalendars?.filter((v) => v !== id) || [],
    },
  })

  return
}
