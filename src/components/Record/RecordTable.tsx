import React, { useEffect, useMemo, useState } from 'react'
import {
  getRecordListApi as getProRecordListApi,
  getRecordApi,
  hackRecordApi as hackProRecordApi,
  getRecordCaseListApi,
} from '@/api/record'
import { getRecordListApi as getCptRecordListApi, hackRecordApi as hackCptRecordApi } from '@/api/competitionMixture'
import { Descriptions, Modal, Result, Statistic, Table, Tooltip, notification } from 'antd'
import Column from 'antd/es/table/Column'
import RecordStateLabel from './RecordLabel.tsx/RecordStateLabel'
import LanaugeLabel from './RecordLabel.tsx/LanaugeLabel'
import {
  HackState,
  ICaseTest,
  ICompetition,
  IHack,
  IProblem,
  IRecord,
  IRecordState,
  IRecordTableDataSource,
  User,
} from '@/type'
import Hack from './Hack'
import { getUserInfoApi } from '@/api/user'
import { getHackApi } from '@/api/hack'
import HackDetail from './HackDetail'
import { recordStates } from '@/assets/recordStates'
import { getProblemTestNumApi } from '@/api/problem'
import { getProblemNewApi } from '@/api/problemNew'
import GeneralTable, { GeneralTableProps } from '../table/GeneralTable'

interface IProps {
  mode: 'problem' | 'competition'
  problem?: IProblem
  competition?: ICompetition
}

interface Filter {
  text: string
  value: string
}

const RecordTable: React.FC<IProps> = (props) => {
  const { mode, problem, competition } = props
  const [recordList, setrecordList] = useState<IRecord[]>([])
  const [userInfo, setuserInfo] = useState<User>()
  const [currentRecord, setcurrentRecord] = useState<IRecord>()
  const [hackInput, sethackInput] = useState('')
  const [openRecordDetailModal, setopenRecordDetailModal] = useState(false)
  const [openHackDetailModal, setopenHackDetailModal] = useState(false)
  const [openHackModal, setopenHackModal] = useState(false)
  const [hackDetail, sethackDetail] = useState<IHack>()
  const [currentState, setCurrentState] = useState<IRecordState>()
  const [currentCaseList, setCurrentCaseList] = useState<ICaseTest[]>([])
  const [totalTest, setTotalTest] = useState()
  const [filters, setfilters] = useState<Filter[]>([])

  useEffect(() => {
    fetchProblem()
    fetchRecordList()
  }, [problem])

  useEffect(() => {
    fetchUserinfo()
  }, [currentRecord])

  const fetchProblem = () => {
    problem &&
      getProblemTestNumApi(problem.id).then((res) => {
        setTotalTest(res.data.data.total)
      })
  }

  const fetchRecordList = () => {
    if (mode === 'problem' && problem) {
      getProRecordListApi({
        problem_id: problem.id,
      }).then((res) => {
        setrecordList(res.data.data.records)
      })
    }
    if (mode === 'competition' && competition) {
      getCptRecordListApi(competition.type, competition.id, {}).then((res) => {
        setrecordList(res.data.data.records)
      })
    }
  }

  const fetchUserinfo = () => {
    currentRecord &&
      getUserInfoApi(currentRecord.user_id).then((res) => {
        setuserInfo(res.data.data.user)
      })
  }

  const caseTableDataSource = useMemo(() => {
    interface IDs {
      key: string
      input: string
      time: number
      memory: number
    }
    const arr: IDs[] = []
    currentCaseList?.forEach((item) => {
      arr.push({
        key: String(item.cid),
        input: item.input,
        time: item.time,
        memory: item.memory,
      })
    })
    return arr
  }, [currentCaseList])

  const recordsDatasource = useMemo(() => {
    let hack: HackState = 'unableHack'
    const list: IRecordTableDataSource[] = []
    for (let record of recordList) {
      if (mode === 'problem' && problem) fetchHack(problem.input_check_id)
      if (mode === 'competition') {
        getProblemNewApi(record.problem_id).then((res) => {
          const pro = res.data.data.probleml
          fetchHack(pro.input_check_id)
          setfilters((value: Filter[]) => {
            let repetition = false
            value.forEach((item) => {
              if (item.text === pro.title) repetition = true
            })
            if (repetition) return [...value]
            else
              return [
                ...value,
                {
                  text: pro.title,
                  value: pro.title,
                },
              ]
          })
        })
      }
      function fetchHack(input_check_id: string) {
        if (input_check_id.indexOf('0000') && record.condition === 'Accepted') {
          getHackApi(record.hack_id).then((res) => {
            if (res.data.code === 400) hack = 'notHack'
            else if (res.data.code === 200) {
              console.log('hackDetail: ', res)
              sethackDetail(res.data.data.hack)
              hack = 'hacked'
            }
          })
        } else hack = 'unableHack'
        list.push({
          key: record.id,
          condition: <RecordStateLabel value={record.condition}></RecordStateLabel>,
          create_at: record.created_at,
          language: <LanaugeLabel value={record.language}></LanaugeLabel>,
          pass: record.pass,
          problem,
          hack: hack,
        })
      }
    }
    console.log('datasource ==> ', list)
    return list
  }, [recordList, problem, competition])

  const submit = () => {
    const data = JSON.stringify({
      input: hackInput,
    })
    mode === 'problem' && currentRecord && hackProRecordApi(currentRecord.id, data).then(cb)
    mode === 'competition' &&
      currentRecord &&
      competition &&
      hackCptRecordApi(competition?.type, currentRecord.id, data).then(cb)

    function cb(res: any) {
      if (res.data.code === 200) {
        notification &&
          notification.success({
            message: res.data.msg,
          })
      } else {
        notification &&
          notification.warning({
            message: res.data.msg,
          })
      }
    }
  }

  const handleRowClick = (e: IRecordTableDataSource) => {
    const record = recordList.find((item) => item.id === e.key) as IRecord
    console.log(record)
    setCurrentState(() => recordStates.find((item) => item.value === record.condition))
    getRecordCaseListApi(e.key).then((res) => {
      console.log(res.data.data)
      res.data.code === 200 ? setCurrentCaseList(res.data.data.cases) : setCurrentCaseList([])
    })
    setopenRecordDetailModal(true)
  }

  const problemColumn = [
    {
      align: 'center',
      dataIndex: ['problem', 'title'],
      title: '题目',
      filters: filters,
      onFilter: (value: string, record: any) => record.problem.title.indexOf(value) === 0,
      filterMultiple: true,
      render: (value: string, record: any) => {
        return (
          <div
            className="hover:cursor-pointer"
            onClick={() => {
              setcurrentRecord(recordList[record.index])
              setopenRecordDetailModal(true)
            }}
          >
            {value}
          </div>
        )
      },
    },
  ]

  const columns = [
    {
      align: 'center',
      dataIndex: 'condition',
      title: '提交状态',
    },
    {
      align: 'center',
      dataIndex: 'language',
      title: '语言',
    },
    {
      align: 'center',
      dataIndex: 'pass',
      title: '通过用例',
    },
    {
      align: 'center',
      dataIndex: 'create_at',
      title: '提交时间',
    },
    {
      align: 'center',
      dataIndex: 'hack',
      title: '骇客',
      render: (value: HackState, record: any) => {
        switch (value) {
          case 'notHack':
            return (
              <div
                className="hover:cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  setcurrentRecord(recordList[record.index])
                  setopenHackModal(true)
                }}
              >
                <svg className="icon">
                  <use href="#icon-hackster"></use>
                </svg>
              </div>
            )
          case 'hacked':
            return (
              <div
                className="hover:cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  setcurrentRecord(recordList[record.index])
                  setopenHackDetailModal(true)
                }}
              >
                <svg
                  className="icon"
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                  }}
                >
                  <use href="#icon-choose"></use>
                </svg>
              </div>
            )
          default:
            break
        }
      },
    },
  ]

  const tableProps: GeneralTableProps = {
    dataSource: recordsDatasource,
    columns: mode === 'competition' ? [...problemColumn, ...columns] : columns,
    style: {
      minWidth: 'max-content',
    },
    onRow: (record: any) => {
      return {
        onClick: () => handleRowClick(record),
      }
    },
  }

  const caseTableProps: GeneralTableProps = {
    dataSource: caseTableDataSource,
    columns: [
      {
        align: 'center',
        dataIndex: 'input',
        title: '用例输入',
      },
      {
        align: 'center',
        dataIndex: 'time',
        title: '执行时间',
        render: (value: any) => <span>{value}（ms）</span>,
      },
      {
        align: 'center',
        dataIndex: 'memory',
        title: '内存消耗',
        render: (value: any) => <span>{value}（kb）</span>,
      },
    ],
  }

  return (
    <div className="" style={{}}>
      <div></div>
      <GeneralTable {...tableProps} />
      <Modal title={'骇客'} open={openHackModal} footer={[]} onCancel={() => setopenHackModal(false)}>
        {userInfo && currentRecord && (
          <Hack
            record={currentRecord}
            hackInput={hackInput}
            sethackInput={sethackInput}
            userInfo={userInfo}
            submit={submit}
          ></Hack>
        )}
      </Modal>
      <Modal
        centered
        title={'骇客'}
        open={openHackDetailModal}
        footer={[]}
        onCancel={() => setopenHackDetailModal(false)}
      >
        {hackDetail && currentRecord && <HackDetail hack={hackDetail} record={currentRecord}></HackDetail>}
      </Modal>
      <Modal centered open={openRecordDetailModal} onCancel={() => setopenRecordDetailModal(false)} footer={null}>
        <pre>
          <code>{currentRecord?.code}</code>
        </pre>
        <Result
          status={currentState?.state}
          title={currentState?.label}
          extra={
            currentCaseList.length !== 0 && (
              <Statistic
                title="通过测试用例数"
                value={currentState?.state === 'success' ? currentCaseList.length : currentCaseList.length - 1}
                suffix={`/${totalTest}`}
              ></Statistic>
            )
          }
        ></Result>

        {currentState?.state === 'success' && <GeneralTable {...caseTableProps}></GeneralTable>}
        {currentState?.state === 'error' && currentCaseList.length !== 0 && (
          <Descriptions title="未通过用例" size="small" layout="vertical" column={2} bordered>
            <Descriptions.Item label={'用例输入'}>
              {currentCaseList[currentCaseList.length - 1].input}
            </Descriptions.Item>
            <Descriptions.Item label={'用例输出'}>
              {currentCaseList[currentCaseList.length - 1].output}
            </Descriptions.Item>
            <Descriptions.Item label={'执行时间'}>
              {currentCaseList[currentCaseList.length - 1].time}（ms）
            </Descriptions.Item>
            <Descriptions.Item label={'内存消耗'}>
              {currentCaseList[currentCaseList.length - 1].memory}（ms）
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default RecordTable
