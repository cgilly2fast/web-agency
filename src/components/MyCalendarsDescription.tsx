import { Button, useAuth } from '@payloadcms/ui'
import Link from 'next/link'

const MyCalendarDescription = () => {
  const { user } = useAuth()
  return (
    <div className="flex">
      <Button
        Link={Link}
        to={`/api/users/oauth/authorize?integrationId=671430fa84ee29114c970306&userId=${user?.id}`}
        className="mr-5"
      >
        Add Google Calendar
      </Button>
      <Button
        Link={Link}
        to={`/api/users/oauth/authorize?integrationId=6714317784ee29114c9704fd&userId=${user?.id}`}
      >
        Add Outlook Calendar
      </Button>
    </div>
  )
}

export default MyCalendarDescription
