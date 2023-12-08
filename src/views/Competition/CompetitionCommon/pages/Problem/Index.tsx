import React, {useEffect, useState, useMemo} from 'react'
import {getProblemNewApi, getProblemNewListApi} from '@/api/problemNew'
import {getRecordListApi} from '@/api/competitionMixture'
import {CompetitionType, ICompetition} from '@/type'
import {Outlet, useOutletContext} from 'react-router-dom'
import ProblemStateLabel from '../../component/Label/ProblemStateLabel'
import {CompetitionState} from '@/type'
import {Collapse, Table} from 'antd'
import Answer from './component/Answer'

interface Problems {
  key: string
  index: number
  score: number | string
  title: string
  state: JSX.Element
}

const Element: React.FC = () => {
  const [competition, comptitionState, setanswering, type] =
    useOutletContext<
      [ICompetition, CompetitionState, Function, CompetitionType]
    >()
  const [problems, setproblems] = useState<Problems[]>([])

  useEffect(() => {
    switch (comptitionState) {
      case 'notEnter':
        break
      default:
        fetch(competition)
        break
    }
  }, [])

  const items = useMemo(() => {
    if (!problems) return []
    return problems.map((item, index) => {
      return {
        key: item.key,
        label: item.title,
        children: <Answer problem_id={item.key}></Answer>
      }
    })
  }, [problems])

  const fetch = async (competition: ICompetition) => {
    const res = await getProblemNewListApi(competition.id)
    const problemIds = res.data.data.problemIds
    for (let id of problemIds) {
      const res = await Promise.all([
        getProblemNewApi(id),
        getRecordListApi(type, competition.id, {
          problem_id: id
        })
      ])
      const problem = res[0].data.data.problem
      const records = res[1].data.data.records
      setproblems((value: Problems[]) => [
        ...value,
        {
          key: id,
          index: value.length ? value[value.length - 1].index + 1 : 1,
          score: '',
          title: problem.title,
          state: (
            <ProblemStateLabel
              problem={problem}
              records={records}></ProblemStateLabel>
          )
        }
      ])
    }
  }

  const handleCollapseChange = (key: string | string[]) => {
    
  }

  return <Collapse items={items} onChange={handleCollapseChange}></Collapse>
}

export default Element
