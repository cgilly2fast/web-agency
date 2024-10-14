'use client'
import { Button } from '@payloadcms/ui'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const OAuthButtons: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const htmlElement = document.documentElement
    console.log(htmlElement.getAttribute('data-theme'))
    const theme = htmlElement.getAttribute('data-theme')

    setDarkMode(theme === 'dark')
  }, [])

  return (
    <div>
      <span className="items-center justify-center flex">
        <span
          className={
            'border-t-[.5px] border-solid w-full border-x-0 border-b-0 max-w-[120px] ' +
            (darkMode ? 'border-white' : 'border-black')
          }
        ></span>
        <span className="text-center mx-2 pb-[3px]">or</span>
        <span
          className={
            'border-t-[.5px] border-solid w-full border-x-0 border-b-0 max-w-[120px] ' +
            (darkMode ? 'border-white' : 'border-black')
          }
        ></span>
      </span>
      <Link className="no-underline" href="/api/users/g/oauth/authorize">
        <Button
          className="w-full"
          round={true}
          buttonStyle="secondary"
          size="large"
          iconPosition="left"
          icon={
            <Image
              src={
                process.env.NEXT_PUBLIC_SERVER_URL +
                (darkMode ? '/api/media/file/gLogoWhite.svg' : '/api/media/file/gLogoBlack.svg')
              }
              alt="google logo"
              width={20}
              height={20}
            ></Image>
          }
        >
          Continue with Google
        </Button>
      </Link>
      <Link className="no-underline" href="/api/users/ms/oauth/authorize">
        <Button
          className="w-full m-0"
          round={true}
          buttonStyle="secondary"
          size="large"
          iconPosition="left"
          icon={
            <Image
              src={
                process.env.NEXT_PUBLIC_SERVER_URL +
                (darkMode ? '/api/media/file/msLogoWhite.svg' : '/api/media/file/msLogoBlack.svg')
              }
              alt="microsoft logo"
              width={20}
              height={20}
            ></Image>
          }
        >
          Continue with Microsoft
        </Button>
      </Link>
    </div>
  )
}

export default OAuthButtons
