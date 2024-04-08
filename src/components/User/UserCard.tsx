import React from 'react'
import { Avatar, Divider, Menu } from 'antd'
import { User } from '@/type'
import { imgGetBaseUrl } from '@/config/apiConfig'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@/store/appStore'
import { siderMenuItemsObj } from '@/router/router'
import SubNavbar from '../Navbar/SubNavbar'

interface Iprops {
  user: User | undefined | null
  showMenu?: boolean
  id?: string
}

const UserCard: React.FC<Iprops> = (props) => {
  const { user, showMenu } = props
  return (
    <div className="rounded p-2">
      <div className="flex ">
        <div className="flex items-center mx-2">
          <Avatar src={`${imgGetBaseUrl}/${user?.icon}`} size={'large'}></Avatar>
        </div>
        <div className="">
          <div>{props.user?.name}</div>
          <div>{props.user?.email}</div>
        </div>
      </div>
      {showMenu && (
        <div className="">
          <Divider></Divider>
          <SubNavbar mode="vertical" header="profile"></SubNavbar>
        </div>
      )}
    </div>
  )
}

export default UserCard
