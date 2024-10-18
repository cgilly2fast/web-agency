import { Interaction } from '@/payload-types'
import { createGmailClient } from '../auth/createGmailClient'
import { AuthType } from '../types'
import { BasePayload } from 'payload'
import { gmail_v1 } from 'googleapis'

export const makeEmailClient = async (
  interaction: Interaction,
  payload: BasePayload,
): Promise<gmail_v1.Gmail | undefined> => {
  const { user } = interaction

  if (!user || interaction.emailReplyType === 'noreply') {
    return createGmailClient(AuthType.JWT)
  }

  const id = typeof user === 'string' ? user : user.id
  const snapshot = await payload.find({
    collection: 'user-tokens',
    where: {
      user: {
        equals: id,
      },
    },
  })

  const tokenData = snapshot.docs[0]

  if (interaction.emailProvider === 'google') {
    if (!tokenData.google) throw new Error('No google tokens')

    return createGmailClient(AuthType.OAUTH, tokenData.google)
  }

  if (!tokenData.microsoft) throw new Error('No microsoft tokens')

  return undefined
}
