import React from 'react'
import { Descriptions } from 'antd'
import { IGroup, User } from '@/type'
import { DescriptionsItemProps } from 'antd/es/descriptions/Item'
import { getUserInfoApi } from '@/api/user'
import GroupMember from './GroupMember'

const GroupInfo: React.FC<{
  group: IGroup
  mode?: 'card' | 'info'
}> = (props) => {
  const { group, mode = 'info' } = props
  const [userInfo, setUserInfo] = React.useState<User>()

  React.useEffect(() => {
    getUserInfoApi(group.leader_id).then((res) => {
      setUserInfo(res.data.data.user)
    })
  }, [])

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
      {mode === 'info' && <Descriptions column={1} title={group.title} items={descItems}></Descriptions>}
      {mode === 'card' && (
        <div className="rounded shadow p-2 flex">
          {/* <div className="flex items-center mx-2">
            <Avatar size={'large'} src={`${props.user?.icon}`}></Avatar>
          </div> */}
          <div className="" style={{ fontWeight: 400 }}>
            <div>{props.group.title}</div>
            <div>{props.group.content}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default GroupInfo
