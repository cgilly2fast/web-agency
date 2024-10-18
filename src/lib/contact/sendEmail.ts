import { gmail_v1 } from 'googleapis'

export async function sendEmail(
  gmail: gmail_v1.Gmail,
  to: string,
  from: string,
  subject: string,
  body: any,
) {
  const message = {
    from: from,
    to: to,
    subject: subject,
    body: body,
  }

  console.log('email message', message)

  const request = {
    userId: 'me',
    resource: {
      raw: base64UrlEncode(message),
    },
    // auth: jwt,
    // key: credentials.firebase.apiKey!,
  }
  try {
    const response = await gmail.users.messages.send(request)
    return { success: true, statusCode: response.status }
  } catch (error) {
    if (error instanceof Error) {
      const googleError = error as any // Type assertion for Google API error
      const statusCode = (googleError.code as number) || 500
      const errorMessage = (googleError.message as string) || 'Unknown error'

      console.log('send email error', { statusCode, errorMessage })

      return {
        success: false,
        statusCode: statusCode,
        error: errorMessage,
      }
    }
    return { success: false, error: 'Unknown error occurred' }
  }
}
