import { OutreachType } from '@/lib/types'
import { PayloadHandler } from 'payload'
import moment from 'moment-timezone'
import { makeEmailClient } from '@/lib/factories/makeEmailClient'
import { sendEmail } from '@/lib/contact/sendEmail'
import { sendText } from '@/lib/contact/sendText'

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
          await sendText(interaction.toPhone, interaction.fromPhone, interaction.textBody)
          break
        case OutreachType.CALL:
          //   await makeCallHelper(interaction)
          break
        case OutreachType.EMAIL:
          let emailClient = await makeEmailClient(interaction, payload)
          const { toEmail, fromEmail, subject, emailBody } = interaction

          if (!toEmail || !fromEmail || !subject || !emailBody) {
            throw new Error('Incomplete interaction for email provider')
          }

          let emailResp = await sendEmail(emailClient!, toEmail, fromEmail, subject, emailBody)

          if (emailResp.success) break

          console.log(emailResp)

          if (emailResp.statusCode !== 401) throw new Error(JSON.stringify(emailResp))

          // revalidate token

          emailClient = await makeEmailClient(interaction, payload)
          emailResp = await sendEmail(emailClient!, toEmail, fromEmail, subject, emailBody)

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
