import { Button, useAuth } from '@payloadcms/ui'
import { Media } from '@/payload-types'
import Image from 'next/image'
import { useDirectDocuments } from '@/providers/DirectDocumentProvider'
import Link from 'next/link'

export interface IntegrationDrawerConnectedProps {
  drawer?: {
    title?: string | null
    features?:
      | {
          feature?: string | null
          id?: string | null
        }[]
      | null
    requirements?:
      | {
          requirement?: string | null
          id?: string | null
        }[]
      | null
    nowCan?:
      | {
          feature?: string | null
          id?: string | null
        }[]
      | null
    connectedText?: string | null
    connectedButtonText?: string | null
    connectedRouteTo?: ('disconnect' | 'calendar_settings' | 'firm_settings') | null
    documentationLink?: string | null
  }
  name?: string | null
  firmLogo: Media
  icon?: string | Media | null
  connectedTo?: { id: string; email: string }[] | null
  integrationId: string
}

const IntegrationDrawerConnected: React.FC<IntegrationDrawerConnectedProps> = ({
  drawer,
  name,
  firmLogo,
  icon,
  connectedTo,
  integrationId,
}) => {
  const { firm, calendarSettings } = useDirectDocuments()
  const { user } = useAuth()
  let connectButton: React.ReactNode
  if (drawer?.connectedRouteTo! === 'disconnect') {
    connectButton = (
      <Button
        className="ml-[100px]"
        to={
          process.env.NEXT_PUBLIC_SERVER_URL +
          `/api/users/oauth/revoke?integrationId=${integrationId}&userId=${user?.id}`
        }
        Link={Link}
        el={'link'}
      >
        {drawer?.connectedButtonText}
      </Button>
    )
  } else if (drawer?.connectedRouteTo === 'calendar_settings') {
    connectButton = (
      <Button
        className="ml-[100px]"
        to={`/admin/collections/calendar-settings/${calendarSettings}`}
        Link={Link}
        el={'link'}
      >
        {drawer.connectedButtonText}
      </Button>
    )
  } else {
    connectButton = (
      <Button
        className="ml-[100px]"
        to={`/admin/collections/firms/${firm}`}
        Link={Link}
        el={'link'}
      >
        {drawer?.connectedButtonText}
      </Button>
    )
  }
  return (
    <div className=" w-[500px]">
      <h4 className="my-[40px]">{drawer?.connectedText}</h4>

      <div className="flex mb-8">
        <Image
          src={'https://web.firmleads.io' + (icon! as Media).url}
          width={48}
          height={48}
          alt={firmLogo.alt}
          className=" mr-5"
        />
        <div>
          <h5 className="mb-3">Connected By</h5>
          <ul className="mb-5 list-none ml-[-20px]">
            {connectedTo?.map((acct, i) => <li key={i}>{acct.email}</li>)}
          </ul>
        </div>

        {connectButton}
      </div>

      <h4 className="mb-3">With your connected {name}, you can</h4>
      <ul className="mb-5">
        {drawer?.nowCan?.map((can, k) => <li key={k}>{can.feature ?? ''}</li>)}
      </ul>
    </div>
  )
}
export default IntegrationDrawerConnected
