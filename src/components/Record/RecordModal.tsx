import { getProblemTestNumApi } from '@/api/problem'
import { getRecordApi } from '@/api/record'
import { IRecord, IRecordState } from '@/type'
import { Button, Descriptions, Modal, Progress, Result } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'

interface IState extends IRecordState {
  case_id: number
}

interface IProps {
  tabMode: string
  openModal: boolean
  setopenModal: Function
  problem_id: string | undefined
  record: IRecord
  state: IState
}

const RecordModal: React.FC<IProps> = (props) => {
  const { problem_id, openModal, setopenModal, state, record } = props
  const [totalTest, setTotalTest] = useState(0)

  useEffect(() => {
    if (problem_id) {
      getProblemTestNumApi(problem_id).then((res) => {
        setTotalTest(res.data.data.total)
      })
    }
  }, [problem_id, state])

  // useEffect(() => {
  //   if (tabMode === 'records') {
  //     getRecordApi(record?.id).then(res => {
  //       console.log(res.data.data)
  //     })
  //   }
  // }, [tabMode, record])

  const percent = useMemo(() => {
    return Math.floor((state.case_id / totalTest) * 100)
  }, [state, totalTest])

  return (
    <Modal
      open={openModal}
      title=''
      onCancel={() => setopenModal(false)}
      footer={[
        <Button
          key={'tijie'}
          type='primary'
        >
          发布题解
        </Button>,
        <Button
          key={'taolun'}
          type='primary'
        >
          发起讨论
        </Button>
      ]}
      centered
    >
      {state && (
        <div className='flex items-center'>
          <Progress
            size={128}
            type='circle'
            percent={percent}
            strokeColor='#10b981'
            format={() => (
              <Result
                icon={null}
                title={<div className='text-base'>{state.label}</div>}
                subTitle={`${state?.case_id}/${totalTest}`}
                status={state.state}
              ></Result>
            )}
            style={{
              marginRight: 8
            }}
          ></Progress>
          <Descriptions
            layout='vertical'
            style={{
              paddingLeft: '4rem',
              paddingTop: '2rem'
            }}
            column={2}
          >
            <Descriptions.Item label={'执行时间'}>未知</Descriptions.Item>
            <Descriptions.Item label={'内存消耗'}>未知</Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  )
}

export default RecordModal
