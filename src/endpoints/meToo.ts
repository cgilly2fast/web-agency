import httpStatus from 'http-status'
import { meOperation, PayloadRequest, Collection, Payload, PayloadHandler } from 'payload'

export const meToo: PayloadHandler = async (req) => {
  let currentToken = extractJWT(req)

  const collection = req.payload.collections['users']

  if (!currentToken) {
    console.log('return NULL')
    currentToken = ''
  }
  console.log(collection)
  const result = await meOperation({
    collection,
    currentToken,
    req,
  })

  if (collection.config.auth.removeTokenFromResponses) {
    delete result.token
  }

  console.log('result1', {
    ...result,
    message: req.t('authentication:account'),
  })

  console.log('result2', {
    headers: headersWithCors({
      headers: new Headers(),
      req,
    }),
    status: httpStatus.OK,
  })

  return Response.json(
    {
      ...result,
      message: req.t('authentication:account'),
    },
    {
      headers: headersWithCors({
        headers: new Headers(),
        req,
      }),
      status: httpStatus.OK,
    },
  )
}

type CollectionRouteHandler = ({
  collection,
  req,
}: {
  collection: Collection
  req: PayloadRequest
}) => Promise<Response> | Response

type CorsArgs = {
  headers: Headers
  req: Partial<PayloadRequest>
}

type AuthStrategyFunctionArgs = {
  headers: Request['headers']
  isGraphQL?: boolean
  payload: Payload
}
const headersWithCors = ({ headers, req }: CorsArgs): Headers => {
  const cors = req?.payload!.config.cors
  const requestOrigin = req?.headers!.get('Origin')!

  if (cors) {
    const defaultAllowedHeaders = [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Content-Encoding',
      'x-apollo-tracing',
    ]

    headers.set('Access-Control-Allow-Methods', 'PUT, PATCH, POST, GET, DELETE, OPTIONS')

    if (typeof cors === 'object' && 'headers' in cors) {
      headers.set(
        'Access-Control-Allow-Headers',
        [...defaultAllowedHeaders, ...cors.headers].filter(Boolean).join(', '),
      )
    } else {
      headers.set('Access-Control-Allow-Headers', defaultAllowedHeaders.join(', '))
    }

    if (cors === '*' || (typeof cors === 'object' && 'origins' in cors && cors.origins === '*')) {
      headers.set('Access-Control-Allow-Origin', '*')
    } else if (
      (Array.isArray(cors) && cors.indexOf(requestOrigin) > -1) ||
      (!Array.isArray(cors) &&
        typeof cors === 'object' &&
        'origins' in cors &&
        cors.origins.indexOf(requestOrigin) > -1)
    ) {
      headers.set('Access-Control-Allow-Credentials', 'true')
      headers.set('Access-Control-Allow-Origin', requestOrigin)
    }
  }

  return headers
}

export const extractJWT = (args: AuthStrategyFunctionArgs): null | string => {
  const { headers, payload } = args

  const jwtFromHeader = headers.get('Authorization')
  const origin = headers.get('Origin')

  if (jwtFromHeader?.startsWith('JWT ')) {
    return jwtFromHeader.replace('JWT ', '')
  }
  // allow RFC6750 OAuth 2.0 compliant Bearer tokens
  // in addition to the payload default JWT format
  if (jwtFromHeader?.startsWith('Bearer ')) {
    return jwtFromHeader.replace('Bearer ', '')
  }

  const cookies = parseCookies(headers)
  console.log(cookies)
  const tokenCookieName = `${payload.config.cookiePrefix}-token`
  console.log(tokenCookieName)
  const cookieToken = cookies.get(tokenCookieName)
  console.log(cookieToken)
  if (!cookieToken) {
    return null
  }
  console.log('ORIGIN', origin)
  console.log('! ORIGIN', !origin)
  console.log('CSRF', payload.config.csrf)
  console.log('CSRF LENGTH', payload.config.csrf.length)
  if (!origin || payload.config.csrf.length === 0 || payload.config.csrf.indexOf(origin) > -1) {
    return cookieToken
  }

  return null
}

export const parseCookies = (headers: Request['headers']): Map<string, string> => {
  const list = new Map<string, string>()
  const rc = headers.get('Cookie')

  if (rc) {
    rc.split(';').forEach((cookie) => {
      const parts = cookie.split('=')
      const key = (parts.shift() ?? '').trim()
      const encodedValue = parts.join('=')

      try {
        const decodedValue = decodeURI(encodedValue)
        list.set(key, decodedValue)
      } catch (e) {
        throw new Error(`Error decoding cookie value for key ${key}: ${(e as any).message}`)
      }
    })
  }

  return list
}
