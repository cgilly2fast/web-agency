import type { Payload } from 'payload'

import { cookies as getCookies, headers as getHeaders } from 'next/headers'
import React from 'react'

import { FirmFieldComponentClient } from './Field.client'

const FirmFieldComponent: React.FC<{
  path: string
  payload: Payload
  readOnly: boolean
}> = async (args) => {
  // console.log('TEST', args.payload.collections['event-types'].config.fields)
  const cookies = await getCookies()
  const headers = await getHeaders()
  const { user } = await args.payload.auth({ headers })

  if (user && user?.roles?.includes('super-admin')) {
    return (
      <FirmFieldComponentClient
        initialValue={cookies.get('payload-firm')?.value || undefined}
        path={args.path}
        readOnly={args.readOnly}
      />
    )
  }

  return null
}

export default FirmFieldComponent
