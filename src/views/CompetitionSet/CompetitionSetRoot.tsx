import useNavTo from '@/tool/myHooks/useNavTo'
import React from 'react'
import { Card } from 'antd'
import { Outlet } from 'react-router-dom'

const CompetitionSetRoot: React.FC = () => {
  const navto = useNavTo()

  React.useEffect(() => {
    navto('/competitionset/all')
  }, [])
  return (
    <Card style={{ height: 'max-content' }}>
      <Outlet></Outlet>
    </Card>
  )
}

export default CompetitionSetRoot
