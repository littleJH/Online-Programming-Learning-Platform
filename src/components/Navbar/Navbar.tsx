import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { redirect, useLocation, useNavigate } from 'react-router-dom'
import myHooks from '@/tool/myHooks/myHooks'
import { CodeOutlined, GlobalOutlined, BulbOutlined, HomeOutlined, TrophyOutlined } from '@ant-design/icons'
import MySvgIcon from '../Icon/MySvgIcon'

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
    label: '创作中心',
    key: 'creation',
    icon: <BulbOutlined />,
  },
  {
    label: (
      <span
        style={{
          marginLeft: '10px',
        }}
      >
        学习中心
      </span>
    ),
    key: 'learn',
    icon: <MySvgIcon href="#icon-xuexizhongxin"></MySvgIcon>,
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
