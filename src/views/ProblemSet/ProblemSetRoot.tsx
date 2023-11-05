import useNavTo from '@/tool/myHooks/useNavTo'
import { Card, Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const ProblemSetRoot: React.FC = () => {
  const navto = useNavTo()

  useEffect(() => {
    navto('/problemset/all')
  }, [])
  return (
    <Card style={{ height: 'max-content' }}>
      <Outlet></Outlet>
    </Card>
  )
}

export default ProblemSetRoot
