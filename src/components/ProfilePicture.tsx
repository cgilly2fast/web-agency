'use client'
import React from 'react'
import { useAuth } from '@payloadcms/ui'
import { Media, User } from '../payload-types'
import Image from 'next/image'

const ProfilePicture = () => {
  const { user } = useAuth<User>()
  return (
    <Image
      style={{
        width: '25px',
        height: '25px',
        borderRadius: '50%',
        objectFit: 'cover',
      }}
      src={
        (user?.avatar as Media)?.url ||
        'https://www.gravatar.com/avatar/218644472ede33e83ae2002c4f4336d3?default=mp&r=g&s=50'
      }
      alt="profile picture"
      width={25}
      height={25}
    />
  )
}

export default ProfilePicture
