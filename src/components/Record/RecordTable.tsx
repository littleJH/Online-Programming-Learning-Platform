import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  getRecordListApi as getProRecordListApi,
  getRecordApi,
  hackRecordApi as hackProRecordApi,
  getRecordCaseListApi,
} from '@/api/record'
import { getRecordListApi as getCptRecordListApi, hackRecordApi as hackCptRecordApi } from '@/api/competitionMixture'
import { Descriptions, Modal, Result, Statistic, Table, Tooltip, notification } from 'antd'
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
import style from './style.module.scss'
import MySvgIcon from '../Icon/MySvgIcon'
import { useRecoilValue } from 'recoil'
import { notificationApi } from '@/store/appStore'

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
  const notification = useRecoilValue(notificationApi)
  const [userInfo, setuserInfo] = useState<User>()
  const recordList = useRef<IRecord[]>([])
  const [recordsDatasource, setRecordsDatasource] = useState<IRecordTableDataSource[]>([])
  const [currentRecord, setcurrentRecord] = useState<IRecord>()
  const [hackInput, sethackInput] = useState('')
  const [openRecordDetailModal, setopenRecordDetailModal] = useState(false)
  const [openHackDetailModal, setopenHackDetailModal] = useState(false)
  const [openHackModal, setopenHackModal] = useState(false)
  const [hackDetail, sethackDetail] = useState<IHack>()
  const [currentState, setCurrentState] = useState<IRecordState>()
  const [currentCaseList, setCurrentCaseList] = useState<ICaseTest[]>([])
  const [totalTest, setTotalTest] = useState()
  const [hackLoading, setHackLoading] = useState(false)
  const [filters, setfilters] = useState<Filter[]>([])

  useEffect(() => {
    fetchProblem()
    fetchRecordList()
  }, [problem, competition, mode])

  useEffect(() => {
    fetchUserinfo()
  }, [currentRecord])

  const fetchProblem = () => {
    problem &&
      getProblemTestNumApi(problem.id).then((res) => {
        setTotalTest(res.data.data.total)
      })
  }

  const fetchRecordList = async () => {
    let pro = problem
    if (mode === 'problem' && problem) {
      const res = await getProRecordListApi({
        problem_id: problem.id,
      })
      recordList.current = res.data.data.records
    }
    if (mode === 'competition' && competition) {
      const res = await getCptRecordListApi(competition.type, competition.id, {})
      recordList.current = res.data.data.records
    }
    let hack: HackState = 'unableHack'
    const list: IRecordTableDataSource[] = []
    for (let record of recordList.current) {
      if (mode === 'problem' && problem) {
        hack = await fetchHack(problem.input_check_id, record)
      }
      if (mode === 'competition') {
        const res = await getProblemNewApi(record.problem_id)
        const problem = res.data.data.problem
        pro = problem
        hack = await fetchHack(problem.input_check_id, record)
        setfilters((value: Filter[]) => {
          let repetition = false
          value.forEach((item) => {
            if (item.text === problem.title) repetition = true
          })
          if (repetition) return [...value]
          else
            return [
              ...value,
              {
                text: problem.title,
                value: problem.title,
              },
            ]
        })
      }
      list.push({
        key: record.id,
        condition: <RecordStateLabel value={record.condition}></RecordStateLabel>,
        create_at: record.created_at,
        language: <LanaugeLabel value={record.language}></LanaugeLabel>,
        pass: record.pass,
        problem: pro,
        hack,
      })
    }
    console.log('datasource ==> ', list)
    setRecordsDatasource(list)
  }

  const fetchUserinfo = () => {
    currentRecord &&
      getUserInfoApi(currentRecord.user_id).then((res) => {
        setuserInfo(res.data.data.user)
      })
  }

  const fetchHack = async (input_check_id: string, record: IRecord) => {
    if (input_check_id.indexOf('0000') && record.condition === 'Accepted') {
      const res = await getHackApi(record.hack_id)
      if (res.data.code === 400) return 'notHack'
      else if (res.data.code === 200) {
        sethackDetail(res.data.data.hack)
        return 'hacked'
      } else return 'unableHack'
    } else return 'unableHack'
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

  const submit = () => {
    setHackLoading(true)
    const data = JSON.stringify({
      input: hackInput,
    })
    mode === 'problem' &&
      currentRecord &&
      hackProRecordApi(currentRecord.id, data)
        .then(cb)
        .finally(() => setHackLoading(false))
    mode === 'competition' &&
      currentRecord &&
      competition &&
      hackCptRecordApi(competition?.type, currentRecord.id, data)
        .then(cb)
        .finally(() => setHackLoading(false))

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
    const record = recordList.current.find((item) => item.id === e.key) as IRecord
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
              setcurrentRecord(recordList.current.find((item) => (item.id = record.key)))
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
                  setcurrentRecord(recordList.current.find((item) => (item.id = record.key)))
                  setopenHackModal(true)
                }}
              >
                <MySvgIcon href="hackster" size={2}></MySvgIcon>
              </div>
            )
          case 'hacked':
            return (
              <div
                className="hover:cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  console.log(record)
                  setcurrentRecord(recordList.current.find((item) => (item.id = record.key)))
                  setopenHackDetailModal(true)
                }}
              >
                <MySvgIcon href="choose" size={1.5}></MySvgIcon>
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
    <div className={style.recordTable}>
      <div></div>
      <GeneralTable {...tableProps} />
      <Modal
        width={'800px'}
        title={'骇客提交'}
        open={openHackModal}
        footer={[]}
        onCancel={() => setopenHackModal(false)}
      >
        {userInfo && currentRecord && (
          <Hack
            record={currentRecord}
            hackInput={hackInput}
            sethackInput={sethackInput}
            userInfo={userInfo}
            submit={submit}
            loading={hackLoading}
          ></Hack>
        )}
      </Modal>
      <Modal
        centered
        title={'骇客详情'}
        open={openHackDetailModal}
        width={'800px'}
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
