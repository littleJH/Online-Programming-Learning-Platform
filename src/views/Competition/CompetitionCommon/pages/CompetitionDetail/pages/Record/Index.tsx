import React from 'react'
import RecordTable from '@/components/Record/RecordTable'
import { useRecoilValue } from 'recoil'
import { currentCompetitionAtom } from '@/views/Competition/competitionStore'
import style from '@/views/Competition/style.module.scss'

const Record: React.FC = () => {
  const competition = useRecoilValue(currentCompetitionAtom)

  return (
    <div className={style.record}>
      {competition && <RecordTable mode="competition" competition={competition}></RecordTable>}
    </div>
  )
}

export default Record
