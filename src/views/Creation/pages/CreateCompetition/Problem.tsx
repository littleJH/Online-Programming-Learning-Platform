import { searchProblemByTextApi, showProblemApi } from '@/api/problem'
import ReadOnly from '@/components/Editor/ReadOnly'
import { Button, InputNumber, List, Select, Spin, notification } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import React, { Fragment, useEffect, useState } from 'react'
import ProblemNew from './ProblemNew'
import {
  getProblemNewApi,
  getProblemNewListApi,
  quoteProblemApi,
  deleteProblemNewApi,
  updateProblemNewApi
} from '@/api/problemNew'
import { ICompetition } from '@/type'

interface IProblem {
  id: string
  score: string | ''
  title: string
  description: string
}

let timeout: ReturnType<typeof setTimeout> | null
let currentValue: string
const competition: ICompetition = localStorage.getItem('competitionInfo')
  ? JSON.parse(localStorage.getItem('competitionInfo') as string)
  : null

const fetch = (value: string, setoptions: Function) => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value
  const fake = () => {
    searchProblemByTextApi(value).then(res => {
      console.log(res)
      if (!res.data.data.problems) {
        setoptions([])
        return
      } else {
        if (currentValue === value) {
          const data = res.data.data.problems.map((item: any, index: any) => ({
            value: item.title,
            label: item.title,
            key: item.id
          }))
          setoptions(data)
        }
      }
    })
  }

  if (value) {
    timeout = setTimeout(fake, 300)
  } else {
    setoptions([])
  }
}

const initProblemList = async (setproblemList: Function) => {
  const { data } = await getProblemNewListApi(competition.id)
  if (data.data.problemIds) {
    data.data.problemIds.forEach(async (id: string, index: number) => {
      const { data } = await getProblemNewApi(id)
      console.log('problemNew', data)
      console.log(data)
      setproblemList((value: IProblem[]) => [
        ...value,
        {
          id: data.data.problem.id,
          score: data.data.problem.score,
          title: data.data.problem.title,
          description: data.data.problem.description
        }
      ])
    })
  }
}

const Problem: React.FC = () => {
  const [problemList, setproblemList] = useState<IProblem[]>([])
  const [searching, setsearching] = useState(false)
  const [options, setoptions] = useState([])
  const [selectValue, setselectValue] = useState()
  const [isModelOpen, setisModelOpen] = useState(false)
  useEffect(() => {
    initProblemList(setproblemList)
  }, [])
  useEffect(() => {
    console.log(problemList)
  }, [problemList])

  const search = (value: string) => {
    fetch(value, setoptions)
  }

  const handleSelect = (option: any) => {
    console.log(option)
    showProblemApi(option.key).then(res => {
      console.log(res)
      setproblemList(value => [
        ...value,
        {
          id: res.data.data.problem.id,
          score: '1',
          title: res.data.data.problem.title,
          description: res.data.data.problem.description
        }
      ])
    })
  }

  const handleDelete = (index: number) => {
    console.log(index)
    setproblemList(value => [
      ...value.slice(0, index),
      ...value.slice(index + 1)
    ])
    deleteProblemNewApi(problemList[index].id).then(res => {
      console.log(res.data)
    })
  }

  const handleScoreChange = async (value: any, index: number) => {
    let resState: {
      code: number
      msg: string
    } = { code: 0, msg: '' }
    const id = problemList[index].id
    const { data } = await getProblemNewApi(id)
    console.log(data)
    if (data.data) {
      const problem = { ...data.data.problem }
      problem.score = value
      delete problem.create_at
      delete problem.id
      delete problem.updated_at
      delete problem.user_id
      await updateProblemNewApi(id, JSON.stringify(problem)).then(res => {
        console.log('update', res)
        resState = {
          code: res.data.code,
          msg: res.data.msg
        }
      })
    } else {
      await quoteProblemApi(competition.id, id, value).then(res => {
        console.log('quote', res)
        console.log(res)
        resState = {
          code: res.data.code,
          msg: res.data.msg
        }
      })
    }
    if (resState.code === 200) {
      notification.success({
        message: resState.msg,
        placement: 'topRight'
      })
    } else {
      notification.warning({
        message: resState.msg,
        placement: 'topRight'
      })
    }
    setproblemList(list => {
      list[index].score = String(value)
      return list
    })
  }
  return (
    <div className="w-full">
      <Select
        size="large"
        showSearch
        mode="multiple"
        value={selectValue}
        placeholder="Search problem ..."
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={search}
        onChange={newValue => setselectValue(newValue)}
        onSelect={handleSelect}
        className="w-full"
        labelInValue
        notFoundContent={searching ? <Spin size="small"></Spin> : null}
        options={options}
        autoFocus={true}
      ></Select>
      {/* <Table dataSource={dataSource}></Table> */}
      <List
        style={{ width: '100%' }}
        itemLayout="horizontal"
        dataSource={problemList}
        renderItem={(item: any, index) => (
          <Fragment>
            <List.Item
              actions={[
                <Button
                  type="text"
                  danger
                  shape="circle"
                  onClick={() => handleDelete(index)}
                  icon={<MinusCircleOutlined />}
                ></Button>
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={<ReadOnly html={item.description}></ReadOnly>}
              ></List.Item.Meta>
              <div className="">
                <span>分数：</span>
                <InputNumber
                  min={0}
                  defaultValue={item.score}
                  onChange={value => handleScoreChange(value, index)}
                ></InputNumber>
              </div>
            </List.Item>
          </Fragment>
        )}
      ></List>
      <div className="w-full flex justify-end">
        <Button
          onClick={() => {
            setisModelOpen(true)
          }}
        >
          创建赛内题目
        </Button>
      </div>
      {isModelOpen && (
        <ProblemNew
          open={isModelOpen}
          setisModelOpen={setisModelOpen}
        ></ProblemNew>
      )}
    </div>
  )
}

export default Problem
