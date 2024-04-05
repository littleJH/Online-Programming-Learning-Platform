import React from 'react'
import { Avatar, Divider, Menu } from 'antd'
import { User } from '@/type'
import { imgGetBaseUrl } from '@/config/apiConfig'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@/store/appStore'
import { siderMenuItemsObj } from '@/router/router'
import SubNavbar from '../Navbar/SubNavbar'

interface Iprops {
  user: User
  id?: string
}

const UserCard: React.FC<Iprops> = (props) => {
  const { user } = props
  const currentUser = useRecoilValue(userInfoState)
  return (
    <div className="rounded p-2">
      <div className="flex ">
        <div className="flex items-center mx-2">
          <Avatar src={`${imgGetBaseUrl}/${user.icon}`} size={'large'}></Avatar>
        </div>
        <div className="">
          <div>{props.user?.name}</div>
          <div>{props.user?.email}</div>
        </div>
      </div>
      {currentUser?.id === user.id && (
        <div className="">
          <Divider></Divider>
          <SubNavbar mode="vertical" header="profile"></SubNavbar>
        </div>
      )}
    </div>
  )
}

export default UserCard
