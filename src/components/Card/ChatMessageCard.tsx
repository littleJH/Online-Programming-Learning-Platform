import React from 'react'
import style from './style.module.scss'
import { theme, Card } from 'antd'

const ChatMessageCard: React.FC<{
  mode: 'left' | 'right'
  children: string
}> = props => {
  const { mode, children } = props
  const { token } = theme.useToken()

  return (
    // <div className={`relative ${mode === 'left' ? style.message_left : style.message_right}`}>
    <Card
      size="small"
      style={{
        margin: '0 1rem',
      }}
    >
      {children}
    </Card>
    // </div>
  )
}

export default ChatMessageCard
