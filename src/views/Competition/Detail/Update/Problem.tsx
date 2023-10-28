import React, { useEffect, useState, Fragment } from 'react'
import {
  getProblemNewApi,
  getProblemNewListApi,
  quoteProblemApi,
  deleteProblemNewApi
} from '@/api/problemNew'
import { MinusCircleOutlined } from '@ant-design/icons'
import { searchProblemByTextApi, showProblemApi } from '@/api/problem'
import { Button, InputNumber, List, Select, Spin, notification } from 'antd'
import ProblemNew from '../../../Creation/pages/CreateCompetition/ProblemNew'
import ReadOnly from '@/components/Editor/ReadOnly'
import { ICompetition } from '@/type'
interface IProblem {
  id: string
  score: string | ''
  title: string
  description: string
}

interface Iprops {
  competition: ICompetition | undefined
}

let currentValue: string
let timeout: ReturnType<typeof setTimeout> | null

const fetch = (value: string, setoptions: Function) => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value
  const fake = () => {
    searchProblemByTextApi(value).then((res: any) => {
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

const initProblemList = async (
  competition: ICompetition,
  setproblemList: Function
) => {
  const { data } = await getProblemNewListApi(competition.id)
  if (data.data.problemIds) {
    data.data.problemIds.forEach(async (id: string, index: number) => {
      const { data } = await getProblemNewApi(id)
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

const Problem: React.FC<Iprops> = props => {
  const { competition } = props
  const [problemList, setproblemList] = useState<IProblem[]>([])
  const [searching, setsearching] = useState(false)
  const [options, setoptions] = useState([])
  const [selectValue, setselectValue] = useState()
  const [isModelOpen, setisModelOpen] = useState(false)
  useEffect(() => {}, [competition])

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

  const submit = (problemId: string, score: string) => {
    quoteProblemApi(competition?.id as string, problemId, score).then(res => {
      console.log(res)
      if (res.data.code === 200) {
        notification.success({
          message: res.data.msg,
          placement: 'topRight'
        })
      } else {
        notification.warning({
          message: res.data.msg,
          placement: 'topRight'
        })
      }
    })
  }

  const handleScoreChange = (value: any, index: number) => {
    submit(problemList[index].id, value)
    {
      setproblemList(list => {
        list[index].score = String(value)
        return list
      })
    }
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
