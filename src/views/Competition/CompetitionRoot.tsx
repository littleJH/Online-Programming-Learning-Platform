import myHooks from '@/tool/myHooks/myHooks'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import style from './style.module.scss'
import { Card } from 'antd'

const Competition: React.FC = () => {
  const navTo = myHooks.useNavTo()
  // useEffect(() => {
  //   navTo('/competition/common/set')
  // }, [])

  return (
    <Card size="small" className={style.root}>
      <Outlet></Outlet>
    </Card>
  )
}

export default Competition
