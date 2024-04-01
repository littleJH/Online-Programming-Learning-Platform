import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import { useSetRecoilState } from 'recoil'
import { sideBarTypeState } from '@/store/appStore'

export default function Homepage() {
  const setSidebarType = useSetRecoilState(sideBarTypeState)
  useEffect(() => {
    setSidebarType('none')
  }, [])
  return (
    <>
      <div className="h-full flex justify-center items-center"></div>
    </>
  )
}
