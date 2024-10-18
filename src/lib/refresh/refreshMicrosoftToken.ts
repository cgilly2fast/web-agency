export type MicrosoftOAuthResponse = {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  scope?: string
  refresh_token?: string
  id_token?: string
}

export type MicrosoftTokenRefreshResult =
  | { success: true; data: MicrosoftOAuthResponse }
  | { success: false; error: 'invalid_grant' | 'network_error' | 'unknown_error'; message: string }

export async function refreshMicrosoftAccessToken(
  refreshToken: string,
): Promise<MicrosoftTokenRefreshResult> {
  const firmId = process.env.MICROSOFT_TENANT_ID || 'common'
  try {
    const response = await fetch(`https://login.microsoftonline.com/${firmId}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_OAUTH_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_OAUTH_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        scope: 'https://graph.microsoft.com/.default',
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      if (errorData.error === 'invalid_grant') {
        return {
          success: false,
          error: 'invalid_grant',
          message: errorData.error_description || 'Invalid grant',
        }
      }
      return {
        success: false,
        error: 'unknown_error',
        message: `HTTP error! status: ${response.status}, message: ${errorData.error_description || 'Unknown error'}`,
      }
    }

    const data: MicrosoftOAuthResponse = await response.json()
    if (!data.access_token) {
      return {
        success: false,
        error: 'unknown_error',
        message: 'No access token received',
      }
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: 'network_error',
      message: error instanceof Error ? error.message : 'Unknown network error',
    }
  }
}
