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
    <div className="">
      <div className="w-full flex justify-center">
        <Steps
          className="w-2/3 my-4"
          status={stepStatus}
          current={currentStep}
          onChange={onStepChange}
          items={[
            {
              title: '功能说明',
              description: ''
            },
            {
              title: '创建比赛',
              description: ''
            },
            {
              title: '赛内题目',
              description: ''
            }
          ]}
        ></Steps>
        {}
      </div>
      <div className="p-8 shadow rounded" style={{ minWidth: '800px' }}>
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default Create
