import React from 'react'
import { Descriptions } from 'antd'
import { IGroup, User } from '@/type'
import { DescriptionsItemProps } from 'antd/es/descriptions/Item'
import { getUserInfoApi } from '@/api/user'
import GroupMember from './GroupMember'

const GroupInfo: React.FC<{
  group: IGroup
}> = (props) => {
  const { group } = props
  const [userInfo, setUserInfo] = React.useState<User>()

  React.useEffect(() => {
    getUserInfoApi(group.leader_id).then((res) => {
      setUserInfo(res.data.data.user)
    })
  }, [])

  const descItems: DescriptionsItemProps[] = React.useMemo(() => {
    return [
      {
        key: '2',
        label: '描述',
        children: group.content
      },
      {
        key: '3',
        label: '创建者',
        children: userInfo?.name
      },
      {
        key: '4',
        label: '小组成员',
        children: (
          <GroupMember
            group_id={group.id}
            showAdd={false}
          ></GroupMember>
        )
      }
    ]
  }, [group, userInfo])

  return (
    <Descriptions
      title={group.title}
      items={descItems}
    ></Descriptions>
  )
}

export default GroupInfo
