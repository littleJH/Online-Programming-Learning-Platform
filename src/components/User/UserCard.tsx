import React from 'react'
import { Avatar, Button, Divider, Menu, Space } from 'antd'
import { User } from '@/type'
import { imgGetBaseUrl } from '@/config/apiConfig'
import { useRecoilValue } from 'recoil'
import { userInfoState } from '@/store/appStore'
import { siderMenuItemsObj } from '@/router/router'
import SubNavbar from '../Navbar/SubNavbar'
import style from './style.module.scss'

interface Iprops {
  user: User | undefined | null
  showMenu?: boolean
  id?: string
}

const UserCard: React.FC<Iprops> = (props) => {
  const { user, showMenu } = props
  return (
    <div className={style.usercard}>
      <div className="flex w-full">
        <div className="flex items-center mx-2">
          <Avatar src={`${imgGetBaseUrl}/${user?.icon}`} size={'large'}></Avatar>
        </div>
        <div className={style.content}>
          <div className={style.name}>{props.user?.name}</div>
          <div className={style.email}>{props.user?.email}</div>
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
