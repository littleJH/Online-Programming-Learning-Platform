import React, { useEffect, useMemo, useState } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { redirect, useLocation, useNavigate } from 'react-router-dom'
import myHooks from '@/tool/myHooks/myHooks'
import { headerMenuItems } from '@/router/router'

export default function Header(props: { headerNav: string }) {
  const { headerNav } = props
  const navTo = myHooks.useNavTo()

  const selectedKey = useMemo(
    () => headerMenuItems.find((item) => item.key.includes(headerNav))?.key || '',
    [headerNav]
  )

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
        // justifyContent: 'center',
        alignContent: 'center',
      }}
      selectedKeys={[selectedKey]}
      mode="horizontal"
      onClick={handleMenuClick}
      items={headerMenuItems}
    ></Menu>
  )
}
