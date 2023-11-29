import { CompetitionState, CompetitionType, HackState, ICompetition, IHack, IRecord, User } from '@/type'
import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import RecordTable from '@/components/Record/RecordTable'

const Record: React.FC = () => {
  const [competition, competitionState, c, type] = useOutletContext<[ICompetition, CompetitionState, any, CompetitionType]>()

  return (
    <RecordTable
      mode='competition'
      competition={competition}
    ></RecordTable>
  )
}

export default Record
