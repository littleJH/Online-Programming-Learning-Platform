import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import Column from 'antd/es/table/Column'
import { useNavigate, useOutletContext } from 'react-router-dom'

interface Problems {
  key: string
  index: number
  score: number | string
  title: string
  state: JSX.Element
}

const Element: React.FC = () => {
  const nav = useNavigate()
  const [problems, setanswering] = useOutletContext<[Problems[], Function]>()
  const [dataSource, setdataSource] = useState<Problems[]>()

  useEffect(() => {
    setdataSource(problems)
  }, [problems])

  const toDetail = (value: any, record: any) => {
    nav(`${record.key}`)
    setanswering(true)
  }
  return (
    <Table dataSource={dataSource} pagination={false}>
      <Column align="center" dataIndex={'index'} title={'序号'}></Column>
      <Column
        align="center"
        dataIndex={'title'}
        title={'标题'}
        render={(value: any, record: any) => {
          return (
            <div
              className="hover:cursor-pointer"
              onClick={() => toDetail(value, record)}
            >
              {value}
            </div>
          )
        }}
      ></Column>
      <Column align="center" dataIndex={'state'} title={'状态'}></Column>
    </Table>
  )
}

export default Element
