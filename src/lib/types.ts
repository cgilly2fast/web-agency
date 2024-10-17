export const enum OutreachType {
  TXT = '0',
  EMAIL = '1',
  CALL = '2',
}

export const enum AuthType {
  OAUTH = 'OAUTH',
  JWT = 'JWT',
}

export interface OAuthCredentials {
  accessToken?: string | null
  refreshToken?: string | null
  expiresIn?: number | null
  [key: string]: any
}

export interface JWTCredentials {
  clientEmail: string
  privateKey: string
}
