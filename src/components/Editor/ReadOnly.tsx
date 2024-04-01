import { Editor } from '@wangeditor/editor-for-react'
import React, { useState } from 'react'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

interface Iprops {
  html: string | undefined
  title?: React.ReactNode
  style?: React.CSSProperties
  className?: string
  ctnClassName?: string
  borderd?: boolean
}

const ReadOnly: React.FC<Iprops> = (props) => {
  const { html, title, style, className, ctnClassName, borderd = false } = props

  return (
    <div className={ctnClassName}>
      {title && title}
      <Editor
        defaultConfig={{
          readOnly: true,
        }}
        defaultHtml={html}
        mode="default"
        className={` rounded-md ${className} ${borderd ? 'border-1 border-solid border-gray-200' : ''}`}
        style={style}
      ></Editor>
    </div>
  )
}

export default ReadOnly
