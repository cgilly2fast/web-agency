'use client'
import { useTheme } from '@payloadcms/ui'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface IconProps {
  iconMap: Record<string, string>
  darkModeIconMap: Record<string, string>
}

const IconClient: React.FC<IconProps> = ({ iconMap, darkModeIconMap }) => {
  const [currentIcon, setCurrentIcon] = useState('')
  const { theme } = useTheme()

  useEffect(() => {
    if (theme === 'light') {
      setCurrentIcon(iconMap[window.location.hostname] || iconMap['web.firmleads.io'])
    } else {
      setCurrentIcon(
        darkModeIconMap[window.location.hostname] || darkModeIconMap['web.firmleads.io'],
      )
    }
  }, [iconMap, darkModeIconMap, theme])

  if (currentIcon === '') return null

  return (
    <Image
      style={{
        maxHeight: '19px',
        maxWidth: '19px',
        margin: 'auto',
        objectFit: 'cover',
      }}
      src={process.env.NEXT_PUBLIC_SERVER_URL + currentIcon}
      alt="icon"
      width={19}
      height={19}
    />
  )
}

export default IconClient
