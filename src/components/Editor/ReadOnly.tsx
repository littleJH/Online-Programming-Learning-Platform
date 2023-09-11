import { Editor } from '@wangeditor/editor-for-react'
import React, { useState } from 'react'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

interface Iprops {
  html: string | undefined
  title?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  ctnClassName?: string
}

const ReadOnly: React.FC<Iprops> = props => {
  const { html, title, style, className, ctnClassName } = props

  return (
    <div className={ctnClassName}>
      {title && title}
      <Editor
        defaultConfig={{
          readOnly: true
        }}
        defaultHtml={html}
        mode="default"
        className={className ? className : ''}
        style={style}
      ></Editor>
    </div>
  )
}

export default ReadOnly
