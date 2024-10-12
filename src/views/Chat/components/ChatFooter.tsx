import React from 'react'
import style from './Chat.module.scss'

interface ChatFooter {
  handleSendMessage: (msgText: string, chatroom: string) => Promise<void>
  messageText: string
  setMessageText: (value: React.SetStateAction<string>) => void
  selectedRoomId: string
}

const ChatFooter: React.FC<ChatFooter> = ({
  handleSendMessage,
  messageText,
  setMessageText,
  selectedRoomId,
}) => {
  return (
    <div className={style.chatInput}>
      <form
        onSubmit={(e) =>
          messageText.trim().length
            ? (e.preventDefault(), handleSendMessage(messageText, selectedRoomId))
            : (e.preventDefault(), setMessageText(''))
        }
        className={style.form}
      >
        <button className={style.button}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-emoji-smile"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
          </svg>
        </button>
        <input
          className={style.input}
          type="text"
          name="message"
          placeholder="Type a message..."
          autoComplete="off"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button type="submit" className={style.sendButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-send"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default ChatFooter
