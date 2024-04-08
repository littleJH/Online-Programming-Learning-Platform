import myHooks from '@/tool/myHooks/myHooks'
import React, { useEffect, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import style from './style.module.scss'
import { Card, Segmented } from 'antd'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import { useRecoilValue } from 'recoil'
import { pathNameState } from '@/store/appStore'
import utils from '@/tool/myUtils/utils'

const Competition: React.FC = () => {
  const nav = myHooks.useNavTo()
  const pathname = useRecoilValue(pathNameState)

  const type = useMemo(() => utils.getPathArray(pathname)[1], [pathname])

  // useEffect(() => {
  //   navTo('/competition/common/set')
  // }, [])

  const handleSegmentedChange = (value: string) => {
    nav(`/competition/${value}${value === 'common' ? '/set' : ''}`)
  }

  return (
    <Card
      title={
        <div className="flex items-center">
          <MySvgIcon href={`recommand`} size={2}></MySvgIcon>
          <span className="ml-2">{`${options.find((item) => item.value === type)?.label}比赛`}</span>
        </div>
      }
      extra={<Segmented defaultValue={type} options={options} onChange={handleSegmentedChange}></Segmented>}
      className={style.root}
    >
      <Outlet></Outlet>
    </Card>
  )
}

export default Competition

const options = [
  {
    value: 'common',
    label: '普通',
  },
  {
    value: 'random',
    label: '及时',
  },
  {
    value: 'standard',
    label: '标准',
  },
]
