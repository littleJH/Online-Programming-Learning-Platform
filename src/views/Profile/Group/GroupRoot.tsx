import { Button, Divider, Input, List, Menu, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import React, { useEffect, useMemo, useState } from 'react'
import {
  getGroupApi,
  getMemberGroupListApi,
  searchGroupByTextApi
} from '@/api/group'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@/recoil/store'
import { IGroup } from '@/vite-env'
import { Outlet, useSearchParams } from 'react-router-dom'
import Chat from './Chat'
import { enterPublishChatWs } from '@/api/chat'

let ws: WebSocket
const GroupRoot: React.FC = () => {
  const { Search } = Input
  const [querys, setQuerys] = useSearchParams()
  const [group_id, setGroup_id] = useState(querys.get('group_id'))
  const info = useRecoilValue(userInfoState)
  const [total, setTotal] = useState(0)
  const [mode, setMode] = useState<'default' | 'search'>('default')
  const [groupList, setGroupList] = useState<IGroup[]>([])

  const currentGroup = useMemo(() => {
    const group = groupList.find(item => item.id === group_id)
    return group
  }, [group_id, groupList])

  const menuItems = useMemo(() => {
    return groupList.map(group => {
      return {
        key: group.id,
        label: <div>{group.title}</div>
      }
    })
  }, [groupList])

  useEffect(() => {
    openChatWs()
    initGroupList()
  }, [])

  const initGroupList = () => {
    if (!info) return
    setMode('default')
    getMemberGroupListApi(info?.id).then(async res => {
      setTotal(res.data.data.total)
      const groups = res.data.data.userList
      const list: IGroup[] = []
      for (let group of groups) {
        const res = await getGroupApi(group.group_id)
        list.push(res.data.data.group)
      }
      setGroupList(list)
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

  return (
    <div className="w-full h-full flex">
      <div className="w-64 h-full">
        <Space className="sticky top-0 px-4">
          <Search
            size="small"
            enterButton
            allowClear
            onSearch={handleGroupSearth}
            onChange={e => {
              if (e.target.value === '') initGroupList()
            }}
          ></Search>
          <Button size="small" icon={<PlusOutlined />}></Button>
        </Space>
        <Divider></Divider>
        <Menu
          className="px-4"
          items={menuItems}
          selectedKeys={[group_id ? group_id : '']}
          onSelect={handleMenuSelected}
        ></Menu>
      </div>
      {/* <Divider type="vertical" className="h-full"></Divider> */}
      <div className="grow">
        {mode === 'default' && (
          <>{currentGroup && <Chat group={currentGroup}></Chat>}</>
        )}
        {mode === 'search' && }
      </div>
    </div>
  )
}

export default GroupRoot
