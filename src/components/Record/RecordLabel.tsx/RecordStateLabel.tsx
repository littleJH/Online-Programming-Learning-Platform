import React, { useEffect, useState } from 'react'
import { recordStates } from '@/assets/recordStates'
import { Tooltip } from 'antd'

const RecordStateLabel: React.FC<{
  value: string
}> = props => {
  const [classname, setclassname] = useState<string>('bg-slate-500')
  const [tooltipTitle, settooltipTitle] = useState('')

  useEffect(() => {
    recordStates.forEach(item => {
      if (props.value === item.value) {
        settooltipTitle(item.label)
        switch (item.state) {
          case 'error':
            setclassname('bg-red-500')
            break
          case 'warning':
            setclassname('bg-yellow-500')
            break
          case 'success':
            setclassname('bg-green-500')
            break
          default:
            break
        }
      }
    })
  }, [])

  return (
    <div className="flex justify-center select-none mx-4">
      <Tooltip title={tooltipTitle}>
        <div
          className={`${classname} py-1 px-2 text-white rounded`}
          style={{
            width: '128px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {props.value}
        </div>
      </Tooltip>
    </div>
  )
}

export default RecordStateLabel
