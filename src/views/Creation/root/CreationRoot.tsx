import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import CreationNavgation from './CreationNavgation'
import { useRecoilValue } from 'recoil'
import { pathNameState } from '@/store/appStore'
import { Card } from 'antd'

const CreationRoot: React.FC = () => {
  const [mode, setmode] = useState('')
  const pathname = useRecoilValue(pathNameState)

  const showNav = React.useMemo(() => pathname === '/creation', [pathname])
  const full = React.useMemo(() => pathname === '/creation/article', [pathname])

  const handleModeChange = (value: any) => {
    console.log(value)
    setmode(value)
  }
  return (
    <>
      {showNav && <CreationNavgation></CreationNavgation>}
      <Card
        size='small'
        style={{
          height: `${full ? '100%' : 'max-content'}`,
          width: `${full ? '100%' : 'max-content'}`,
          margin: `${full ? '0 1rem' : '0'}`
        }}
        bodyStyle={{
          height: `${full ? '100%' : 'max-content'}`,
          width: `${full ? '100%' : 'max-content'}`
        }}
      >
        <Outlet></Outlet>
      </Card>
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
