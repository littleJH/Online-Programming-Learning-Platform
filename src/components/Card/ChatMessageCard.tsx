import React from 'react'
import style from './style.module.scss'

const ChatMessageCard: React.FC<{
  mode: 'left' | 'right'
  children: string
}> = props => {
  const { mode, children } = props
  return (
    <div
      className={`relative p-4 mx-8 shadow rounded ${
        mode === 'left' ? style.messageLeft : style.messageRight
      }`}
    >
      {children}
    </div>
  )
}

export default ChatMessageCard
