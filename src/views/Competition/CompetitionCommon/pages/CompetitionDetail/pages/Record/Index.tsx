import React from 'react'
import RecordTable from '@/components/Record/RecordTable'
import { useRecoilValue } from 'recoil'
import { currentCompetitionAtom } from '@/views/Competition/competitionStore'

const Record: React.FC = () => {
  const competition = useRecoilValue(currentCompetitionAtom)

  return <>{competition && <RecordTable mode="competition" competition={competition}></RecordTable>}</>
}

export default Record
