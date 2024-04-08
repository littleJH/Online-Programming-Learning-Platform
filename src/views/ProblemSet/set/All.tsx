import ProblemList from '@/components/Problem/list/List'
import React from 'react'
import style from '../style.module.scss'

const All: React.FC = () => {
  return (
    <div className={style.listCtn}>
      <ProblemList mode="default"></ProblemList>
    </div>
  )
}

export default All
