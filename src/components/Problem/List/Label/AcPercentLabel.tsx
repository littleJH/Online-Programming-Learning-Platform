import React, { Fragment, useLayoutEffect, useState } from 'react'

interface Progress {
  accept: {
    value: number
    multiplyingPower: number
  }
  notAccept: {
    value: number
    multiplyingPower: number
  }
}

const AcPercentLabel: React.FC<{
  total: number
  accept: number
}> = props => {
  const { total, accept } = props
  const [exitRecord, setexitRecord] = useState<boolean>()
  const [exitAccept, setexitAccept] = useState<boolean>()
  const [progress, setprogress] = useState<Progress>()

  useLayoutEffect(() => {
    if (total === 0) {
      setexitRecord(false)
    } else {
      setexitRecord(true)
      if (accept === 0) {
        setexitAccept(false)
      } else {
        setexitAccept(true)
        setprogress({
          accept: {
            value: accept,
            multiplyingPower: accept
          },
          notAccept: {
            value: total - accept,
            multiplyingPower: total - accept
          }
        })
      }
    }
  }, [total, accept])

  return (
    <div className="flex justify-center w-full text-gray-100 text-sm ">
      {exitRecord && exitAccept && (
        <Fragment>
          <div
            className="bg-green-500  rounded-l-full"
            style={{
              flexGrow: progress?.accept.multiplyingPower
            }}
          >
            {progress?.accept.value}
          </div>
          <div
            className="bg-red-400 rounded-r-full"
            style={{
              flexGrow: progress?.notAccept.multiplyingPower
            }}
          >
            {progress?.notAccept.value}
          </div>
        </Fragment>
      )}
      {exitRecord && !exitAccept && (
        <div className="bg-red-500 text-gray-100 rounded px-4 w-full">
          暂无通过
        </div>
      )}
      {!exitRecord && (
        <div className="bg-yellow-200 text-gray-600  rounded px-4 w-full">
          暂无提交
        </div>
      )}
    </div>
  )
}

export default AcPercentLabel
