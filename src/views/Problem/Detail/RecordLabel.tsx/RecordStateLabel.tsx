import React, { useEffect, useState } from 'react'
import { recordStates } from '@/assets/recordStates'

const RecordStateLabel: React.FC<{
  value: string
  setopenModal: Function
}> = props => {
  const [classname, setclassname] = useState<string>('bg-gray-500')

  useEffect(() => {
    recordStates.forEach(item => {
      if (props.value === item.value) {
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
    <div
      className=" flex justify-center"
      onClick={() => {
        props.setopenModal(true)
      }}
    >
      <div
        className={`${classname} p-2 text-gray-200 rounded`}
        style={{ width: '200px' }}
      >
        {props.value}
      </div>
    </div>
  )
}

export default RecordStateLabel
