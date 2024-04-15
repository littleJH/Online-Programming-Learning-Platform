import React, { useState } from 'react'
import { Button, Descriptions, Input, InputNumber, Space } from 'antd'
import { IGroup, User } from '@/type'
import { DescriptionsItemProps } from 'antd/es/descriptions/Item'
import { getUserInfoApi } from '@/api/user'
import GroupMember from './GroupMember'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@/store/appStore'
import { createStandardUserApi, getStandardUserListApi } from '@/api/group'
import { InputStatus } from 'antd/es/_util/statusUtils'

const GroupInfo: React.FC<{
  group: IGroup
  mode?: 'card' | 'info'
}> = (props) => {
  const { group, mode = 'info' } = props
  const currentUser = useRecoilValue(userInfoState)
  const [number, setNumber] = useState<number>()
  const [inputStatus, setInputStatus] = useState<InputStatus>('')
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = React.useState<User>()

  React.useEffect(() => {
    getUserInfoApi(group.leader_id).then((res) => {
      setUserInfo(res.data.data.user)
    })
  }, [])

  const handleStandardCreate = async () => {
    if (!number || number <= 0) {
      setInputStatus('error')
      return
    }
    try {
      setLoading(true)
      const res = await createStandardUserApi(group.id, number)
      if (res.data.code === 200) {
        const users = (await getStandardUserListApi(group.id)).data.data.userStandards
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const descItems: DescriptionsItemProps[] = React.useMemo(() => {
    return [
      {
        key: 'id',
        label: 'ID',
        children: group.id,
      },
      {
        key: 'content',
        label: '描述',
        children: group.content,
      },
      {
        key: 'leader',
        label: '创建者',
        children: userInfo?.name,
      },
      {
        key: 'auto',
        label: '自动通过申请',
        children: group.auto ? '是' : '否',
      },
      {
        key: 'member',
        label: '小组成员',
        children: <GroupMember group_id={group.id} showAdd={false}></GroupMember>,
      },
    ]
  }, [group, userInfo])

  return (
    <>
      {mode === 'info' && (
        <Descriptions
          column={1}
          title={group.title}
          items={descItems}
          layout="vertical"
          contentStyle={{
            width: '100%',
          }}
        ></Descriptions>
      )}
      {mode === 'card' && (
        <div className="rounded shadow p-2 flex w-full">
          {/* <div className="flex items-center mx-2">
            <Avatar size={'large'} src={`${props.user?.icon}`}></Avatar>
          </div> */}
          <div className="w-full" style={{ fontWeight: 400 }}>
            <div>{props.group.title}</div>
            <div className="w-full">{props.group.content}</div>
          </div>
        </div>
      )}
      {currentUser?.level && currentUser?.level >= 4 && currentUser?.email === userInfo?.email && (
        <Space>
          <InputNumber
            addonAfter="标准用户"
            value={number}
            onChange={(value) => {
              setNumber(value || 1)
              setInputStatus('')
            }}
            min={1}
            status={inputStatus}
          ></InputNumber>
          <Button type="primary" onClick={handleStandardCreate} loading={loading}>
            点击生成
          </Button>
        </Space>
      )}
    </>
  )
}

export default GroupInfo
