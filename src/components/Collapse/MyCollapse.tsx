import React from 'react'
import { CaretRightOutlined } from '@ant-design/icons'
import { Collapse, theme } from 'antd'

const MyCollapse: React.FC<{
  onChange: (key: string | string[]) => void
  items: any[]
  activeKey?: string[]
  style?: React.CSSProperties
}> = props => {
  const {
    onChange: handleCollapseChange,
    items,
    activeKey = [],
    style = {},
  } = props
  const { token } = theme.useToken()

  return (
    <Collapse
      activeKey={activeKey}
      bordered={false}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
      style={{ background: token.colorBgContainer, ...style }}
      items={items}
      onChange={handleCollapseChange}
    ></Collapse>
  )
}

export default MyCollapse
