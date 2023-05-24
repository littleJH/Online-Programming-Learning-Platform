import React from 'react'
import ReadOnly from '@/components/Editor/ReadOnly'
import { useOutletContext } from 'react-router-dom'
import { ICompetition } from '@/vite-env'

const Overview: React.FC = () => {
  const [competition] = useOutletContext<[ICompetition]>()
  return (
    <div>
      {competition && (
        <ReadOnly
          className="p-4"
          value={JSON.parse(competition.content as string)}
        ></ReadOnly>
      )}
    </div>
  )
}

export default Overview
