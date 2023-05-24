import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { redirect, useNavigate } from 'react-router-dom'

export default function Header() {
  const nav = useNavigate()
  const [current, setcurrent] = useState('/')

  const onclick = (e: any) => {
    setcurrent(e.key)
    if (e.key === 'problem') nav('/problem/list')
    else nav(e.key)
  }
  return (
    <Menu
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}
      selectedKeys={[current]}
      mode="horizontal"
      onClick={onclick}
      items={[
        {
          label: '首页',
          key: 'home'
        },
        {
          label: '竞赛',
          key: 'competition'
        },
        {
          label: '题目',
          key: 'problem'
        }
      ]}
    ></Menu>
  )
}
