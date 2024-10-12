'use client'
import React, { useState, useCallback } from 'react'
import { Gutter, useStepNav } from '@payloadcms/ui'
import style from './Chat.module.scss'
import {
  query,
  collection,
  orderBy,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore'
import { db } from '../../../config/firebase'
import ChatRooms from './ChatRoomList'
import ChatMessages from './ChatMessages'
import ChatFooter from './ChatFooter'
import ChatHeader from './ChatHeader'

const getInitial = (name = '') => {
  return name.charAt(0).toUpperCase()
}

const getBackgroundColor = (name: string) => {
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colors = ['#FF5733', '#3357FF', '#FF33A1', '#A133FF']
  return colors[hash % colors.length]
}

export interface ChatRoom {
  id: string
  name: string
  lastMessage: string
  lastSeen: number
}
const ChatPage = () => {
  const { stepNav, setStepNav } = useStepNav()
  if (stepNav.length === 0) {
    setStepNav([
      {
        label: 'Chat',
      },
    ])
  }

  const [chatRooms, setChatRooms] = useState<any[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom>(chatRooms[0] || {})
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [lastSeen, setLastSeen] = useState(0)
  const [messageText, setMessageText] = useState('')

  useCallback(() => {
    const getChatRooms = async () => {
      try {
        const collectionChatroom = collection(db, 'chats')
        onSnapshot(query(collectionChatroom, orderBy('updated_at', 'desc')), (querySnapshot) => {
          let roomsData: any[] = []
          querySnapshot.forEach((doc) => {
            const data = doc.data()
            roomsData.push({
              id: doc.id,
              name: data?.ip_address ?? '',
              lastMessage: data?.latest_message,
              lastSeen: data?.updated_at.seconds,
            })
          })
          setChatRooms(roomsData)
          setSelectedRoom(roomsData[0])
        })
      } catch (error) {
        console.log('error from getChatRooms', error)
      }
    }
    getChatRooms()
  }, [])

  useCallback(() => {
    const getChatMessages = async () => {
      try {
        const collectionChatMessages = collection(db, 'chats', selectedRoom.id, 'messages')
        onSnapshot(query(collectionChatMessages, orderBy('created', 'asc')), (querySnapshot) => {
          let msgData: any[] = []
          querySnapshot.forEach((msg) => {
            const data = msg.data()
            msgData.push({
              text: data.message ?? JSON.stringify(data.content),
              fromUser: data.receiver_id === 'user' ? false : true,
              messageTime: data.created.seconds,
            })
          })
          setChatMessages(msgData)
          setLastSeen(
            msgData
              ?.slice()
              .reverse()
              .find((ele) => !ele?.fromUser)?.messageTime,
          )
        })
      } catch (error) {
        console.log('Error from getChatMessages', error)
      }
    }
    if (selectedRoom?.id) {
      getChatMessages()
    }
  }, [selectedRoom?.id])

  const handleSendMessage = async (msgText: string, chatroom: string) => {
    setMessageText('')

    const updateMsg = doc(db, 'chats', chatroom)
    await updateDoc(updateMsg, {
      latest_message: msgText,
      updated_at: serverTimestamp(),
    })

    const userDocRef = collection(db, 'chats', chatroom, 'messages')
    await addDoc(userDocRef, {
      message: msgText,
      receiver_id: 'assistant',
      created_at: serverTimestamp(),
    })
  }

  const timeConversion = (time: number, type: string): string => {
    const msgTime = new Date(time * 1000).toLocaleDateString()
    const hours = new Date(time * 1000).getHours()
    const minutes = new Date(time * 1000).getMinutes()

    if (type === 'last seen') {
      if (msgTime === new Date().toLocaleDateString()) {
        return 'today at ' + hours + ':' + minutes
      } else {
        return msgTime + ' at ' + hours + ':' + minutes
      }
    }

    if (type === 'message time') {
      return hours + ':' + minutes
    }
    return ''
  }

  return (
    <Gutter
    // i18n={initPageResult.req.i18n}
    // locale={initPageResult.locale}
    // params={params}
    // payload={initPageResult.req?.payload}
    // permissions={initPageResult.permissions}
    // searchParams={searchParams}
    // user={initPageResult.req.user || undefined}
    // visibleEntities={initPageResult.visibleEntities}
    // visibleEntities={{ collections: [], globals: [] }}
    >
      <div className={style.container}>
        <div className={style.wrapper}>
          <div className={style.sidebar}>
            <div className={style.sidebarsearch}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
              <input type="text" placeholder="Search..." className={style.sidebarsearchinput} />
            </div>
            <ChatRooms
              chatRooms={chatRooms}
              setSelectedRoom={setSelectedRoom}
              getBackgroundColor={getBackgroundColor}
              getInitial={getInitial}
            />
          </div>
          <div className={style.chat}>
            <ChatHeader
              selectedRoom={selectedRoom}
              getBackgroundColor={getBackgroundColor}
              getInitial={getInitial}
              timeConversion={timeConversion}
              lastSeen={lastSeen}
            />

            <ChatMessages chatMessages={chatMessages} timeConversion={timeConversion} />

            <ChatFooter
              handleSendMessage={handleSendMessage}
              messageText={messageText}
              setMessageText={setMessageText}
              selectedRoomId={selectedRoom.id}
            />
          </div>
        </div>
      </div>
    </Gutter>
  )
}

export default ChatPage
