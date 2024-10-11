const sanitizePrivateKey = (key: any) => {
  if (typeof key !== 'string') return ''

  return key.replace(/\\n/g, '\n')
}

// process.env.NODE_ENV && process.env.NODE_ENV === 'production'

// Set different environment variables based on the environment
export const serviceAccount = {
  type: process.env.SERVICE_ACCOUNT_TYPE,
  projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: sanitizePrivateKey(process.env.SERVICE_ACCOUNT_PRIVATE_KEY),
  client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URL,
  token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URL,
  auth_provider_x509_cert_url: process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
  universe_domain: process.env.SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
}

console.log('SERVICE_ACCOUNT', serviceAccount)
