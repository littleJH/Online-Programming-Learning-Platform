import React from 'react'
import style from './style.module.scss'

const ChatMessageCard: React.FC<{
  mode: 'left' | 'right'
  children: string
}> = props => {
  const { mode, children } = props
  return (
    <div
      className={`relative p-4 mx-8 shadow rounded bg-white  ${
        mode === 'left' ? style.message_left : style.message_right
      }`}
      style={{
        border: '1px solid black'
      }}
    >
      {children}
    </div>
  )
}

export default ChatMessageCard
