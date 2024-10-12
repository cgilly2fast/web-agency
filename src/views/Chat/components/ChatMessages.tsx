'use client'
import React, { useEffect, useRef } from 'react'
import style from './Chat.module.scss'

interface ChatMessagesProps {
  chatMessages: any[]
  timeConversion: (time: number, type: string) => string
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ chatMessages, timeConversion }) => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const scrollToBottom = () => {
      if (messageContainerRef.current) {
        const container = messageContainerRef.current
        const scrollHeight = container.scrollHeight
        setTimeout(() => {
          container.scrollTop = scrollHeight
        }, 0)
      }
    }
    scrollToBottom()
  }, [chatMessages])
  return (
    <div className={style.messagesContainer} ref={messageContainerRef}>
      {chatMessages.map((msg, index) => (
        <div
          key={index}
          className={`${style.messageWrapper} ${
            msg.fromUser ? style.messageFromUser : style.messageFromOther
          }`}
        >
          <div>
            <div className={style.messageContent}>{msg.text}</div>
            <div
              className={`${style.messageTime} ${
                msg.fromUser ? style.timeUserMsg : style.timeOtherMsg
              }`}
            >
              {' '}
              {timeConversion(msg.messageTime, 'message time')}{' '}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatMessages
