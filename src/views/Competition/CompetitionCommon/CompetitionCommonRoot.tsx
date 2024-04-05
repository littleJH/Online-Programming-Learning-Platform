import myHooks from '@/tool/myHooks/myHooks'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import style from '@/views/Competition/style.module.scss'

const CompetitionCommonRoot: React.FC = () => {
  const navTo = myHooks.useNavTo()
  // useEffect(() => {
  //   navTo('/competition/common/set')
  // }, [])
  return (
    <div className={style.commonRoot}>
      <Outlet></Outlet>
    </div>
  )
}

export default CompetitionCommonRoot
