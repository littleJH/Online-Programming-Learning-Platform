import React from 'react'
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

const menuItems = [
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
    label: '我的',
    key: 'profile',
    icon: <UserOutlined />,
  },
]

const MobileFooterNavbar: React.FC = () => {
  const headerNav = useRecoilValue(headerNavState)
  const navTo = myHooks.useNavTo()

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
      selectedKeys={[headerNav]}
      mode="horizontal"
      items={menuItems}
    ></Menu>
  )
}

export default MobileFooterNavbar
