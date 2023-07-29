import { Steps } from 'antd'
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ICompetition } from '@/vite-env'

const competition: ICompetition = localStorage.getItem('competitionInfo')
  ? JSON.parse(localStorage.getItem('competitionInfo') as string)
  : null

const Create: React.FC = () => {
  const nav = useNavigate()
  const [stepStatus, setstepStatus] = React.useState<
    'wait' | 'process' | 'finish' | 'error'
  >('process')
  const [currentStep, setcurrentStep] = useState(0)
  const [createdCompetition, setcreatedCompetition] = useState(false)
  const onStepChange = (value: number) => {
    setcurrentStep(value)
    switch (value) {
      case 0:
        nav('')
        break
      case 1:
        nav('competition')
        break
      case 2:
        nav('problem')
        break
      default:
        break
    }
  }
  return (
    <div className="flex">
      <div className="py-4" style={{ width: '768px' }}>
        <Outlet></Outlet>
      </div>
      <div className="w-16"></div>
      <Steps
        className="w-36 h-48 mt-8 sticky top-8"
        direction="vertical"
        progressDot
        status={stepStatus}
        current={currentStep}
        onChange={onStepChange}
        items={[
          {
            title: '比赛说明',
            description: ''
          },
          {
            title: '创建比赛',
            description: ''
          },
          {
            title: '添加题目',
            description: ''
          }
        ]}
      ></Steps>
    </div>
  )
}

export default Create
