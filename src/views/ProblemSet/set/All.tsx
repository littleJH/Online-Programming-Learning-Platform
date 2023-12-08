import ProblemList from '@/components/Problem/list/List'
import React from 'react'

const All: React.FC = () => {
  return (
    <div>
      <ProblemList mode="default" width={768}></ProblemList>
    </div>
  )
}

export default All
