import { craeteLetterApi, enterPublishLetterWS, getLettersApi } from '@/api/Letter'
import { IChat, IGroup, User } from '@/type'
import { Avatar, Button, Divider, Drawer, Input, List, Card, Popover, theme } from 'antd'
import { TextAreaRef } from 'antd/es/input/TextArea'
import React, { KeyboardEventHandler, useEffect, useMemo, useRef, useState } from 'react'
import { EllipsisOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { craeteChatApi, enterGroupPublishChatWS, enterPublishChatWs, getGroupChatsApi } from '@/api/chat'
import { getUserInfoApi } from '@/api/user'
import { iconBaseUrl } from '@/config/apiConfig'
import { useRecoilValue } from 'recoil'
import { isMobileAtom, userInfoState } from '@/store/appStore'
import GroupInfo from '@/components/Group/GroupInfo'
import UserInfo from '@/components/User/UserInfo'
import myHooks from '@/tool/myHooks/myHooks'
import utils from '@/tool/myUtils/utils'
import style from './style.module.scss'

interface IProps {
  group?: IGroup
  friend?: User
  setOpenGroupDrawer?: (open: boolean) => void
}

const Chat: React.FC<IProps> = (props) => {
  const { group, friend, setOpenGroupDrawer } = props
  const isMobile = useRecoilValue(isMobileAtom)
  const info = useRecoilValue(userInfoState)
  const inputTextarea = useRef<TextAreaRef>(null)
  const [openModal, setOpenModal] = useState(false)
  const [text, setText] = useState('')
  const [chatList, setChatList] = useState<IChat[]>([])
  const [loading, setLoading] = useState(true)
  const chatBox = useRef<HTMLDivElement>(null)
  const { token } = theme.useToken()

  myHooks.useWsConnect({ wsUrl: getWs(), onMessage: onWsMessage })

  useEffect(() => {
    initChatList()
  }, [group])

  const initChatList = () => {
    setLoading(true)
    const resolveFn = async (res: any) => {
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
          chat: { ...item },
          user: user.data.data.user,
        })
      }
      setChatList(list.reverse())
      setLoading(false)
    }
    group && getGroupChatsApi(group.id).then(resolveFn)
    friend && getLettersApi(friend.id).then(resolveFn)
  }

  function getWs(): any {
    if (group) return enterGroupPublishChatWS(group.id)
    if (friend) return enterPublishLetterWS(friend.id)
  }

  function onWsMessage(message: any) {
    setChatList((value) => [...value, message])
  }

  const sendChat = () => {
    if (!text.length) return
    const resolveFn = (res: any) => {
      if (res.data.code === 200) {
        setText('')
      }
    }
    group &&
      craeteChatApi(
        group.id,
        JSON.stringify({
          content: text,
        })
      ).then(resolveFn)
    friend && craeteLetterApi(friend.id, JSON.stringify({ content: text })).then(resolveFn)
  }

  // const handleChatScroll = (e: React.UIEvent) => {
  //   e.preventDefault()
  //   console.log('handleChatScroll ==> ', e)
  // }

  const renderMessageCard = (msgItem: IChat) => {
    const bool = msgItem.chat.author_id === info?.id
    return (
      <div id={msgItem.chat.group_id} className={`w-full flex justify-${bool ? 'end' : 'start'}`}>
        {!bool && (
          <Avatar
            src={`${iconBaseUrl}/${msgItem.user.icon}`}
            style={{
              flex: 'none',
            }}
          ></Avatar>
        )}
        <div style={{ maxWidth: '75%' }}>
          {/* <ChatMessageCard mode={bool ? 'right' : 'left'}>{msgItem.content}</ChatMessageCard> */}
          <Card
            size="small"
            style={{
              margin: '0 1rem',
              backgroundColor: `${bool ? token.colorPrimaryBg : ''}`,
            }}
          >
            {msgItem.chat.content}
          </Card>
        </div>

        {bool && (
          <Avatar
            src={`${iconBaseUrl}/${msgItem.user.icon}`}
            style={{
              flex: 'none',
            }}
          ></Avatar>
        )}
      </div>
    )
  }

  return (
    <div className={style.IMCard}>
      <div className={style.header}>
        <div
          className="sticky top-0 z-10 flex justify-between items-center"
          style={{
            borderBottom: `1px solid ${token.colorBorder}`,
          }}
        >
          <span className="mx-4 my-2 text-lg">
            {isMobile && (
              <MenuUnfoldOutlined
                onClick={() => setOpenGroupDrawer && setOpenGroupDrawer(true)}
                style={{
                  marginRight: '1rem',
                }}
              />
            )}
            {group && group.title}
            {friend && friend.name}
          </span>
          <span
            className="mx-2"
            onClick={() => {
              setOpenModal(true)
            }}
          >
            <EllipsisOutlined
              style={{
                fontSize: '2rem',
                cursor: 'pointer',
              }}
            />
          </span>
        </div>
        <div className="h-full grow px-8 overflow-auto">
          <div ref={chatBox}>
            <List
              loading={loading}
              split={false}
              dataSource={chatList}
              renderItem={(item, index) => (
                <>
                  {item.chat.content && (
                    <List.Item
                      onLoad={() => {
                        if (index === chatList.length - 1) {
                          chatBox.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'end',
                          })
                        }
                      }}
                      key={`${item.chat.author_id}${item.chat.created_at}`}
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
        className={style.footer}
        style={{
          borderColor: token.colorBorder,
        }}
        onClick={() => inputTextarea.current?.focus()}
      >
        <div className={style.inputBox}>
          <Input.TextArea
            ref={inputTextarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="borderless"
            autoSize={{
              minRows: 1,
              maxRows: 3,
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter')
                if (e.shiftKey) setText((value) => `${value}\n`)
                else {
                  e.preventDefault()
                  sendChat()
                }
            }}
          ></Input.TextArea>
        </div>
        <Button size="small" className="mr-4" type="primary" onClick={sendChat}>
          发送
        </Button>
      </div>
      <Drawer
        placement={isMobile ? 'bottom' : 'right'}
        closeIcon={null}
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        {group && <GroupInfo group={group}></GroupInfo>}
        {friend && <UserInfo user={friend}></UserInfo>}
      </Drawer>
    </div>
  )
}

export default Chat
