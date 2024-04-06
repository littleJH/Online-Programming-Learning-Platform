import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ICaseSample, IProblem } from '@/type'
import ProblemDetail from '@/components/Problem/Detail/ProblemDetail'

const Description: React.FC = () => {
  const [problem, caseSamples] = useOutletContext<[IProblem, ICaseSample[]]>()

  return (
    <div className="">
      <ProblemDetail mode="problem" problem={problem} caseSamples={caseSamples}></ProblemDetail>
    </div>
  )
}

export default Description
