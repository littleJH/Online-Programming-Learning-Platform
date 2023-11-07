import { Button, Form, Input, Menu, Modal, Space, theme } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useMemo, useState } from 'react'
import { applyEnterGroupApi, getGroupApi, getMemberGroupListApi, searchGroupByTextApi } from '@/api/group'
import { useRecoilValue } from 'recoil'
import { notificationApi, userInfoState } from '@/store/appStore'
import { IGroup } from '@/type'
import { useSearchParams } from 'react-router-dom'
import Chat from '../../../../components/Card/IMCard'
import { enterPublishChatWs } from '@/api/chat'
import GroupInfo from '@/components/Group/GroupInfo'
import TextArea from 'antd/es/input/TextArea'
import CreateGroupForm from '@/components/Group/CreateGroupForm'

let ws: WebSocket
const GroupRoot: React.FC = () => {
  const { Search } = Input
  const [querys, setQuerys] = useSearchParams()
  const [group_id, setGroup_id] = useState(querys.get('group_id'))
  const info = useRecoilValue(userInfoState)
  const [total, setTotal] = useState(0)
  const [mode, setMode] = useState<'default' | 'search'>('default')
  const [groupList, setGroupList] = useState<IGroup[]>([])
  const [openEnterModal, setOpenEnterModal] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [applyContent, setApplyContent] = useState(`我是${info?.name}`)
  const notification = useRecoilValue(notificationApi)
  const [form] = Form.useForm()
  const { token } = theme.useToken()

  const currentGroup = useMemo(() => groupList.find((item) => item.id === group_id), [group_id, groupList])

  const menuItems = useMemo(
    () =>
      groupList.map((group) => {
        return {
          key: group.id,
          label: <div>{group.title}</div>
        }
      }),
    [groupList]
  )

  useEffect(() => {
    openChatWs()
    initGroupList()
  }, [])

  const initGroupList = () => {
    if (!info) return
    setMode('default')
    getMemberGroupListApi(info?.id).then(async (res) => {
      setTotal(res.data.data.total)
      const groups = res.data.data.userList
      const list: IGroup[] = []
      for (let group of groups) {
        const res = await getGroupApi(group.group_id)
        if (res.data.code === 200) list.push({ ...res.data.data.group, entered: true })
      }
      console.log('groupList ==> ', list)
      setGroupList(list.reverse())
    })
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
    setGroup_id(info.key)
    setQuerys([['group_id', info.key]])
  }

  const handleGroupSearth = async (value: string) => {
    setMode('search')
    const { data } = await searchGroupByTextApi(value)

    setGroupList(data.data.groups)
    console.log(data)
  }

  const enterGroup = async () => {
    if (!currentGroup?.auto && applyContent === '') {
      notification?.warning({
        message: '请输入申请信息'
      })
      return
    }
    const form = new FormData()
    form.append('content', applyContent)
    currentGroup?.id && applyEnterGroupApi(currentGroup?.id, form).then((res) => {})
  }

  const handleGroupCreated = (group: IGroup) => {
    notification &&
      notification.success({
        message: '用户组创建成功'
      })
    setMode('default')
    setGroup_id(group.id)
    setGroupList((value) => [group, ...value])
    setQuerys({
      group_id: group.id
    })
    setOpenCreateModal(false)
  }

  return (
    <div
      className='flex'
      style={{
        width: '70vw',
        height: '70vh'
      }}
    >
      {/* left */}
      <div className='w-64 h-full flex flex-col'>
        <Space className='sticky top-0 px-4'>
          <Search
            size='small'
            enterButton
            allowClear
            onSearch={handleGroupSearth}
            onChange={(e) => {
              if (e.target.value === '') initGroupList()
            }}
          ></Search>
          <Button
            size='small'
            icon={<PlusOutlined />}
            onClick={() => setOpenCreateModal(true)}
          ></Button>
        </Space>
        <div className='overflow-auto h-96 grow'>
          <Menu
            className='p-4'
            items={menuItems}
            selectedKeys={[group_id || '']}
            onSelect={handleMenuSelected}
          ></Menu>
        </div>
      </div>
      {/* <Divider type="vertical" className="h-full"></Divider> */}
      <div
        className='grow w-96 h-full rounded'
        style={{ borderColor: token.colorBorder, borderWidth: '1px', borderRadius: token.borderRadius, borderStyle: 'solid' }}
      >
        {currentGroup && (
          <>
            {mode === 'default' && <Chat group={currentGroup}></Chat>}
            {mode === 'search' && (
              <>
                {currentGroup.entered && <Chat group={currentGroup}></Chat>}
                {!currentGroup.entered && (
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
                )}
              </>
            )}
          </>
        )}
      </div>
      <Modal
        open={openEnterModal}
        title='申请信息'
        onCancel={() => setOpenEnterModal(false)}
        footer={[
          <Button
            type='primary'
            onClick={enterGroup}
          >
            加入
          </Button>
        ]}
      >
        <TextArea
          value={applyContent}
          onChange={(e) => setApplyContent(e.target.value)}
        ></TextArea>
      </Modal>
      <Modal
        open={openCreateModal}
        title='创建用户组'
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

export default GroupRoot
