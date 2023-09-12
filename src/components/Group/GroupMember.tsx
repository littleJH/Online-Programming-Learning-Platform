import { iconBaseUrl } from '@/api/baseConfig'
import { getGroupMembersApi } from '@/api/group'
import { getUserInfoApi } from '@/api/user'
import { User } from '@/vite-env'
import { Avatar, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'

const GroupMember: React.FC<{
  group_id: string
  showAdd: boolean
}> = props => {
  const { group_id, showAdd } = props
  const [openModal, setOpenModal] = useState(false)
  const [GroupMember, setGroupMember] = useState<User[]>([])

  useEffect(() => {
    getGroupMembersApi(group_id).then(async res => {
      const userList = res.data.data.userList
      for (let item of userList) {
        const res = await getUserInfoApi(item.user_id)
        setGroupMember(value => [...value, res.data.data.user])
      }
    })
  }, [])
  return (
    <>
      <div>
        <Avatar.Group className="select-none">
          {GroupMember.map(member => (
            <Avatar
              src={`${iconBaseUrl}/${member.icon}`}
              className="hover:mx-2"
            ></Avatar>
          ))}
          {showAdd && (
            <Avatar
              icon={<PlusOutlined />}
              className=""
              onClick={() => setOpenModal(true)}
            ></Avatar>
          )}
        </Avatar.Group>
      </div>
      <Modal open={openModal} onCancel={() => setOpenModal(false)}></Modal>
    </>
  )
}

export default GroupMember
