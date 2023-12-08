import React, {useEffect, useState, useMemo} from 'react'
import {getProblemNewApi, getProblemNewListApi} from '@/api/problemNew'
import {getRecordListApi} from '@/api/competitionMixture'
import {CompetitionType, ICompetition} from '@/type'
import {useOutletContext, useParams} from 'react-router-dom'
import ProblemStateLabel from '../../component/Label/ProblemStateLabel'
import {CompetitionState} from '@/type'
import {theme} from 'antd'
import Answer, {ChangeOptions} from './component/Answer'
import MyCollapse from '@/components/Collapse/MyCollapse'
import Loading from '@/components/Loading/Loading'
import {useRecoilValue} from 'recoil'
import {
  competitionStateAtom,
  currentCompetitionAtom
} from '@/views/Competition/competitionStore'

interface Problems {
  key: string
  index: number
  score: number | string
  title: string
  state: React.ReactNode
}

const Element: React.FC = () => {
  const competition = useRecoilValue(currentCompetitionAtom)
  const comptitionState = useRecoilValue(competitionStateAtom)
  const [problems, setproblems] = useState<Problems[]>([])
  const {token} = theme.useToken()

  useEffect(() => {
    if (competition && comptitionState) {
      switch (comptitionState) {
        case 'notEnter':
          break
        default:
          fetch()
          break
      }
    }
  }, [competition, comptitionState])

  const items = useMemo(() => {
    return problems.map((item, index) => {
      return {
        key: item.key,
        label: item.title,
        children: (
          <Answer
            problem_id={item.key}
            onStateChange={(options) =>
              answerStateChange(options, index)
            }></Answer>
        ),
        extra: item.state,
        style: {
          marginBottom: 24,
          background: token.colorFillAlter,
          borderRadius: token.borderRadiusLG,
          border: 'none'
        }
      }
    })
  }, [problems])

  const answerStateChange = (options: ChangeOptions, index: number) => {
    const {code, currentState, runResult} = options
    console.log('options ==> ', options)
    const problem = problems[index]
  }

  const fetch = async () => {
    console.log('competition ==> ', competition)
    if (!competition) return
    const res = await getProblemNewListApi(competition.id)
    const problemIds = res.data.data.problemIds
    for (let id of problemIds) {
      const res = await getProblemNewApi(id)
      const res1 = await getRecordListApi(competition.type, competition.id, {
        problem_id: id
      })
      const problem = res.data.data.problem
      const records = res1.data.data.records
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

  const handleCollapseChange = (key: string | string[]) => {}

  return (
    <>
      {items.length <= 0 && <Loading></Loading>}
      {items.length > 0 && (
        <MyCollapse items={items} onChange={handleCollapseChange}></MyCollapse>
      )}
    </>
  )
}

export default Element
