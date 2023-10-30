import useNavTo from '@/tool/myHooks/useNavTo'
import { Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const ProblemSetRoot: React.FC = () => {
  const navto = useNavTo()

  useEffect(() => {
    navto('/problemset/all')
  }, [])
  return (
    <div>
      <Outlet></Outlet>
    </div>
  )
}

export default ProblemSetRoot
