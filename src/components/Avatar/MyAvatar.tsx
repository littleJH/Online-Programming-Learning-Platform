import { iconBaseUrl } from '@/config/apiConfig'
import { userInfoState } from '@/store/appStore'
import { User } from '@/type'
import { Avatar, Popover } from 'antd'
import React from 'react'
import { useRecoilValue } from 'recoil'
import UserCard from '../User/UserCard'
import style from './style.module.scss'

interface Iprops {
  user: User | undefined | null
  active?: boolean
  className?: string
  size?: number
}
const MyAvatar: React.FC<Iprops> = (props) => {
  const { user, size, className, active = false } = props
  return (
    <Popover content={<UserCard user={user}></UserCard>}>
      <div className={style.avatarCtn}>
        <Avatar
          className={`hover:cursor-pointer card-avatar ${className} ${style.avatar}`}
          size={size || 'default'}
          alt="登录"
          src={`${iconBaseUrl}/${user?.icon || ''}`}
        ></Avatar>
        <div className={`${style.pulse} ${style.pulse1}`}></div>
        <div className={`${style.pulse} ${style.pulse2}`}></div>
      </div>
    </Popover>
  )
}

export default MyAvatar
