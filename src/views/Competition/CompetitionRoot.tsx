import myHooks from '@/tool/myHooks/myHooks'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Competition: React.FC = () => {
  const navTo = myHooks.useNavTo()
  useEffect(() => {
    navTo('/competition/common/set')
  }, [])

  return (
    <div className="flex-grow h-full w-full flex justify-center">
      <Outlet></Outlet>
    </div>
  )
}

export default Competition
