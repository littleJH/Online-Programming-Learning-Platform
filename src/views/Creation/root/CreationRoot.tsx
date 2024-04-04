import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import CreationNavgation from './CreationNavgation'
import { useRecoilValue } from 'recoil'
import { isMobileAtom, pathNameState } from '@/store/appStore'
import { Card } from 'antd'

const CreationRoot: React.FC = () => {
  const [mode, setmode] = useState('')
  const pathname = useRecoilValue(pathNameState)
  const isMobile = useRecoilValue(isMobileAtom)

  const showNav = React.useMemo(() => pathname === '/creation', [pathname])
  const full = React.useMemo(() => pathname === '/creation/article' || isMobile, [pathname, isMobile])

  useEffect(() => console.log('is mobile ==> ', isMobile), [isMobile])

  const handleModeChange = (value: any) => {
    console.log(value)
    setmode(value)
  }
  return (
    <div className="w-full h-full">
      {showNav ? (
        <CreationNavgation></CreationNavgation>
      ) : (
        <Card
          style={{
            // height: `${full ? '100%' : 'max-content'}`,
            width: `${full ? '100%' : 'max-content'}`,
            // margin: `${full ? '0 1rem' : '0'}`,
          }}
          styles={{
            body: {
              // height: `${full ? '100%' : 'max-content'}`,
              width: `${full ? '100%' : 'max-content'}`,
              padding: isMobile ? '1rem' : '2rem',
            },
          }}
        >
          <Outlet></Outlet>
        </Card>
      )}
    </div>
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
