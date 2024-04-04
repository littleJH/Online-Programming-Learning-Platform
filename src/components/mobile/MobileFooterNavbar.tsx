import React, { useMemo } from 'react'
import {
  CodeOutlined,
  GlobalOutlined,
  BulbOutlined,
  HomeOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons'
import myHooks from '@/tool/myHooks/myHooks'
import { Menu } from 'antd'
import { headerNavState } from '@/store/appStore'
import { useRecoilValue } from 'recoil'
import { footerMenuItems } from '@/router/router'

const MobileFooterNavbar: React.FC = () => {
  const headerNav = useRecoilValue(headerNavState)
  const navTo = myHooks.useNavTo()

  const selectedKey = useMemo(
    () => footerMenuItems.find((item) => item.key.includes(headerNav))?.key || '',
    [headerNav]
  )

  const handleMenuClick = (e: any) => {
    navTo(`/${e.key}`)
  }

  return (
    <Menu
      onClick={handleMenuClick}
      style={{
        width: '100%',
        height: '50px',
        userSelect: 'none',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      selectedKeys={[selectedKey]}
      mode="horizontal"
      items={footerMenuItems}
    ></Menu>
  )
}

export default MobileFooterNavbar
