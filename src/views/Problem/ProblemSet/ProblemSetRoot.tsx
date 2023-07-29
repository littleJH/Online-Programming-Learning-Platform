import { Menu } from 'antd'
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const ProblemSetRoot: React.FC = () => {
  const nav = useNavigate()
  const [activeKey, setActiveKey] = useState('all')

  const handleMenuClick = (info: any) => {
    console.log(info)
    switch (info.key) {
      case 'all':
        nav('/problem/set/all')
        break
      case 'topic':
        // nav('/problem/set/topic')
        break
      case 'form':
        // nav('/problem/set/form')
        break
      default:
        break
    }
  }
  return (
    <div>
      <Menu
        mode="horizontal"
        activeKey={activeKey}
        onClick={handleMenuClick}
        items={[
          {
            key: 'all',
            label: '全部'
          },
          {
            key: 'topic',
            label: '题单'
          },
          {
            key: 'form',
            label: '表单'
          }
        ]}
      ></Menu>
      <Outlet></Outlet>
    </div>
  )
}

export default ProblemSetRoot
