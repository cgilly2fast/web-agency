'use client'
import { useConfig } from '@payloadcms/ui'
import React from 'react'

const ChatNavLink: React.FC = () => {
  const { config } = useConfig()
  const adminRoute = config.routes.admin

  const handleBotChatClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const baseUrl = window.location.origin
    const botChatUrl = `${baseUrl}${adminRoute}/chat`
    window.location.href = botChatUrl
  }

  return (
    <div className="after-nav-links">
      <span className="nav__label">Custom Routes</span>
      <nav>
        <a href="#" onClick={handleBotChatClick}>
          AI Chat
        </a>
      </nav>
    </div>
  )
}

export default ChatNavLink
