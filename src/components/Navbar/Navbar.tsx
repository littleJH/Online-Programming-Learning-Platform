import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { redirect, useLocation, useNavigate } from 'react-router-dom'

const menuItem = [
  // {
  //   label: '竞赛',
  //   key: 'competition'
  // },

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

export default function Header() {
  const pathname = useLocation().pathname
  const nav = useNavigate()
  const [current, setcurrent] = useState('/')

  useEffect(() => {
    menuItem.some(item => {
      if (pathname.includes(item.key)) {
        setcurrent(item.key)
        return true
      }
    })
  }, [pathname])

  const handleMenuClick = (e: any) => {
    setcurrent(e.key)
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
        justifyContent: 'center',
        alignContent: 'center'
      }}
      selectedKeys={[current]}
      mode="horizontal"
      onClick={handleMenuClick}
      items={menuItem}
    ></Menu>
  )
}
