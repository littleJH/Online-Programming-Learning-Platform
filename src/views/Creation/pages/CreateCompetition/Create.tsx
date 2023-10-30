import { Steps } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ICompetition } from '@/type'
import useNavTo from '@/tool/myHooks/useNavTo'

const competition: ICompetition = localStorage.getItem('competitionInfo') ? JSON.parse(localStorage.getItem('competitionInfo') as string) : null

const Create: React.FC = () => {
  const nav = useNavTo()
  const [stepStatus, setstepStatus] = React.useState<'wait' | 'process' | 'finish' | 'error'>('process')
  const [currentStep, setcurrentStep] = useState(0)
  const [createdCompetition, setcreatedCompetition] = useState(false)

  useEffect(() => {
    nav('/creation/competition/declare')
  }, [])

  const onStepChange = (value: number) => {
    setcurrentStep(value)
    nav(value === 0 ? 'declare' : value === 1 ? 'competition' : 'problem')
  }
  return (
    <div className='flex'>
      <div
        className='py-4'
        style={{ width: '768px' }}
      >
        <Outlet></Outlet>
      </div>
      <div className='w-16'></div>
      <Steps
        className='w-36 h-48 mt-8 sticky top-8'
        direction='vertical'
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
