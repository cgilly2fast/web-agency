import { Interaction } from '@/payload-types'
import { createGmailClient } from '../auth/createGmailClient'
import { AuthType } from '../types'
import { BasePayload } from 'payload'
import { gmail_v1 } from 'googleapis'
import { email } from 'node_modules/payload/dist/fields/validations'

export const makeEmailClient = async (
  interaction: Interaction,
  payload: BasePayload,
): Promise<gmail_v1.Gmail | undefined> => {
  const { user } = interaction

  if (!user || interaction.emailReplyType === 'noreply') {
    return createGmailClient(AuthType.JWT)
  }

  const id = typeof user === 'string' ? user : user.id
  const { fromEmail, emailProvider, emailIntegration } = interaction
  if (!fromEmail || !emailProvider || !emailIntegration)
    throw new Error('Invalid interaction object')

  const snapshot = await payload.find({
    collection: 'auth-tokens',
    where: {
      user: {
        equals: id,
      },
      accountEmail: {
        equals: fromEmail,
      },
      provider: {
        equals: emailProvider,
      },
      integration: {
        equals: emailIntegration,
      },
    },
    limit: 1,
  })
  if (!snapshot.docs || snapshot.docs.length === 0) {
    throw new Error('No token found')
  }

  const tokenData = snapshot.docs[0]
  if (!tokenData.accessToken) throw new Error('No access tokens')
  if (tokenData.status !== 'active') throw new Error('Token not active')

  if (interaction.emailProvider === 'google') {
    return createGmailClient(AuthType.OAUTH, tokenData)
  }

  if (interaction.emailProvider === 'microsoft') {
    return undefined
  }

  return undefined
}
