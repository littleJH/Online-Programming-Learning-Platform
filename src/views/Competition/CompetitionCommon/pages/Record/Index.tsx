// import { getRecordListApi, hackRecordApi } from '@/api/competitionMixture'
import {
  CompetitionState,
  CompetitionType,
  HackState,
  ICompetition,
  IHack,
  IRecord,
  User
} from '@/type'
import React, {useEffect, useState} from 'react'
import {useOutletContext, useParams} from 'react-router-dom'
// import { IRecordTableDataSource } from '@/type'
// import { Table, Modal, Switch, Input, notification } from 'antd'
// import Column from 'antd/es/table/Column'
// import LanaugeLabel from '@/components/Record/RecordLabel.tsx/LanaugeLabel'
// import { getProblemNewApi } from '@/api/problemNew'
// import Hack from '../../../../../components/Record/Hack'
// import { getUserInfoApi } from '@/api/user'
// import RecordStateLabel from '@/components/Record/RecordLabel.tsx/RecordStateLabel'
// import { getHackApi } from '@/api/hack'
// import NoData from '@/components/Empty/NoData'
// import { notificationApi } from '@/store/appStore'
// import { useRecoilValue } from 'recoil'
import RecordTable from '@/components/Record/RecordTable'
import {useRecoilValue} from 'recoil'
import {currentCompetitionAtom} from '@/views/Competition/competitionStore'

// interface Filter {
//   text: string
//   value: string
// }

const Record: React.FC = () => {
  const competition = useRecoilValue(currentCompetitionAtom)
  // const [mode, setmode] = useState<'self' | 'all'>('self')
  // const [recordList, setrecordList] = useState<IRecord[]>([])
  // const [openRecordModal, setopenRecordModal] = useState(false)
  // const [openHackModal, setopenHackModal] = useState(false)
  // const [dataSource, setdataSource] = useState<IRecordTableDataSource[]>([])
  // const [filters, setfilters] = useState<Filter[]>([])
  // const [currentRecord, setcurrentRecord] = useState<IRecord>({} as IRecord)
  // const [hackInput, sethackInput] = useState('')
  // const [hackDetail, sethackDetail] = useState<IHack>({} as IHack)
  // const [userInfo, setuserInfo] = useState<User>({} as User)
  // const notification = useRecoilValue(notificationApi)

  // useEffect(() => {
  //   type && fetch()
  // }, [mode, type])

  // useEffect(() => {
  //   if (currentRecord.user_id) {
  //     getUserInfoApi(currentRecord.user_id).then((res) => {
  //       setuserInfo(res.data.data.user)
  //     })
  //   }
  // }, [currentRecord])

  // const fetch = async () => {
  //   const { data } = await getRecordListApi(type, competition.id, {})
  //   console.log(data.data)
  //   setrecordList(data.data.records)
  //   data.data.records.forEach(async (record: any, index: number) => {
  //     const { data } = await getProblemNewApi(record.problem_id)
  //     const problem = data.data.problem
  //     let hack: HackState = 'unableHack'
  //     if (problem.input_check_id.indexOf('0000') && record.condition === 'Accepted') {
  //       await getHackApi(record.hack_id).then((res) => {
  //         if (res.data.code === 400) hack = 'notHack'
  //         else if (res.data.code === 200) {
  //           console.log('hackDetail: ', res)
  //           sethackDetail(res.data.data.hack)
  //           hack = 'hacked'
  //         }
  //       })
  //     } else hack = 'unableHack'
  //     setdataSource((value: any) => [
  //       ...value,
  //       {
  //         key: record.id,
  //         condition: <RecordStateLabel value={record.condition}></RecordStateLabel>,
  //         create_at: record.created_at,
  //         language: <LanaugeLabel value={record.language}></LanaugeLabel>,
  //         pass: record.pass,
  //         problem,
  //         hack
  //       }
  //     ])
  //     setfilters((value: Filter[]) => {
  //       let repetition = false
  //       value.forEach((item) => {
  //         if (item.text === problem.title) repetition = true
  //       })
  //       if (repetition) return [...value]
  //       else
  //         return [
  //           ...value,
  //           {
  //             text: problem.title,
  //             value: problem.title
  //           }
  //         ]
  //     })
  //   })
  // }

  // const handleClick = (record: any) => {
  //   setcurrentRecord(recordList[record.index])
  //   setopenRecordModal(true)
  // }

  // const submit = () => {
  //   const data = {
  //     input: hackInput
  //   }

  //   hackRecordApi(type, currentRecord.id, JSON.stringify(data)).then((res) => {
  //     console.log(res)
  //     if (res.data.code === 200) {
  //       notification &&
  //         notification.success({
  //           message: res.data.msg
  //         })
  //     } else {
  //       notification &&
  //         notification.warning({
  //           message: res.data.msg
  //         })
  //     }
  //   })
  // }

  return (
    <>
      {competition && (
        <RecordTable mode='competition' competition={competition}></RecordTable>
      )}
      {/* <div>
        <div>
        <Switch checkedChildren={'个人'} unCheckedChildren={'全部'}  checked={ mode === 'all' ? true : false}></Switch>
      </div>
        <Table
          dataSource={dataSource}
          locale={{
            emptyText: <NoData text='暂无数据' />
          }}
        >
          <Column
            align='center'
            dataIndex={['problem', 'title']}
            title='题目'
            filters={filters}
            onFilter={(value, record: any) => record.problem.title.indexOf(value) === 0}
            filterMultiple
            render={(value, record) => {
              return (
                <div
                  className='hover:cursor-pointer'
                  onClick={() => handleClick(record)}
                >
                  {value}
                </div>
              )
            }}
          ></Column>
          <Column
            align='center'
            dataIndex={'condition'}
            title='提交状态'
          ></Column>
          <Column
            align='center'
            dataIndex={'language'}
            title='语言'
          ></Column>
          <Column
            align='center'
            dataIndex={'pass'}
            title='通过用例'
          ></Column>
          <Column
            align='center'
            dataIndex={'create_at'}
            title='提交时间'
          ></Column>
          <Column
            align='center'
            dataIndex={'hack'}
            title='骇客'
            render={(value, record: any) => {
              switch (value) {
                case 'notHack':
                  return (
                    <div
                      className='hover:cursor-pointer'
                      onClick={() => {
                        setcurrentRecord(recordList[record.index])
                        setopenHackModal(true)
                      }}
                    >
                      <svg className='icon'>
                        <use href='#icon-hackster'></use>
                      </svg>
                    </div>
                  )
                case 'hacked':
                  return (
                    <div
                      className='hover:cursor-pointer'
                      onClick={() => {
                        setcurrentRecord(recordList[record.index])
                      }}
                    >
                      <svg
                        className='icon'
                        style={{
                          width: '1.5rem',
                          height: '1.5rem'
                        }}
                      >
                        <use href='#icon-choose'></use>
                      </svg>
                    </div>
                  )
                default:
                  break
              }
            }}
          ></Column>
        </Table>
        <Modal
          title={'code'}
          open={openRecordModal}
          footer={[]}
          onCancel={() => setopenRecordModal(false)}
        >
          <pre>
            <code>{currentRecord?.code}</code>
          </pre>
        </Modal>
        <Modal
          title={'骇客'}
          open={openHackModal}
          footer={[]}
          onCancel={() => setopenHackModal(false)}
        >
          <Hack
            record={currentRecord}
            hackInput={hackInput}
            sethackInput={sethackInput}
            userInfo={userInfo}
            submit={submit}
          ></Hack>
        </Modal>
      </div> */}
    </>
  )
}

export default Record
