import TextEditor from '@/components/Editor/TextEditor'
import React, { useState } from 'react'
import CreateArticle from './CreateArticle'
import { Radio, Segmented, Space } from 'antd'
import CreateComment from './CreateComment'
import { Outlet } from 'react-router-dom'

const modeOptions = [
  {
    label: '文章',
    value: 'article'
  },
  {
    label: '讨论',
    value: 'comment'
  },
  {
    label: '题解',
    value: 'post'
  }
]
const CreationRoot: React.FC = () => {
  const [mode, setmode] = useState('')

  const handleModeChange = (value: any) => {
    console.log(value)
    setmode(value)
  }
  return (
    <Outlet></Outlet>
  )
}

export default CreationRoot

{
  /* <div className="mb-6">
<Segmented
  size="large"
  options={modeOptions}
  block
  value={mode}
  onChange={handleModeChange}
></Segmented>
</div> */
}
