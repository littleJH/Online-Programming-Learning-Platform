import React, { Fragment, useLayoutEffect, useState } from 'react'
import { IRecord } from '@/type'
import { recordStates } from '@/assets/recordStates'
import { theme } from 'antd'
import MyTag from '@/components/Label/MyTag'

type ProblemState = 'unsubmited' | 'unAccepted' | 'accepted'

const ProblemStateLabel: React.FC<{
  problem: any
  records: IRecord[]
}> = (props) => {
  const [element, setelement] = useState<JSX.Element>()
  const { token } = theme.useToken()

  useLayoutEffect(() => {
    if (props.records.length === 0) {
      setelement(<MyTag type={'Info'}>未提交</MyTag>)
    } else {
      let state = 'unAccepted'
      props.records.forEach((record, index) => {
        recordStates.forEach((item, index) => {
          if (item.value === record.condition)
            if (item.state === 'success') {
              console.log(item.state)
              state = 'accepted'
            }
        })
      })
      switch (state) {
        case 'unAccepted':
          setelement(<MyTag type={'Warning'}>未通过</MyTag>)
          break
        case 'accepted':
          setelement(<MyTag type={'Success'}>已通过</MyTag>)
          break

        default:
          break
      }
    }
  }, [props])

  return <div className="w-full flex justify-center">{element}</div>
}

export default ProblemStateLabel
