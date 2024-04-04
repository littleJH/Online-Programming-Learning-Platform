import { Button, Drawer, Form, Input, Menu, Modal, Space, theme } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  applyEnterGroupApi,
  getGroupApi,
  getIsEnterGroupApi,
  getMemberGroupListApi,
  searchGroupByTextApi,
} from '@/api/group'
import { useRecoilValue } from 'recoil'
import { isMobileAtom, notificationApi, userInfoState } from '@/store/appStore'
import { IGroup } from '@/type'
import { useSearchParams } from 'react-router-dom'
import Chat from '../../../../components/Card/IMCard'
import { enterPublishChatWs } from '@/api/chat'
import GroupInfo from '@/components/Group/GroupInfo'
import TextArea from 'antd/es/input/TextArea'
import CreateGroupForm from '@/components/Group/CreateGroupForm'
import style from '../../style.module.scss'
import utils from '@/tool/myUtils/utils'

let ws: WebSocket
const GroupRoot: React.FC = () => {
  const isMobile = useRecoilValue(isMobileAtom)
  const { Search } = Input
  const [querys, setQuerys] = useSearchParams()
  const [group_id, setGroup_id] = useState(querys.get('group_id'))
  const info = useRecoilValue(userInfoState)
  const [total, setTotal] = useState(0)
  const [searchText, setSearchText] = useState('')
  // const [mode, setMode] = useState<'default' | 'search'>('default')
  const [groupList, setGroupList] = useState<IGroup[]>([])
  const [openEnterModal, setOpenEnterModal] = useState(false)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [openGroupDrawer, setOpenGroupDrawer] = useState(!isMobile)
  const [openGroupinfoDrawer, setOpenGroupinfoDrawer] = useState(false)
  const [applyContent, setApplyContent] = useState(`我是${info?.name}`)
  const notification = useRecoilValue(notificationApi)
  const [form] = Form.useForm()
  const { token } = theme.useToken()
  const groupRef = useRef<HTMLDivElement>(null)

  const currentGroup = useMemo(() => groupList.find((item) => item.id === group_id), [group_id, groupList])
  const mode = useMemo<'default' | 'search'>(() => (searchText ? 'search' : 'default'), [searchText])

  const menuItems = useMemo(
    () =>
      groupList.map((group) => {
        return {
          key: group.id,
          label: <div onClick={() => handleMenuSelected({ key: group.id })}>{group.title}</div>,
        }
      }),
    [groupList]
  )

  useEffect(() => {
    openChatWs()
    initGroupList()
  }, [])

  useEffect(() => {
    !isMobile && !group_id && groupList.length > 0 && setGroup_id(groupList[0]?.id)
  }, [groupList])

  useEffect(() => {
    group_id && setQuerys([['group_id', group_id]])
  }, [group_id])

  const initGroupList = () => {
    if (!info) return
    setSearchText('')
    // setMode('default')
    getMemberGroupListApi(info?.id).then(async (res) => {
      setTotal(res.data.data.total)
      const groups = res.data.data.userList
      const list: IGroup[] = []
      for (let group of groups) {
        const res = await getGroupApi(group.group_id)
        if (res.data.code === 200) list.push({ ...res.data.data.group })
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
    if (isMobile && mode === 'search') {
      setOpenGroupDrawer(false)
      setOpenGroupinfoDrawer(true)
    }
    setGroup_id(info.key)
  }

  const handleGroupSearth = async (value: string) => {
    if (!value) return
    // setMode('search')
    try {
      const groups = (await searchGroupByTextApi(value)).data.data.groups
      for (let group of groups) {
        group.entered = (await getIsEnterGroupApi(group.id)).data.data.member
      }
      setGroupList(groups)
      console.log('handle group search ==> ', groups)
    } catch {}
  }

  const enterGroup = async () => {
    if (!currentGroup?.auto && applyContent === '') {
      notification?.warning({
        message: '请输入申请信息',
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
        message: '用户组创建成功',
      })
    // setMode('default')
    setSearchText('')
    setGroup_id(group.id)
    setGroupList((value) => [group, ...value])
    setOpenCreateModal(false)
  }

  const renderGroupList = () => {
    return (
      <div className={style.groupList}>
        <div className={style.space}>
          <Search
            size={isMobile ? 'middle' : 'small'}
            value={searchText}
            enterButton
            allowClear
            onSearch={handleGroupSearth}
            onChange={(e) => {
              setSearchText(e.target.value)
              if (!e.target.value) initGroupList()
              else handleGroupSearth(e.target.value)
            }}
          ></Search>
          <Button size={isMobile ? 'middle' : 'small'} className="ml-4" onClick={() => setOpenCreateModal(true)}>
            <PlusOutlined />
          </Button>
        </div>
        <div className="overflow-auto h-96 grow">
          <Menu className="p-4" items={menuItems} selectedKeys={[group_id || '']} onSelect={handleMenuSelected}></Menu>
        </div>
      </div>
    )
  }

  const renderGroupInfo = () => {
    return (
      <>
        {currentGroup && (
          <div className="p-8">
            <GroupInfo group={currentGroup}></GroupInfo>
            <div className="w-full text-end">
              <Button
                type="primary"
                onClick={() => {
                  setOpenGroupinfoDrawer(false)
                  setOpenGroupDrawer(true)
                }}
              >
                返回
              </Button>
              {currentGroup.entered ? (
                <Button
                  type="primary"
                  className="ml-4"
                  onClick={() => {
                    setOpenGroupDrawer(false)
                    setOpenGroupinfoDrawer(false)
                    // setMode('default')
                    setSearchText('')
                  }}
                >
                  进入聊天
                </Button>
              ) : (
                <Button
                  type="primary"
                  className="ml-4"
                  onClick={() => (currentGroup.auto ? enterGroup() : setOpenEnterModal(true))}
                >
                  加入小组
                </Button>
              )}
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div ref={groupRef} className={style.group}>
      {/* left */}
      {isMobile ? (
        <>
          <Drawer
            // getContainer={false}
            placement="bottom"
            open={openGroupDrawer}
            closeIcon={null}
            onClose={() => {
              setSearchText('')
              setOpenGroupDrawer(false)
            }}
          >
            {renderGroupList()}
          </Drawer>
          <Drawer
            open={openGroupinfoDrawer}
            closeIcon={null}
            onClose={() => setOpenGroupinfoDrawer(false)}
            placement="bottom"
          >
            {renderGroupInfo()}
          </Drawer>
        </>
      ) : (
        renderGroupList()
      )}
      {/* <Divider type="vertical" className="h-full"></Divider> */}
      {/* right */}
      <div
        className={style.right}
        style={{
          borderColor: token.colorBorder,
          borderRadius: token.borderRadius,
        }}
      >
        {currentGroup && (
          <>
            {mode === 'default' && <Chat group={currentGroup} setOpenGroupDrawer={setOpenGroupDrawer}></Chat>}
            {mode === 'search' && !isMobile && (
              <>
                {currentGroup.entered && <Chat group={currentGroup} setOpenGroupDrawer={setOpenGroupDrawer}></Chat>}
                {!currentGroup.entered && renderGroupInfo()}
              </>
            )}
          </>
        )}
        {!currentGroup && isMobile && <div className="p-4 w-full h-full">{renderGroupList()}</div>}
      </div>
      <Modal
        open={openEnterModal}
        title="申请信息"
        onCancel={() => setOpenEnterModal(false)}
        footer={[
          <Button type="primary" onClick={enterGroup}>
            加入
          </Button>,
        ]}
      >
        <TextArea value={applyContent} onChange={(e) => setApplyContent(e.target.value)}></TextArea>
      </Modal>
      <Modal open={openCreateModal} title="创建用户组" onCancel={() => setOpenCreateModal(false)} footer={[]}>
        <CreateGroupForm form={form} doneCallback={handleGroupCreated}></CreateGroupForm>
      </Modal>
    </div>
  )
}

export default GroupRoot
