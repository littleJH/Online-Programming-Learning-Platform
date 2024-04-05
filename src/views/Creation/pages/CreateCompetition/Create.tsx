import { Steps, theme } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { isMobileAtom, pathNameState } from '@/store/appStore'
import utils from '@/tool/myUtils/utils'
import style from './style.module.scss'

const Create: React.FC = () => {
  const isMobile = useRecoilValue(isMobileAtom)
  const pathname = useRecoilValue(pathNameState)
  const { token } = theme.useToken()

  const currentStep = useMemo(() => {
    const path = utils.getPathArray(pathname)[2]
    return path === 'declare' ? 0 : path === 'competition' ? 1 : 2
  }, [pathname])

  const renderSteps = () => {
    return (
      <Steps
        style={{
          backgroundColor: token.colorBgBase,
        }}
        className={style.steps}
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
    )
  }

  return (
    <div className={style.competitionCretion}>
      {isMobile && renderSteps()}
      <div className={style.outletbox}>
        <Outlet></Outlet>
      </div>
      <div className="w-16"></div>
      {!isMobile && renderSteps()}
    </div>
  )
}

export default Create
