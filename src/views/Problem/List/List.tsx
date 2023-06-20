import React, { useEffect, useState } from 'react'
import { getProblemListApi } from '@/api/problem'
import { Col, Skeleton, Table } from 'antd'
import { getRecordApi, getRecordListApi } from '@/api/record'
import Column from 'antd/es/table/Column'
import { useNavigate } from 'react-router-dom'
import AcPercentLabel from './Label/AcPercentLabel'
import { AcDataType, IProblem } from '@/vite-env'

export default function ProblemLIst() {
  const nav = useNavigate()
  const [problemList, setproblemList] = useState<AcDataType[]>([])

  useEffect(() => {
    getProblemListApi()
      .then(async problemsRes => problemsRes.data.data.problems)
      .then(async (problems: IProblem[]) => {
        let index = 0
        const list: AcDataType[] = []
        for (let problem of problems) {
          const res = await Promise.all([
            getRecordListApi({
              problem_id: problem.id
            }),
            getRecordListApi({
              problem_id: problem.id,
              condition: 'Accepted'
              // language: 'C++11'
            })
          ])
          list.push({
            key: String(index),
            index: index + 1,
            title: (
              <div
                className="hover:cursor-pointer text-blue-500"
                onClick={() => toDetail(problem.id as string)}
              >
                {problem.title}
              </div>
            ),
            totaRecords: res[0].data.data.total,
            accpet: res[1].data.data.total,
            acPerc: (
              <AcPercentLabel
                total={res[0].data.data.total}
                accept={res[1].data.data.total}
              ></AcPercentLabel>
            )
          })

          index++
        }
        setproblemList(list)
      })
  }, [])

  const toDetail = (id: string) => {
    nav(`/problem/${id}`)
  }
  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-2/3">
        {problemList.length === 0 ? (
          <Skeleton
            active
            paragraph={{
              rows: 10
            }}
          />
        ) : (
          <Table size="large" dataSource={problemList}>
            <Column
              align="center"
              title="序号"
              dataIndex={'index'}
              key={'index'}
            ></Column>
            <Column
              align="center"
              title="标题"
              dataIndex={'title'}
              key={'title'}
            ></Column>
            <Column
              align="center"
              title="提交次数"
              dataIndex={'totaRecords'}
            ></Column>
            <Column
              align="center"
              title="通过次数"
              dataIndex={'accpet'}
            ></Column>
            <Column align="center" title="ac率" dataIndex={'acPerc'}></Column>
          </Table>
        )}
      </div>
    </div>
  )
}
