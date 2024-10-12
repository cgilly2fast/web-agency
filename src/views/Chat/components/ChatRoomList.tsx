import React, { Dispatch, SetStateAction } from 'react'
import style from './Chat.module.scss'
import { ChatRoom } from './ChatPage'

interface ChatRoomProps {
  chatRooms: any[]
  setSelectedRoom: Dispatch<SetStateAction<ChatRoom>>
  getBackgroundColor: (name: string) => string
  getInitial: (name: string) => string
}

const ChatRooms: React.FC<ChatRoomProps> = ({
  chatRooms,
  setSelectedRoom,
  getBackgroundColor,
  getInitial,
}) => {
  return (
    <ul className={style.sidebarlist}>
      {chatRooms?.length > 0
        ? chatRooms?.map((room) => (
            <li key={room.id} className={style.room} onClick={() => setSelectedRoom(room)}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: getBackgroundColor(room?.name),
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: 'white',
                  fontSize: '18px',
                  marginRight: '10px',
                }}
              >
                {getInitial(room.name)}
              </div>
              <div
                style={{
                  maxWidth: '160px',
                }}
              >
                <strong>{room?.name}</strong>
                <div
                  style={{
                    maxHeight: '45px',
                    overflow: 'hidden',
                  }}
                >
                  {room?.lastMessage}
                </div>
              </div>
            </li>
          ))
        : 'No Chat Found!'}
    </ul>
  )
}

export default ChatRooms
