import { getGroupLettersApi } from '@/api/Letter'
import { IChat, IGroup } from '@/type'
import { Avatar, Button, Divider, Drawer, Input, List, Modal, Spin } from 'antd'
import { TextAreaRef } from 'antd/es/input/TextArea'
import React, {
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { EllipsisOutlined } from '@ant-design/icons'
import GroupMember from '@/components/group/GroupMember'
import {
  craeteChatApi,
  enterGroupPublishChatWS,
  enterPublishChatWs,
  getGroupChatsApi
} from '@/api/chat'
import { getUserInfoApi } from '@/api/user'
import { iconBaseUrl } from '@/api/baseConfig'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@/store/appStore'
import ChatMessageCard from '@/components/card/ChatMessageCard'

interface IProps {
  group: IGroup
}

let ws: WebSocket
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
    openChatWs(group.id)
    initChatList(group.id)
  }, [group])

  const initChatList = (id: string) => {
    setLoading(true)
    getGroupChatsApi(id).then(async res => {
      console.log(res.data.data)
      const chats = res.data.data.chats
      const list: IChat[] = []
      if (!chats) {
        setChatList([])
        setLoading(false)
        return
      }
      for (let item of chats) {
        const user = await getUserInfoApi(item.author_id)
        list.push({
          ...item,
          user: user.data.data.user
        })
      }
      setChatList(list.reverse())
      setLoading(false)
    })
  }

  const openChatWs = (id: string) => {
    ws = enterGroupPublishChatWS(id)
    ws.onopen = handleChatWsOpen
    ws.onmessage = handleChatWsMessage
    ws.onclose = handleChatWsClose
  }

  const handleChatWsOpen = (e: Event) => {
    console.log('chatWsOpen', e)
  }

  const handleChatWsMessage = (e: Event) => {
    console.log('chatWsMessage', e)
  }

  const handleChatWsClose = (e: Event) => {
    console.log('chatWsClose', e)
  }

  const renderMessageCard = (msgItem: IChat) => {
    const bool = msgItem.author_id === info?.id
    return (
      <>
        <div className={`w-full flex justify-${bool ? 'end' : 'start'}`}>
          {!bool && (
            <Avatar
              src={`${iconBaseUrl}/${msgItem.user.icon}`}
              style={{
                flex: 'none'
              }}
            ></Avatar>
          )}
          <div style={{ maxWidth: '75%' }}>
            <ChatMessageCard mode={bool ? 'right' : 'left'}>
              {msgItem.content}
            </ChatMessageCard>
          </div>
          {bool && (
            <Avatar
              src={`${iconBaseUrl}/${msgItem.user.icon}`}
              style={{
                flex: 'none'
              }}
            ></Avatar>
          )}
        </div>
      </>
    )
  }

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
          <div className="h-full grow px-8 overflow-scroll">
            <div ref={chatBox}>
              <List
                loading={loading}
                split={false}
                dataSource={chatList}
                renderItem={(item, index) => (
                  <>
                    {item.content && (
                      <List.Item
                        onLoad={() => {
                          if (index === chatList.length - 1) {
                            chatBox.current?.scrollIntoView(false)
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
          <GroupMember group_id={group.id} showAdd={true}></GroupMember>
        </Drawer>
      </div>
    </>
  )
}

export default Chat
