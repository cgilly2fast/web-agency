function base64UrlEncode(msg: any): string {
  const email = `From: ${msg.from}\r\nTo: ${msg.to}\r\nSubject: ${msg.subject}\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset='UTF-8'\r\nContent-Transfer-Encoding: 7bit\r\n\r\n${msg.body}`
  return Buffer.from(email).toString('base64')
}
