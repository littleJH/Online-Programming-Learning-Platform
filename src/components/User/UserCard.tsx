import React from 'react'
import { Avatar } from 'antd'
import { User } from '@/type'

interface Iprops {
  user: User
  id?: string
}

const UserCardModal: React.FC<Iprops> = (props) => {
  return (
    <div className="rounded shadow p-2 flex">
      <div className="flex items-center mx-2">
        <Avatar size={'large'} src={`${props.user?.icon}`}></Avatar>
      </div>
      <div className="" style={{ fontWeight: 400 }}>
        <div>{props.user?.name}</div>
        <div>{props.user?.email}</div>
      </div>
    </div>
  )
}

export default UserCardModal
