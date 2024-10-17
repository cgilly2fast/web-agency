/**
import { google } from 'googleapis'
export function sendEmail(to: string, from: string, subject: string, body: any) {
  const message = {
    from: from,
    to: to,
    subject: subject,
    body: body,
  }

  console.log('email message', message)
  // get access token for

  const request = {
    userId: 'me',
    resource: {
      raw: base64UrlEncode(message),
    },
    auth: jwt,
    key: credentials.firebase.apiKey!,
  }
  const gmail = google.gmail('v1')
  try {
    return gmail.users.messages.send(request)
  } catch (error) {
    console.log('send email error', error)
    return 'Error'
  }
}

 */
