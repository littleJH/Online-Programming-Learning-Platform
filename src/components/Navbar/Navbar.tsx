import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { redirect, useLocation, useNavigate } from 'react-router-dom'
import { getPathArray } from '@/tool/MyUtils/Utils'

const menuItem = [
  {
    label: '首页',
    key: 'home'
  },
  {
    label: '题库',
    key: 'problem'
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

export default function Header(props: { headerNav: string, setHeaderNav: Function }) {
  const { headerNav, setHeaderNav } = props
  const { pathname } = useLocation()
  const pathArr = getPathArray(pathname)
  const nav = useNavigate()

  useEffect(() => {
    setHeaderNav(pathArr[0])
  }, [])

  const handleMenuClick = (e: any) => {
    setHeaderNav(e.key)
    switch (e.key) {
      case 'problem':
        nav('/problem/set/all')
        break
      case 'community':
        nav('/community/overview/articleset')
        break
      default:
        nav(e.key)
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
