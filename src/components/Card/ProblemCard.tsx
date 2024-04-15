import { IProblem } from '@/type'
import { Card } from 'antd'
import React, { useEffect } from 'react'
import GeneralCard from './GeneralCard'

interface Iprops {
  problemProps: any
  onclick?: Function
  mode?: 'default' | 'action'
}

const ProbemCard: React.FC<Iprops> = (props) => {
  const { problemProps, onclick, mode = 'default' } = props

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async () => {}
  return (
    <div>
      <Card onClick={() => onclick && onclick(problemProps)} className="my-2" hoverable size="small">
        <GeneralCard
          title={problemProps.title}
          content={problemProps.description}
          labels={problemProps.labels}
          header={problemProps.acPerc}
        ></GeneralCard>
      </Card>
    </div>
  )
}

export default ProbemCard
