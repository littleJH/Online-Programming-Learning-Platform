import React, { useEffect, useMemo } from 'react'
import ReadOnly from '@/components/editor/ReadOnly'
import { useOutletContext } from 'react-router-dom'
import { ICompetition } from '@/type'

const Overview: React.FC = () => {
  const [competition] = useOutletContext<[ICompetition]>()

  const content = useMemo(() => {
    if (competition) {
      const content = competition.content as string
      let obj: { type: 'String' | 'Descendant'; value: string } = {
        type: 'String',
        value: content
      }
      if (content.includes('[{')) {
        obj.type = 'Descendant'
      }
      return obj
    }
  }, [competition])
  return (
    <div>
      {content && content.type === 'Descendant' && (
        <ReadOnly
          className="p-4"
          html={JSON.parse(content.value as string)}
        ></ReadOnly>
      )}
      {content && content.type === 'String' && (
        <ReadOnly className="p-4" html={content.value}></ReadOnly>
      )}
    </div>
  )
}

export default Overview
