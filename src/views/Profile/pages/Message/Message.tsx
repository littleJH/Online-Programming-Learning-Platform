import { createMessageApi, getMessageListApi } from '@/api/message'
import { notificationApi, userInfoState } from '@/store/appStore'
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import style from '../../style.module.scss'
import { Avatar, Button, Card, Divider, Input, List, theme } from 'antd'
import MyAvatar from '@/components/Avatar/MyAvatar'
import { getUserInfoApi } from '@/api/user'
import Highlight from '@/components/Editor/Highlight'
import ReadOnly from '@/components/editor/Readonly'
import utils from '@/tool/myUtils/utils'

const Message: React.FC = () => {
  const currentUser = useRecoilValue(userInfoState)
  const notification = useRecoilValue(notificationApi)
  const [messageList, setMessageList] = useState([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const { token } = theme.useToken()

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    if (!currentUser) return
    try {
      const list: any = []
      const res = (await getMessageListApi(currentUser?.id, 1, 20)).data.data.messages
      for (let message of res) {
        const user = (await getUserInfoApi(message.user_id)).data.data.user
        list.push({
          ...message,
          user,
        })
      }
      setMessageList(list.reverse())
    } catch {}
  }

  const renderMessageCard = (msgItem: any) => {
    const bool = msgItem.author_id === currentUser?.id
    return (
      <div className={`w-full flex justify-${bool ? 'end' : 'start'}`}>
        {!bool && <MyAvatar user={msgItem.user}></MyAvatar>}
        <div style={{ maxWidth: '75%' }}>
          {/* <ChatMessageCard mode={bool ? 'right' : 'left'}>{msgItem.content}</ChatMessageCard> */}
          <Card
            size="small"
            style={{
              margin: '0 1rem',
              backgroundColor: `${bool ? token.colorPrimaryBg : ''}`,
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: utils.getHtmlFromMd(msgItem.content) }}></div>
          </Card>
        </div>

        {bool && <MyAvatar user={msgItem.user}></MyAvatar>}
      </div>
    )
  }

  const sendMessage = async () => {
    if (!currentUser) return
    try {
      setLoading(true)
      const res = await createMessageApi(currentUser.id, messageText)
      if (res.data.code === 200) {
        fetch()
        setMessageText('')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={style.message}>
      <div className={style.messageList}>
        <div ref={boxRef}>
          <List
            split={false}
            dataSource={messageList}
            renderItem={(item: any, index) => (
              <>
                {item && (
                  <List.Item
                    onLoad={() => {
                      if (index === messageList.length - 1) {
                        boxRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'end',
                        })
                      }
                    }}
                    key={`${item.author_id}${item.created_at}`}
                  >
                    {renderMessageCard(item)}
                  </List.Item>
                )}
              </>
            )}
          ></List>
        </div>
      </div>
      <Divider></Divider>
      <div>
        <Input.TextArea
          rows={4}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onPressEnter={(e) => {
            e.preventDefault()
            if (loading) return
            sendMessage()
          }}
        ></Input.TextArea>
        <p className="text-end">
          <Button type="primary" onClick={sendMessage} loading={loading}>
            发送
          </Button>
        </p>
      </div>
    </div>
  )
}

export default Message
