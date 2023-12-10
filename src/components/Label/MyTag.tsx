import React from 'react'
import {Tag, TagProps, theme} from 'antd'
import CheckableTag from 'antd/es/tag/CheckableTag'

const MyTag: React.FC<{
  children: string
  size?: number
  type?: 'Primary' | 'Success' | 'Warning' | 'Info'
  checkable?: boolean
  checked?: boolean
}> = (props) => {
  const {
    children,
    size = 0.75,
    checkable,
    checked = false,
    type = 'Primary'
  } = props
  const {token} = theme.useToken()

  const render = () => {
    const tagProps = {
      bordered: false,
      style: {
        fontSize: `${size}rem`,
        backgroundColor: checked
          ? `${token.colorSuccessBg}`
          : `${token[`color${type}Bg`]}`,
        color: checked
          ? `${token[`color${type}TextHover`]}`
          : `${token[`color${type}Text`]}`
      }
    }

    return checkable ? (
      <CheckableTag {...tagProps} checked={checked}>
        {children}
      </CheckableTag>
    ) : (
      <Tag {...tagProps}>{children}</Tag>
    )
  }
  return render()
}

export default MyTag
