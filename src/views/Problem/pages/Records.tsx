import { IProblem } from '@/type'
import React, { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import RecordTable from '@/components/Record/RecordTable'

const Records: React.FC = () => {
  const [problem] = useOutletContext<[IProblem]>()

  return <RecordTable mode="problem" problem={problem}></RecordTable>
}

export default Records
