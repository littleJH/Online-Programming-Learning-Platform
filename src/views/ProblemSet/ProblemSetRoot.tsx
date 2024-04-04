import myHooks from '@/tool/myHooks/myHooks'
import { Card, Divider, Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import style from './style.module.scss'
import SubNavbar from '@/components/Navbar/SubNavbar'
import { useRecoilValue } from 'recoil'
import { isMobileAtom } from '@/store/appStore'

const ProblemSetRoot: React.FC = () => {
  const isMobile = useRecoilValue(isMobileAtom)
  const navto = myHooks.useNavTo()

  useEffect(() => {
    navto('/problemset/all')
  }, [])

  return (
    <div className={style.root}>
      {/* {!isMobile && (
        <div className={style.header}>
          <SubNavbar header="problemset" mode={'horizontal'}></SubNavbar>
          <Divider></Divider>
        </div>
      )} */}
      <Card size="small" className={style.body}>
        <Outlet></Outlet>
      </Card>
    </div>
  )
}

export default ProblemSetRoot
