import '@wangeditor/editor/dist/css/style.css' // 引入 css
import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { Boot, IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import markdownModule from '@wangeditor/plugin-md'
import { theme } from 'antd'

let flag = false

const TextEditor: React.FC<{
  mode?: 'richtext' | 'markdown'
  value?: string
  defaultHtml?: string
  htmlChange: Function
  placeholder?: string
  style?: React.CSSProperties
  className?: string
}> = (props) => {
  const { mode, value, htmlChange, placeholder, style, className, defaultHtml } = props
  const { token } = theme.useToken()

  const editorStyle: React.CSSProperties = React.useMemo(
    () =>
      style || {
        border: `1px solid ${token.colorBorder}`,
        borderRadius: token.borderRadius
      },
    [style]
  )

  if (!flag) {
    Boot.registerModule(markdownModule)
    flag = true
  }

  const [editor, seteditor] = useState<IDomEditor | null>(null)

  const toolbarConfig: Partial<IToolbarConfig> = {}

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: placeholder ? placeholder : 'markdown here ...'
  }

  // 及时销毁editor
  useEffect(() => {
    return () => {
      if (!editor) return
      editor.destroy()
      seteditor(null)
    }
  }, [editor])

  const handleChange = (editor: IDomEditor) => {
    htmlChange(editor.getHtml())
  }
  return (
    <div
      className='h-full flex flex-col'
      style={{
        zIndex: 100
      }}
    >
      {mode === 'richtext' && (
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode='default'
          className='sticky top-0'
          style={{
            zIndex: 1000,
            boxShadow: token.boxShadowTertiary,
            backgroundColor: token.colorBgBase
          }}
        ></Toolbar>
      )}
      <Editor
        defaultConfig={editorConfig}
        defaultHtml={defaultHtml}
        value={value}
        onCreated={seteditor}
        onChange={handleChange}
        mode='default'
        style={{ minHeight: '300px', flexGrow: '1', backgroundColor: token.colorBgBase, ...editorStyle }}
        className={className}
      ></Editor>
    </div>
  )
}

export default TextEditor
