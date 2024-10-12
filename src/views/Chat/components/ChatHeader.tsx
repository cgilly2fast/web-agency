import React from 'react'
import style from './Chat.module.scss'
import { ChatRoom } from './ChatPage'

interface ChatHeaderProps {
  selectedRoom: ChatRoom
  getBackgroundColor: (name: string) => string
  getInitial: (name: string) => string
  timeConversion: (time: number, type: string) => string
  lastSeen: number
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedRoom,
  getBackgroundColor,
  getInitial,
  timeConversion,
  lastSeen,
}) => {
  return (
    <div className={style.chatHeader}>
      <div className={style.chatHeaderdiv}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: getBackgroundColor(selectedRoom?.name ?? ''),
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: 'white',
            fontSize: '18px',
            marginRight: '10px',
          }}
        >
          {getInitial(selectedRoom?.name)}
        </div>
        <div>
          <h3>{selectedRoom?.name}</h3>
          <div>last seen {timeConversion(lastSeen, 'last seen')}</div>
        </div>
        <div>DB ID: {selectedRoom.id}</div>
      </div>
      <div className={style.chatHeaderdiv}>
        <button className={style.button}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </button>
        <button className={style.button}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-three-dots-vertical"
            viewBox="0 0 16 16"
          >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ChatHeader
