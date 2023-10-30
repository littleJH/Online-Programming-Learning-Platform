import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import CreationNavgation from './CreationNavgation'
import { useRecoilValue } from 'recoil'
import { pathNameState } from '@/store/appStore'

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
