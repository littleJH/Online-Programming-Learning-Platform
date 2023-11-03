import React from 'react'
import { Tag, theme } from 'antd'

const MyTag: React.FC<{
  label: string
}> = (props) => {
  const { label } = props
  const { token } = theme.useToken()
  console.log('theme ==> ', token)
  return (
    <Tag
      bordered={false}
      color={token.colorPrimary}
      style={{
        fontSize: '0.75rem',
        backgroundColor: `${token.colorPrimaryBg}`,
        color: `${token.colorPrimaryText}`
      }}
    >
      {label}
    </Tag>
  )
}

export default MyTag
