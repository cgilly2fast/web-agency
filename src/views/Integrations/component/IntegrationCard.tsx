import { Media } from '@/payload-types'
import {
  Drawer,
  DrawerToggler,
  EditDepthProvider,
  formatDrawerSlug,
  useEditDepth,
  useTheme,
} from '@payloadcms/ui'
import Image from 'next/image'
import { Fragment, use } from 'react'

export interface IntegrationCardProps {
  icon?: string | Media | null
  name?: string | null
  description?: string | null
  children?: React.ReactNode
}
const IntegrationCard: React.FC<IntegrationCardProps> = ({ icon, name, description, children }) => {
  const { theme } = useTheme()

  if (!icon || !name || !description || typeof icon === 'string') return null
  return (
    <Fragment>
      <DrawerToggler
        slug={formatDrawerSlug({ depth: 1, slug: name })}
        className="m-0 p-0 border-none  text-left bg-transparent "
      >
        <div
          className={
            'flex flex-col items-start p-4  rounded-lg  border-solid  shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-full ' +
            (theme === 'dark'
              ? 'bg-[#222222] text-white border-[1px] border-[#3c3c3c] hover:border-[#575757]'
              : 'bg-white border-[#ebebeb] border-[1.5px]')
          }
        >
          <div className="w-12 h-12 mb-3">
            <Image
              src={icon.url!}
              alt={`${name} icon`}
              className="w-full h-full object-contain"
              width={48}
              height={48}
            />
          </div>
          <h3
            className={
              'text-sm font-medium text-gray-900 mb-1' +
              (theme === 'dark' ? ' text-white' : 'text-gray-600')
            }
          >
            {name}
          </h3>
          <p className={'text-xs ' + (theme === 'dark' ? ' text-white' : 'text-gray-600')}>
            {description}
          </p>
        </div>
      </DrawerToggler>
      <Drawer slug={formatDrawerSlug({ depth: 1, slug: name })} title={name + ' Setup'}>
        {children}
      </Drawer>
    </Fragment>
  )
}

export default IntegrationCard
