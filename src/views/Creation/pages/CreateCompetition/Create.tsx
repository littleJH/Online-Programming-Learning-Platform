import { Steps } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { pathNameState } from '@/store/appStore'
import utils from '@/tool/myUtils/utils'

const Create: React.FC = () => {
  const pathname = useRecoilValue(pathNameState)
  const currentStep = useMemo(() => {
    const path = utils.getPathArray(pathname)[2]
    return path === 'declare' ? 0 : path === 'competition' ? 1 : 2
  }, [pathname])

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
        current={currentStep}
        items={[
          {
            title: '比赛说明',
            description: '',
          },
          {
            title: '创建比赛',
            description: '',
          },
          {
            title: '添加题目',
            description: '',
          },
        ]}
      ></Steps>
    </div>
  )
}

export default Create
