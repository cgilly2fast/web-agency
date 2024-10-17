import { OutreachType } from '@/lib/types'
import { PayloadHandler } from 'payload'
import moment from 'moment-timezone'

export const MsgDispatcher: PayloadHandler = async (req) => {
  const { payload } = req
  const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')

  const snapshot = await payload.find({
    collection: 'interactions',
    where: {
      scheduledTime: {
        less_than_equal: now,
      },
      status: {
        equals: 'scheduled',
      },
    },
    depth: 0,
  })

  //   const user = await payload

  // need to switch to parallel execution as service grows.
  for (let i = 0; i < snapshot.docs.length; i++) {
    const interaction = snapshot.docs[i]
    console.log('call', interaction)

    try {
      switch (interaction.type) {
        case OutreachType.TXT:
          await sendText(interaction.toPhone, interaction.fromPhone, interaction.body)
          break
        case OutreachType.CALL:
          //   await makeCallHelper(interaction)
          break
        case OutreachType.EMAIL:
          await sendEmail(
            interaction.toEmail,
            interaction.fromEmail,
            interaction.subject,
            interaction.body,
          )
          break
      }
      payload.update({
        collection: 'interactions',
        id: interaction.id,
        data: {
          status: 'delivered',
        },
      })
    } catch (error) {
      console.log('Delivery Error', interaction, error)
      payload.update({
        collection: 'interactions',
        id: interaction.id,
        data: {
          status: 'failed',
          error: JSON.stringify(error),
        },
      })
    }
  }
  return Response.json(200)
}
