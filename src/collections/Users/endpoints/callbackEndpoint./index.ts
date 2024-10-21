import { Integration, User } from '@/payload-types'
import { Endpoint, PayloadRequest } from 'payload'
import moment from 'moment-timezone'
import { DB_TIME_FORMAT } from '@/lib/types'
import { getTokenData } from './getTokenData'
import { getUserInfo } from './getUserInfo'
import { loginFromOAuth } from './loginFromOAuth'

export const callbackEndpoint: Endpoint = {
  method: 'get',
  path: '/oauth/callback',
  handler: async (req: PayloadRequest) => {
    try {
      const { code, state } = req.query
      const { payload } = req
      if (typeof code !== 'string')
        throw new Error(`Code not in query string: ${JSON.stringify(req.query)}`)
      console.log('passed', code)
      if (typeof state !== 'string' || state === '') {
        throw new Error('Invalid state, possible csrf attack.')
      }

      console.log('passed', state)
      const oAuthState = await payload.findByID({
        collection: 'oauth-states',
        id: state,
        depth: 1,
      })

      console.log('passed', oAuthState)
      let user = oAuthState.user as User | null | undefined
      const integration = oAuthState.integration as Integration

      if (
        !user &&
        integration.id !== '671430fa84ee29114c970306' &&
        integration.id !== '6714317784ee29114c9704fd'
      ) {
        throw new Error('Invalid request, must have userId for this integration: ' + integration.id)
      }
      console.log('passed', user, integration.id)

      const tokenData = await getTokenData(integration, code)
      console.log(tokenData)
      const accessToken = tokenData?.access_token
      if (typeof accessToken !== 'string')
        throw new Error(`No access token: ${JSON.stringify(tokenData)}`)

      const userInfo = await getUserInfo(integration, accessToken)

      if (!user) {
        const userSnapshot = await req.payload.find({
          collection: 'users',
          where: {
            email: {
              equals: userInfo.accountEmail,
            },
          },
          depth: 1,
          limit: 1,
        })
        if (userSnapshot.docs.length === 0) {
          throw new Error('Only pre-existing users can use this service.')
        }
        user = userSnapshot.docs[0] as User
      }

      const snapshot = await req.payload.find({
        collection: 'auth-tokens',
        where: {
          user: { equals: user.id },
          accountEmail: { equals: userInfo.accountEmail },
          integration: {
            equals: integration,
          },
        },
        showHiddenFields: true,
        limit: 1,
      })
      console.log('snapshot', snapshot)
      if (snapshot.docs.length === 0) {
        await req.payload.create({
          collection: 'auth-tokens',
          data: {
            user: user.id,
            integration,
            firm: typeof user.firm === 'string' ? user.firm : user.firm.id,
            id: userInfo.accountId,
            accessToken: tokenData.access_token,
            expiresAt: moment().add(tokenData.expires_in, 'seconds').format(DB_TIME_FORMAT),
            scope: tokenData.scope,
            refreshToken: tokenData.refresh_token,
            status: 'active',
          },
        })
      } else {
        let authToken = snapshot.docs[0]

        await req.payload.update({
          req,
          collection: 'auth-tokens',
          id: authToken.id,
          data: {
            id: userInfo.accountId,
            accessToken: tokenData.access_token,
            expiresAt: moment().add(tokenData.expires_in, 'seconds').format(DB_TIME_FORMAT),
            scope: tokenData.scope,
            refreshToken: tokenData.refresh_token,
            status: 'active',
          },
        })
      }
      console.log(user.email, userInfo.accountEmail)
      if (
        user.email === userInfo.accountEmail &&
        (integration.provider === 'google' || integration.provider === 'microsoft')
      ) {
        return await loginFromOAuth(req, user)
      }
      console.log('end')
      return new Response(null, {
        headers: {
          Location: '/admin/integrations',
        },
        status: 302,
      })
    } catch (error) {
      // /////////////////////////////////////
      // failure redirect
      // /////////////////////////////////////
      console.log('Error: Callback Endpoint', error)
      return new Response(null, {
        headers: {
          'Content-Type': 'application/json',
          Location: '/admin/login',
        },
        status: 302,
      })
    }
  },
}
