import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { redirect, useLocation, useNavigate } from 'react-router-dom'
import { getPathArray } from '@/tool/MyUtils/utils'
import useNavTo from '@/tool/myHooks/useNavTo'

const menuItem = [
  {
    label: '首页',
    key: 'home'
  },
  {
    label: '题库',
    key: 'problemset'
  },
  {
    label: '社区',
    key: 'community'
  },
  {
    label: '创作中心',
    key: 'creation'
  }
]

export default function Header(props: { headerNav: string }) {
  const { headerNav } = props
  const navTo = useNavTo()

  const handleMenuClick = (e: any) => {
    switch (e.key) {
      case 'community':
        navTo('/community/overview/articleset')
        break
      default:
        navTo(e.key)
        break
    }
  }
  return (
    <Menu
      style={{
        width: '100%',
        height: '100%',
        userSelect: 'none',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'start',
        alignContent: 'center'
      }}
      selectedKeys={[headerNav]}
      mode="horizontal"
      onClick={handleMenuClick}
      items={menuItem}
    ></Menu>
  )
}
