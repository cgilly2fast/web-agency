import type { Access } from 'payload'

export const lastLoggedInFirm: Access = ({ req: { user }, data }) => {
  if (typeof user?.lastLoggedInFirm === 'string') {
    return user.lastLoggedInFirm === data?.id
  }

  return user?.lastLoggedInFirm?.id === data?.id
}
