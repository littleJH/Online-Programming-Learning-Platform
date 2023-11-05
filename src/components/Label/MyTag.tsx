import React from 'react'
import { Tag, TagProps, theme } from 'antd'
import CheckableTag from 'antd/es/tag/CheckableTag'

const MyTag: React.FC<{
  label: string
  checkable?: boolean
  checked?: boolean
}> = (props) => {
  const { label, checkable, checked = false } = props
  const { token } = theme.useToken()
  console.log('theme ==> ', token)

  const render = () => {
    const tagProps = {
      bordered: false,
      color: token.colorPrimary,
      style: {
        fontSize: '0.75rem',
        backgroundColor: checked ? `${token.colorSuccessBg}` : `${token.colorPrimaryBg}`,
        color: checked ? `${token.colorSuccessTextHover}` : `${token.colorPrimaryText}`
      },
      children: label
    }

    return checkable ? (
      <CheckableTag
        {...tagProps}
        checked={checked}
      ></CheckableTag>
    ) : (
      <Tag {...tagProps}></Tag>
    )
  }
  return render()
}

export default MyTag
