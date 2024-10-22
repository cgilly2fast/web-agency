import { CollectionBeforeChangeHook } from 'payload'
import ObjectId from 'bson-objectid'
import { User } from '@/payload-types'

export const accountSetup: CollectionBeforeChangeHook<User> = async ({ operation, req, data }) => {
  if (operation === 'create') {
    const { payload } = req

    const id = new ObjectId().toHexString()
    const calendarSettings = await payload.create({
      collection: 'calendar-settings',
      data: {
        firm: typeof data.firm === 'string' ? data.firm : data.firm!.id,
        user: id,
      },
    })
    data.calendarSettings = calendarSettings.id
  }
  return data
}
