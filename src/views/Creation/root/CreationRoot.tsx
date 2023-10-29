import TextEditor from '@/components/editor/TextEditor'
import React, { useEffect, useState } from 'react'
import CreateArticle from '../pages/CreateArticle'
import { Radio, Segmented, Space } from 'antd'
import CreateComment from '../pages/CreateComment'
import { Outlet } from 'react-router-dom'
import CreationNavgation from './CreationNavgation'
import { useRecoilState, useRecoilValue } from 'recoil'
import { pathNameState } from '@/store/appStore'

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
  const pathname = useRecoilValue(pathNameState)
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    setShowNav(pathname === '/creation')
  }, [pathname])

  const handleModeChange = (value: any) => {
    console.log(value)
    setmode(value)
  }
  return (
    <>
      {showNav && <CreationNavgation></CreationNavgation>}
      <Outlet></Outlet>
    </>
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
