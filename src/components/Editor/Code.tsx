import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react'
import React from 'react'

interface Iprops {
  value: string
  theme: string
  language: string
  className?: string
  height: string
  width: string
  codeChange: Function
}

const Code: React.FC<Iprops> = (props: Iprops) => {
  return (
    <Editor
      defaultValue={props.value}
      height={props.height}
      width={props.width}
      className={`${props.className} bg-white`}
      language={props.language}
      theme={props.theme}
      onChange={value => props.codeChange(value)}
    />
  )
}

export default Code
