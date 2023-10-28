import { getPathArray } from '@/tool/MyUtils/utils'
import { Menu } from 'antd'
import { ItemType, MenuItemType } from 'antd/es/menu/hooks/useItems'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
import useNavTo from '@/tool/myHooks/useNavTo'

const menuItemObj: any = {
  problemMenuItem: [
    {
      label: '',
      key: ''
    }
  ],
  creationMenuItem: [
    {
      label: '题目',
      key: 'problem'
    },
    {
      label: '题单',
      key: 'topic'
    },
    {
      label: '表单',
      key: 'form'
    },
    {
      label: '比赛',
      key: 'competition'
    },
    {
      label: '文章',
      key: 'article'
    },
    {
      label: '讨论',
      key: 'comment'
    },
    {
      label: '题解',
      key: 'post'
    }
  ],
  profileMenuItem: [
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
}

const SideBar: React.FC<{ header: string }> = props => {
  const { header } = props
  const { pathname } = useLocation()
  const pathArr = getPathArray(pathname)
  const [current, setCurrent] = useState('')
  const [menuItem, setMenuItem] = useState([])
  const navTo = useNavTo()

  useEffect(() => {
    setMenuItem(menuItemObj[`${header}MenuItem`])
  }, [header])

  const handleMenuClick = (e: any) => {
    setCurrent(e.key)
    navTo(`/${header}/${e.key}`)
  }

  return (
    <Menu
      style={{
        height: '100%',
        userSelect: 'none',
        padding: '0 1rem'
      }}
      selectedKeys={[current]}
      mode="vertical"
      onClick={handleMenuClick}
      items={menuItem}
    ></Menu>
  )
}

export default SideBar
