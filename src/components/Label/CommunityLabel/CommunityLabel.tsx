import { IArticleLabel } from '@/type'
import React from 'react'
import { theme } from 'antd'

const CommunityLabel: React.FC<{
  label: IArticleLabel
}> = (props) => {
  const { label } = props
  const { token } = theme.useToken()
  console.log('theme ==> ', token)
  return (
    <span
      className='max-w-min max-h-min rounded select-none hover:cursor-pointer hover:shadow transition-all'
      style={{
        padding: '0.2rem 0.5rem',
        fontSize: '8px',
        backgroundColor: `${token.colorPrimaryBg}`,
        color: `${token.colorPrimaryText}`
      }}
    >
      {label.label}
    </span>
  )
}

export default CommunityLabel
