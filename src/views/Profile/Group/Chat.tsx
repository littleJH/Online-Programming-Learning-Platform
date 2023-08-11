import { getGroupLettersApi } from '@/api/Letter'
import { IChat, IGroup } from '@/vite-env'
import { Avatar, Button, Divider, Drawer, Input, List, Modal, Spin } from 'antd'
import { TextAreaRef } from 'antd/es/input/TextArea'
import React, { KeyboardEventHandler, useEffect, useRef, useState } from 'react'
import { EllipsisOutlined } from '@ant-design/icons'
import GroupMember from '@/components/Group/GroupMember'
import { craeteChatApi, enterPublishChatWs, getGroupChatsApi } from '@/api/chat'
import { getUserInfoApi } from '@/api/user'
import { iconBaseUrl } from '@/api/baseConfig'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@/Recoil/store'
import ChatMessageCard from '@/components/Card/ChatMessageCard'

interface IProps {
  group: IGroup
}

const Chat: React.FC<IProps> = props => {
  const { group } = props
  const info = useRecoilValue(userInfoState)
  const inputTextarea = useRef<TextAreaRef>(null)
  const [openModal, setOpenModal] = useState(false)
  const [text, setText] = useState('')
  const [chatList, setChatList] = useState<IChat[]>([])
  const [loading, setLoading] = useState(true)
  const chatBox = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getGroupChatsApi(group.id).then(async res => {
      console.log(res.data.data)
      const list: IChat[] = []
      for (let item of res.data.data.chats) {
        const user = await getUserInfoApi(item.author_id)
        list.push({
          ...item,
          user: user.data.data.user
        })
      }
      setChatList(list)
      setLoading(false)
    })
  }, [group])

  const sendChat = () => {
    if (!text.length) return
    craeteChatApi(
      group.id,
      JSON.stringify({
        content: text
      })
    ).then(res => {
      if (res.data.code === 200) {
        setText('')
      }
    })
  }

  return (
    <>
      <div
        className="h-full w-full flex flex-col border border-solid border-slate-300 rounded"
        style={{
          width: '768px'
        }}
      >
        <div className="h-3/4 flex flex-col">
          <div className="sticky top-0 z-10 flex justify-between items-center">
            <span className="mx-8">{group.title}</span>
            <span
              className="mx-2"
              onClick={() => {
                setOpenModal(true)
              }}
            >
              <EllipsisOutlined
                style={{
                  fontSize: '2rem',
                  cursor: 'pointer'
                }}
              />
            </span>
          </div>
          <div ref={chatBox} className="grow px-8 overflow-scroll">
            <List
              loading={loading}
              split={false}
              dataSource={chatList}
              renderItem={(item, index) => (
                <List.Item
                  onLoad={() => {
                    if (index === chatList.length - 1) {
                      chatBox.current?.scrollIntoView(false)
                    }
                  }}
                  key={`${item.author_id}${item.created_at}`}
                >
                  {item.author_id === info?.id && (
                    <div className="w-full flex justify-end">
                      <ChatMessageCard mode="right">
                        {item.content}
                      </ChatMessageCard>
                      <Avatar src={`${iconBaseUrl}/${item.user.icon}`}></Avatar>
                    </div>
                  )}
                  {item.author_id !== info?.id && (
                    <div className="w-full">
                      <Avatar src={`${iconBaseUrl}/${item.user.icon}`}></Avatar>
                      <ChatMessageCard mode="left">
                        {item.content}
                      </ChatMessageCard>
                    </div>
                  )}
                </List.Item>
              )}
            ></List>
          </div>
        </div>
        <div
          className="h-1/4 border-slate-300 relative"
          style={{
            borderTopWidth: '1px',
            borderTopStyle: 'solid'
          }}
          onClick={() => inputTextarea.current?.focus()}
        >
          <div className="overflow-scroll h-full py-4">
            <Input.TextArea
              ref={inputTextarea}
              value={text}
              onChange={e => setText(e.target.value)}
              bordered={false}
              autoSize={{
                minRows: 6
              }}
              onKeyDown={e => {
                if (e.key === 'Enter')
                  if (e.shiftKey) setText(value => `${value}\n`)
                  else {
                    e.preventDefault()
                    sendChat()
                  }
              }}
            ></Input.TextArea>
          </div>
          <Button
            className="absolute bottom-4 right-4"
            type="primary"
            onClick={sendChat}
          >
            发送
          </Button>
        </div>
        <Drawer
          closeIcon={null}
          open={openModal}
          onClose={() => setOpenModal(false)}
        >
          <GroupMember group_id={group.id}></GroupMember>
        </Drawer>
      </div>
    </>
  )
}

export default Chat
