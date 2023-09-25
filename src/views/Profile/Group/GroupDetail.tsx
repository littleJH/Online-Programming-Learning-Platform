import { getGroupApi } from '@/api/group'
import GroupMember from '@/components/Group/GroupMember'
import { IGroup } from '@/vite-env'
import React, { useEffect, useState } from 'react'

const GroupDetail: React.FC<{
  group: IGroup
}> = props => {
  const { group } = props
  const [groupInfo, setGroupInfo] = useState()

  useEffect(() => {
    initGroup()
  }, [])

  const initGroup = () => {
    getGroupApi(group.id).then(res => {
      console.log('groupInfo===', res.data.data)
    })
  }
  return (
    <div className="w-full">
      {group && <GroupMember group_id={group.id} showAdd={false}></GroupMember>}
    </div>
  )
}

export default GroupDetail
