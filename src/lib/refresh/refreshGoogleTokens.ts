export type GoogleOAuthResponse = {
  access_token: string
  expires_in: number
  refresh_token?: string
  scope: string
  token_type: 'Bearer'
}
export type GoogleTokenRefreshResult =
  | { success: true; data: GoogleOAuthResponse }
  | { success: false; error: 'invalid_grant' | 'network_error' | 'unknown_error'; message: string }

export async function refreshGoogleAccessToken(
  refreshToken: string,
): Promise<GoogleTokenRefreshResult> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
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

    const data: GoogleOAuthResponse = await response.json()
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
