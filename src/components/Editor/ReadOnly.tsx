import { Editor } from '@wangeditor/editor-for-react'
import React, { useState } from 'react'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Boot, IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import markdownModule from '@wangeditor/plugin-md'
import { theme } from 'antd'
import moduleStyle from './style.module.scss'

interface Iprops {
  html: string | undefined
  title?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  ctnClassName?: string
  borderd?: boolean
}
let flag = false

const ReadOnly: React.FC<Iprops> = (props) => {
  const {
    html,
    title,
    style = {
      fontSize: '1rem',
    },
    className,
    ctnClassName,
    borderd = false,
  } = props
  const { token } = theme.useToken()

  if (!flag) {
    Boot.registerModule(markdownModule)
    flag = true
  }

  return (
    <div className={ctnClassName}>
      {title && title}
      <Editor
        defaultConfig={{
          readOnly: true,
        }}
        defaultHtml={html}
        mode={'default'}
        className={`rounded-md ${className || ''} ${borderd ? moduleStyle.border : ''}`}
        style={style}
      ></Editor>
    </div>
  )
}

export default ReadOnly
