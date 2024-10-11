import type { Access } from 'payload'

export const lastLoggedInTenant: Access = ({ req: { user }, data }) => {
  if (typeof user?.lastLoggedInTenant === 'string') {
    return user.lastLoggedInTenant === data?.id
  }

  return user?.lastLoggedInTenant?.id === data?.id
}
