import { Button } from '@payloadcms/ui'
import Link from 'next/link'

const MyCalendarDescription = () => {
  return (
    <div className="flex">
      <Button Link={Link} to="/api/users/g/oauth/authorize" className="mr-5">
        Add Google Calendar
      </Button>
      <Button Link={Link} to="/api/users/ms/oauth/authorize">
        Add Outlook Calendar
      </Button>
    </div>
  )
}

export default MyCalendarDescription
