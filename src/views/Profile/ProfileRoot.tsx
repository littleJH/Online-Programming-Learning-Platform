import { Menu } from 'antd'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Outlet, redirect, useLocation, useNavigate } from 'react-router-dom'
import {
  UserOutlined,
  MenuOutlined,
  StarOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  MessageOutlined,
  TeamOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { useRecoilValue } from 'recoil'
import { loginStatusState } from '@/recoil/store'

const menuItem = [
  {
    key: 'friend',
    label: '好友',
    icon: <UserOutlined />
  },
  {
    key: 'message',
    label: '留言板',
    icon: <MessageOutlined />
  },
  {
    key: 'group',
    label: '用户组',
    icon: <TeamOutlined />
    // children: [
    //   {
    //     key: 'creation',
    //     label: '我创建的'
    //   },
    //   {
    //     key: 'participation',
    //     label: '我加入的'
    //   }
    // ]
  },
  {
    key: 'divider3',
    type: 'divider'
  },
  {
    key: 'info',
    label: '个人信息',
    icon: <InfoCircleOutlined />
  },
  {
    type: 'divider',
    key: 'divider1'
  },
  {
    key: 'creation',
    label: '我创建的',
    icon: <MenuOutlined />,
    children: [
      {
        key: 'creation/problem',
        label: '题目',
        icon: (
          <svg className="icon-small">
            <use href="#icon-problem"></use>
          </svg>
        )
      },
      {
        key: 'creation/topic',
        label: '题单',
        icon: (
          <svg className="icon-small">
            <use href="#icon-topic"></use>
          </svg>
        )
      },
      {
        key: 'creation/form',
        label: '表单',
        icon: (
          <svg className="icon-small">
            <use href="#icon-liebiaoqingdan"></use>
          </svg>
        )
      },
      {
        key: 'creation/article',
        label: '文章',
        icon: (
          <svg className="icon-small">
            <use href="#icon-article"></use>
          </svg>
        )
      }
    ]
  },
  {
    key: 'star',
    label: '收藏夹',
    icon: <StarOutlined />,
    children: [
      {
        key: 'star/problem',
        label: '题目',
        icon: (
          <svg className="icon-small">
            <use href="#icon-problem"></use>
          </svg>
        )
      },
      {
        key: 'star/topic',
        label: '题单',
        icon: (
          <svg className="icon-small">
            <use href="#icon-topic"></use>
          </svg>
        )
      },
      {
        key: 'star/form',
        label: '表单',
        icon: (
          <svg className="icon-small">
            <use href="#icon-liebiaoqingdan"></use>
          </svg>
        )
      },
      {
        key: 'star/article',
        label: '文章',
        icon: (
          <svg className="icon-small">
            <use href="#icon-article"></use>
          </svg>
        )
      }
    ]
  },
  {
    type: 'divider',
    key: 'divider2'
  },
  {
    key: 'setting',
    label: '偏好设置',
    icon: <SettingOutlined />
  },
  {
    key: 'account',
    label: '账号安全',
    icon: <SafetyCertificateOutlined />
  }
]

const ProfileRoot: React.FC = () => {
  const nav = useNavigate()
  const pathname = useLocation().pathname
  const info = useRecoilValue(loginStatusState)
  const [activeKey, setActiveKey] = useState<string>('')
  // const [openkeys, setOpenkeys] = useState<string[]>([])

  useLayoutEffect(() => {
    !info && redirect('/login')
  }, [])

  useEffect(() => {
    menuItem.some(item => {
      if (pathname.includes(item.key)) {
        setActiveKey(item.key)
        return true
      }
    })
  }, [pathname])

  const handleMenuClick = (info: any) => {
    nav(`/profile/${info.key}`)
  }

  // const handleSubmenuOpenChange = (openkeys: string[]) => {
  //   const openkey = openkeys[openkeys.length - 1]
  //   openkey && nav(`/profile/${openkey}`)
  //   setOpenkeys([openkey])
  // }

  return (
    <div className="h-full w-full flex">
      <div className="grow"></div>
      <div className="flex">
        <div>
          <Menu
            className="select-none sticky top-0"
            mode="inline"
            selectedKeys={[activeKey]}
            // openKeys={openkeys}
            items={menuItem}
            onClick={handleMenuClick}
            // onOpenChange={handleSubmenuOpenChange}
          ></Menu>
        </div>
        <div
          className="p-8"
          style={{
            minWidth: '768px'
          }}
        >
          <Outlet></Outlet>
        </div>
      </div>
      <div className="grow"></div>
    </div>
  )
}

export default ProfileRoot
