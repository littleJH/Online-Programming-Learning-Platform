import { Menu, Modal } from 'antd'
import { ICompetition } from '@/type'
import { Suspense, lazy, useState } from 'react'
import Competition from './Competition'
import Problem from './Problem'

interface Iprops {
  competition: ICompetition | undefined
  setcompetition: Function
  openUpdateModal: boolean
  setopenUpdateModal: Function
}

const Update: React.FC<Iprops> = props => {
  const { competition, setcompetition, openUpdateModal, setopenUpdateModal } =
    props
  const [current, setcurrent] = useState<'competition' | 'problem'>(
    'competition'
  )
  return (
    <div>
      <Modal
        width={800}
        title="修改比赛"
        open={openUpdateModal}
        onCancel={() => setopenUpdateModal(false)}
        footer={[]}
      >
        <Menu
          selectedKeys={[current]}
          mode="horizontal"
          items={[
            {
              key: 'competition',
              label: (
                <div
                  onClick={() => {
                    setcurrent('competition')
                  }}
                >
                  比赛信息
                </div>
              )
            },
            {
              key: 'problem',
              label: (
                <div
                  onClick={() => {
                    setcurrent('problem')
                  }}
                >
                  题目列表
                </div>
              )
            }
          ]}
        ></Menu>
        {current === 'competition' && (
          <Competition
            competition={competition}
            setcompetition={setcompetition}
          ></Competition>
        )}
        {current === 'problem' && <Problem competition={competition}></Problem>}
      </Modal>
    </div>
  )
}

export default Update
