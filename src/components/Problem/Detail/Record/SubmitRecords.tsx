import React, { useEffect, useState } from 'react'
import {
  getRecordListApi,
  getRecordApi,
  getRecordCaseApi,
  hackRecordApi
} from '@/api/record'
import { useOutletContext, useParams } from 'react-router-dom'
import { Modal, Table, notification } from 'antd'
import Column from 'antd/es/table/Column'
import RecordStateLabel from '../RecordLabel.tsx/RecordStateLabel'
import LanaugeLabel from '../RecordLabel.tsx/LanaugeLabel'
import {
  HackState,
  IHack,
  IRecord,
  IRecordTableDataSource,
  User
} from '@/vite-env'
import Hack from '@/components/Competition/Detail/Content/Record/Hack'
import { getUserInfoApi } from '@/api/user'
import { getHackApi } from '@/api/hack'
import HackDetail from './HackDetail'

const SubmitRecords: React.FC = () => {
  const [problem] = useOutletContext<[any]>()
  const [dataSource, setdataSource] = useState<IRecordTableDataSource[]>([])
  const [recordList, setrecordList] = useState<IRecord[]>([])
  const [openHackModal, setopenHackModal] = useState(false)
  const [openHackDetailModal, setopenHackDetailModal] = useState(false)
  const [currentRecord, setcurrentRecord] = useState<IRecord>({} as IRecord)
  const [hackInput, sethackInput] = useState('')
  const [hackDetail, sethackDetail] = useState<IHack>({} as IHack)
  const [userInfo, setuserInfo] = useState<User>({} as User)

  useEffect(() => {
    problem ? fetch() : null
  }, [problem])
  useEffect(() => {
    if (currentRecord.user_id) {
      getUserInfoApi(currentRecord.user_id).then(res => {
        setuserInfo(res.data.data.user)
      })
    }
  }, [currentRecord])

  const fetch = async () => {
    const { data } = await getRecordListApi({
      problem_id: problem.id
    })
    console.log(data)
    setrecordList(data.data.records)
    let hack: HackState = 'unableHack'
    data.data.records.forEach(async (record: IRecord, index: number) => {
      if (
        problem.input_check_id.indexOf('0000') &&
        record.condition === 'Accepted'
      ) {
        await getHackApi(record.hack_id).then(res => {
          if (res.data.code === 400) hack = 'notHack'
          else if (res.data.code === 200) {
            console.log('hackDetail: ', res)
            sethackDetail(res.data.data.hack)
            hack = 'hacked'
          }
        })
      } else hack = 'unableHack'

      setdataSource((value: any) => [
        ...value,
        {
          index,
          key: record.id,
          condition: (
            <RecordStateLabel
              setopenModal={() => {}}
              value={record.condition}
            ></RecordStateLabel>
          ),
          create_at: record.created_at,
          language: <LanaugeLabel value={record.language}></LanaugeLabel>,
          pass: record.pass,
          hack
        }
      ])
    })
  }

  const submit = () => {
    const data = {
      input: hackInput
    }
    hackRecordApi(currentRecord.id, JSON.stringify(data)).then(res => {
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
  return (
    <div>
      <Table dataSource={dataSource}>
        <Column
          align="center"
          width={200}
          dataIndex={'condition'}
          title="提交状态"
        ></Column>
        <Column align="center" dataIndex={'language'} title="语言"></Column>
        <Column align="center" dataIndex={'pass'} title="通过用例"></Column>
        <Column
          align="center"
          dataIndex={'create_at'}
          title="提交时间"
        ></Column>
        <Column
          align="center"
          dataIndex={'hack'}
          title="骇客"
          render={(value: HackState, record: any) => {
            switch (value) {
              case 'notHack':
                return (
                  <div
                    className="hover:cursor-pointer"
                    onClick={() => {
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
                    onClick={() => {
                      setcurrentRecord(recordList[record.index])
                      setopenHackDetailModal(true)
                    }}
                  >
                    <svg
                      className="icon"
                      style={{
                        width: '1.5rem',
                        height: '1.5rem'
                      }}
                    >
                      <use href="#icon-choose"></use>
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
      <Modal
        title={'骇客'}
        open={openHackDetailModal}
        footer={[]}
        onCancel={() => setopenHackDetailModal(false)}
      >
        <HackDetail hack={hackDetail} record={currentRecord}></HackDetail>
      </Modal>
    </div>
  )
}

export default SubmitRecords
