import { iconBaseUrl } from '@/config/apiConfig'
import { getGroupMembersApi } from '@/api/group'
import { getUserInfoApi } from '@/api/user'
import { User } from '@/type'
import { Avatar, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import MyAvatar from '../Avatar/MyAvatar'
import style from './style.module.scss'

const GroupMember: React.FC<{
  group_id: string
  showAdd: boolean
}> = (props) => {
  const { group_id, showAdd } = props
  const [openModal, setOpenModal] = useState(false)
  const [GroupMember, setGroupMember] = useState<User[]>([])

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {
    try {
      const res = await getGroupMembersApi(group_id)
      const userList = res.data.data.userList
      for (let item of userList) {
        const res = await getUserInfoApi(item.user_id)
        setGroupMember((value) => [...value, res.data.data?.user])
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleAvatarClick = () => {}
  return (
    <>
      <div className="w-full">
        <Avatar.Group className={style.groupMember}>
          {GroupMember.map((member, index) => (
            <MyAvatar key={member?.id || index} user={member} className="hover:mx-2"></MyAvatar>
          ))}
          {showAdd && <Avatar icon={<PlusOutlined />} className="" onClick={() => setOpenModal(true)}></Avatar>}
        </Avatar.Group>
      </div>
      <Modal open={openModal} onCancel={() => setOpenModal(false)}></Modal>
    </>
  )
}

export default GroupMember
