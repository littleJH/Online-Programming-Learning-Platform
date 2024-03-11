import myHooks from '@/tool/myHooks/myHooks'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const CompetitionCommonRoot: React.FC = () => {
  const navTo = myHooks.useNavTo()
  useEffect(() => {
    navTo('/competition/common/set')
  }, [])
  return (
    <div>
      <Outlet></Outlet>
    </div>
  )
}

export default CompetitionCommonRoot
