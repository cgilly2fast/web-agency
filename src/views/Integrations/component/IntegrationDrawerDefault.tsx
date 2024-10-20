import { Media } from '@/payload-types'
import { useDirectDocuments } from '@/providers/DirectDocumentProvider'
import { Button, useAuth, useTheme } from '@payloadcms/ui'
import Image from 'next/image'
import Link from 'next/link'

export interface IntegrationDrawerDefaultProps {
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
  integrationId: string
  provider?: 'g' | 'ms' | 'str' | 'clio' | 'lead_docket' | 'z' | null
}

const IntegrationDrawerDefault: React.FC<IntegrationDrawerDefaultProps> = ({
  drawer,
  name,
  firmLogo,
  icon,
  integrationId,
  provider,
}) => {
  const { theme } = useTheme()
  const { firm, calendarSettings } = useDirectDocuments()
  const { user } = useAuth()
  let connectButton: React.ReactNode
  if (drawer?.connectedRouteTo! === 'disconnect') {
    connectButton = (
      <Button
        to={
          process.env.NEXT_PUBLIC_SERVER_URL +
          `/api/users/${provider}/oauth/authorize?integrationId=${integrationId}&userId=${user?.id}`
        }
        Link={Link}
        el={'link'}
      >
        Connect to {name}
      </Button>
    )
  } else if (drawer?.connectedRouteTo === 'calendar_settings') {
    connectButton = (
      <Button
        to={`/admin/collections/availability-settings/${calendarSettings}`}
        Link={Link}
        el={'link'}
      >
        Connect to {name}
      </Button>
    )
  } else {
    connectButton = (
      <Button to={`/admin/collections/firms/${firm}`} Link={Link} el={'link'}>
        Connect to {name}
      </Button>
    )
  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="order-2 md:order-1 w-[400px]">
        <h4 className="mb-5 ">{drawer?.title}</h4>
        <ul className="mb-5">
          {drawer?.features?.map((feat, i) => <li key={i}>{feat.feature}</li>)}
        </ul>
        <div className="mb-3">Requirements</div>
        <ul className="mb-5">
          {drawer?.requirements?.map((req, i) => <li key={i}>{req.requirement ?? ''}</li>)}
        </ul>
        {connectButton}
      </div>

      <div
        className={
          'order-1 md:order-2 h-[300px] w-[400px] rounded-lg flex items-center justify-center md:ml-[48px] mb-5 border-solid border-[1px]  ' +
          (theme === 'light' ? 'bg-[#dddddd] border-white' : ' border-[#575757]')
        }
      >
        <div className="bg-white flex rounded-full items-center justify-center w-[100px] h-[100px]">
          <Image
            src={'https://web.firmleads.io' + firmLogo.url!}
            width={78}
            height={78}
            alt={firmLogo.alt}
            className=""
          />
        </div>
        <div className="text-[48px] text-slate-500 mx-5">+</div>
        <div className="bg-white flex rounded-full items-center justify-center w-[100px] h-[100px]">
          <Image
            src={'https://web.firmleads.io' + (icon! as Media).url}
            width={48}
            height={48}
            alt={firmLogo.alt}
            className=""
          />
        </div>
      </div>
    </div>
  )
}
export default IntegrationDrawerDefault
