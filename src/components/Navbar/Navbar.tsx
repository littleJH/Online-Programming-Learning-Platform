import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { redirect, useLocation, useNavigate } from 'react-router-dom'
import myHooks from '@/tool/myHooks/myHooks'
import {
  CodeOutlined,
  GlobalOutlined,
  BulbOutlined,
  HomeOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons'

const menuItem = [
  {
    label: '首页',
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: '题库',
    key: 'problemset',
    icon: <CodeOutlined />,
  },
  {
    label: '比赛',
    key: 'competition/common/set',
    icon: <TrophyOutlined />,
  },
  {
    label: '社区',
    key: 'community',
    icon: <GlobalOutlined />,
  },

  {
    label: '创作',
    key: 'creation',
    icon: <BulbOutlined />,
  },
  {
    label: '个人',
    key: 'profile',
    icon: <UserOutlined />,
  },
]

export default function Header(props: { headerNav: string }) {
  const { headerNav } = props
  const navTo = myHooks.useNavTo()

  const handleMenuClick = (e: any) => {
    navTo(`/${e.key}`)
  }
  return (
    <Menu
      style={{
        width: '100%',
        height: '100%',
        userSelect: 'none',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
      }}
      selectedKeys={[headerNav]}
      mode="horizontal"
      onClick={handleMenuClick}
      items={menuItem}
    ></Menu>
  )
}
