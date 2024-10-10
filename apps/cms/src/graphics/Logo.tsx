import React from 'react'
import { useAuth } from '@payloadcms/ui'
import { User } from '@/payload-types'

export const Logo = () => {
  const { user } = useAuth<User>()

  const tenant = user?.lastLoggedInTenant ?? user?.tenants
}
