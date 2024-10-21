import { FilterOptions } from 'payload'

export const filterUserCalendars: FilterOptions = ({ user }) => {
  if (!user) return false
  return {
    user: { equals: typeof user === 'string' ? user : user.id },
    integration: {
      in: ['6714317784ee29114c9704fd', '671430fa84ee29114c970306'],
    },
  }
}
