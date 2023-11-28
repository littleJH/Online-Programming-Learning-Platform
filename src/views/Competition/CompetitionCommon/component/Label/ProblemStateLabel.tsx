import React, { Fragment, useLayoutEffect, useState } from 'react'
import { IRecord } from '@/type'
import { recordStates } from '@/assets/recordStates'

type ProblemState = 'unsubmited' | 'unAccepted' | 'accepted'

const ProblemStateLabel: React.FC<{
  problem: any
  records: IRecord[]
}> = props => {
  const [element, setelement] = useState<JSX.Element>()

  useLayoutEffect(() => {
    if (props.records.length === 0) {
      setelement(
        <div className="bg-red-500 rounded text-white text-center w-20">
          未提交
        </div>
      )
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
          setelement(
            <div className="bg-amber-400 rounded text-white text-center w-20">
              未通过
            </div>
          )
          break
        case 'accepted':
          setelement(
            <div className="bg-green-500 rounded text-white text-center w-20">
              已通过
            </div>
          )
          break

        default:
          break
      }
    }
  }, [props])

  return <div className="w-full flex justify-center">{element}</div>
}

export default ProblemStateLabel
