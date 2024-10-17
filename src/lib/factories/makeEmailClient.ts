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

  const userData = await payload.findByID({
    collection: 'users',
    id: typeof user === 'string' ? user : user.id,
  })

  if (interaction.emailProvider === 'google') {
    if (!userData.google) throw new Error('No google tokens')

    return createGmailClient(AuthType.OAUTH, userData.google)
  }

  if (!userData.microsoft) throw new Error('No microsoft tokens')

  return undefined
}
