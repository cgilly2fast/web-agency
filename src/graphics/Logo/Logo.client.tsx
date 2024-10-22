'use client'
import { useTheme } from '@payloadcms/ui'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface LogoProps {
  logoMap: Record<string, string>
  darkModeLogoMap: Record<string, string>
}

const LogoClient: React.FC<LogoProps> = ({ logoMap, darkModeLogoMap }) => {
  const [currentLogo, setCurrentLogo] = useState('')
  const { theme } = useTheme()

  useEffect(() => {
    if (theme === 'light') {
      setCurrentLogo(logoMap[window.location.hostname] || logoMap['web.firmleads.io'])
    } else {
      setCurrentLogo(
        darkModeLogoMap[window.location.hostname] || darkModeLogoMap['web.firmleads.io'],
      )
    }
  }, [logoMap, darkModeLogoMap, theme])

  if (currentLogo === '') return null

  return (
    <Image
      style={{
        maxHeight: '125px',
        maxWidth: '125px',
        margin: 'auto',
        objectFit: 'cover',
      }}
      src={process.env.NEXT_PUBLIC_SERVER_URL + currentLogo}
      alt="logo"
      width={125}
      height={125}
    />
  )
}

export default LogoClient
