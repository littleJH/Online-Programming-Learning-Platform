import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
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
import MySvgIcon from '../Icon/MySvgIcon'
import { useRecoilValue } from 'recoil'
import { pathNameState } from '@/store/appStore'
import { getPathArray } from '@/tool/MyUtils/utils'

const SideBar: React.FC<{ header: string }> = props => {
  const { header } = props
  const [current, setCurrent] = useState('')
  const [menuItem, setMenuItem] = useState([])
  const pathname = useRecoilValue(pathNameState)
  const navTo = useNavTo()

  useEffect(() => {
    setCurrent(getPathArray(pathname)[1])
    setMenuItem(menuItemObj[`${header}MenuItem`])
  }, [header, pathname])

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
const menuItemObj: any = {
  problemsetMenuItem: [
    {
      label: '全部',
      key: 'all'
    },
    {
      label: '题单',
      key: 'topic',
    },
    {
      label: '表单',
      key: 'form'
    }
  ],
  creationMenuItem: [
    {
      label: '题目',
      key: 'problem',
      icon: <MySvgIcon size={1.25} href="problem" classname="mr-5"></MySvgIcon>
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

export default SideBar
