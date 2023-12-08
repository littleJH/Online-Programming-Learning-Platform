import { Button, Form, Input, Menu, Modal, Space, theme } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useMemo, useState } from 'react'
import {
  applyEnterGroupApi,
  getGroupApi,
  getGroupListApi,
  getMemberGroupListApi,
  searchGroupByTextApi,
} from '@/api/group'
import { useRecoilValue } from 'recoil'
import { notificationApi, userInfoState } from '@/store/appStore'
import { IGroup, User } from '@/type'
import { useSearchParams } from 'react-router-dom'
import Chat from '../../../../components/Card/IMCard'
import { enterPublishChatWs } from '@/api/chat'
import TextArea from 'antd/es/input/TextArea'
import CreateGroupForm from '@/components/Group/CreateGroupForm'
import { applyAddFriendpApi, getFriendListApi } from '@/api/friend'

let ws: WebSocket
const Friend: React.FC = () => {
  const { Search } = Input
  const [querys, setQuerys] = useSearchParams()
  const [firend_id, setFirend_id] = useState(querys.get('firend_id'))
  const info = useRecoilValue(userInfoState)
  const [total, setTotal] = useState(0)
  const [mode, setMode] = useState<'default' | 'search'>('default')
  const [firendList, setFirendList] = useState<User[]>([])
  const [openEnterModal, setOpenEnterModal] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [applyContent, setApplyContent] = useState(`我是${info?.name}`)
  const notification = useRecoilValue(notificationApi)
  const [form] = Form.useForm()
  const { token } = theme.useToken()

  const currentFriend = useMemo(
    () => firendList.find(item => item.id === firend_id),
    [firend_id, firendList],
  )

  const menuItems = useMemo(
    () =>
      firendList.map(item => {
        return {
          key: item.id,
          label: <div>{item.name}</div>,
        }
      }),
    [firendList],
  )

  useEffect(() => {
    openChatWs()
    initFriendList()
  }, [])

  const initFriendList = async () => {
    if (!info) return
    setMode('default')
    // getMemberGroupListApi(info?.id).then(async (res) => {
    //   setTotal(res.data.data.total)
    //   const groups = res.data.data.userList
    //   const list: User[] = []
    //   for (let group of groups) {
    //     const res = await getFriendListApi(group.group_id)
    //     if (res.data.code === 200) list.push({ ...res.data.data.group, entered: true })
    //   }
    //   console.log('groupList ==> ', list)
    //   setFirendList(list.reverse())
    // })
    const { data } = await getFriendListApi()
  }

  const openChatWs = () => {
    ws = enterPublishChatWs()
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

  const handleMenuSelected = (info: any) => {
    setFirend_id(info.key)
    setQuerys([['group_id', info.key]])
  }

  const handleGroupSearth = async (value: string) => {
    setMode('search')
    const { data } = await searchGroupByTextApi(value)

    setFirendList(data.data.groups)
    console.log(data)
  }

  const addFriend = async () => {
    if (applyContent === '') {
      notification?.warning({
        message: '请输入申请信息',
      })
      return
    }
    const form = new FormData()
    form.append('content', applyContent)
    currentFriend?.id &&
      applyAddFriendpApi(currentFriend?.id, form).then(res => {})
  }

  const handleGroupCreated = (friend: User) => {
    notification &&
      notification.success({
        message: '用户组创建成功',
      })
    setMode('default')
    setFirend_id(friend.id)
    setFirendList(value => [friend, ...value])
    setQuerys({
      friend_id: friend.id,
    })
    setOpenCreateModal(false)
  }

  return (
    <div
      className="flex"
      style={{
        width: '70vw',
        height: '70vh',
      }}
    >
      {/* left */}
      <div className="w-64 h-full flex flex-col">
        <Space className="sticky top-0 px-4">
          <Search
            size="small"
            enterButton
            allowClear
            onSearch={handleGroupSearth}
            onChange={e => {
              if (e.target.value === '') initFriendList()
            }}
          ></Search>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreateModal(true)}
          ></Button>
        </Space>
        <div className="overflow-auto h-96 grow">
          <Menu
            className="p-4"
            items={menuItems}
            selectedKeys={[firend_id || '']}
            onSelect={handleMenuSelected}
          ></Menu>
        </div>
      </div>
      {/* <Divider type="vertical" className="h-full"></Divider> */}
      <div
        className="grow w-96 h-full rounded"
        style={{
          borderColor: token.colorBorder,
          borderWidth: '1px',
          borderRadius: token.borderRadius,
          borderStyle: 'solid',
        }}
      >
        {currentFriend && (
          <>
            {mode === 'default' && <Chat friendInfo={currentFriend}></Chat>}
            {mode === 'search' && (
              <>
                {currentFriend && <Chat friendInfo={currentFriend}></Chat>}
                {/* {!currentGroup.entered && (
                  <div className='p-8'>
                    <GroupInfo group={currentGroup}></GroupInfo>
                    <div className='w-full text-end'>
                      <Button
                        type='primary'
                        onClick={() => (currentGroup.auto ? enterGroup() : setOpenEnterModal(true))}
                      >
                        加入小组
                      </Button>
                    </div>
                  </div>
                )} */}
              </>
            )}
          </>
        )}
      </div>
      <Modal
        open={openEnterModal}
        title="申请信息"
        onCancel={() => setOpenEnterModal(false)}
        footer={[
          <Button type="primary" onClick={addFriend}>
            添加
          </Button>,
        ]}
      >
        <TextArea
          value={applyContent}
          onChange={e => setApplyContent(e.target.value)}
        ></TextArea>
      </Modal>
      <Modal
        open={openCreateModal}
        title="创建用户组"
        onCancel={() => setOpenCreateModal(false)}
        footer={[]}
      >
        <CreateGroupForm
          form={form}
          doneCallback={handleGroupCreated}
        ></CreateGroupForm>
      </Modal>
    </div>
  )
}

export default Friend
