import { Progress, theme } from 'antd'
import React, { Fragment, useLayoutEffect, useMemo, useState } from 'react'

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
}> = (props) => {
  const { total, accept } = props
  const [exitRecord, setexitRecord] = useState<boolean>()
  const { token } = theme.useToken()
  // const [exitAccept, setexitAccept] = useState<boolean>()
  // const [progress, setprogress] = useState<Progress>()

  useLayoutEffect(() => {
    if (total === 0) {
      setexitRecord(false)
    } else {
      setexitRecord(true)
      // setprogress({
      //   accept: {
      //     value: accept,
      //     multiplyingPower: accept
      //   },
      //   notAccept: {
      //     value: total - accept,
      //     multiplyingPower: total - accept
      //   }
      // })
    }
  }, [total, accept])

  const percent = useMemo(() => {
    return Math.floor((accept / total) * 100)
  }, [])

  return (
    <div className='flex justify-center  text-slate-100 text-sm '>
      {exitRecord && (
        // <Fragment>
        //   <div
        //     className="bg-green-500  rounded-l-full"
        //     style={{
        //       flexGrow: progress?.accept.multiplyingPower
        //     }}
        //   >
        //     {progress?.accept.value}
        //   </div>
        //   <div
        //     className="bg-red-400 rounded-r-full"
        //     style={{
        //       flexGrow: progress?.notAccept.multiplyingPower
        //     }}
        //   >
        //     {progress?.notAccept.value}
        //   </div>
        // </Fragment>
        <Progress
          type='line'
          percent={percent}
          strokeColor={token.colorSuccess}
          trailColor={token.colorError}
          format={(percent) => <div className='text-xs'>{`${accept}/${total}`}</div>}
        ></Progress>
      )}
      {/* {exitRecord && !exitAccept && (
        <div className="bg-red-500 text-slate-100 rounded px-4 w-full">
          暂无通过
        </div>
      )} */}
      {!exitRecord && (
        // <div className="bg-yellow-200 text-slate-600  rounded-full px-4 w-full h-6">
        //   暂无提交
        // </div>
        <Progress
          type='line'
          percent={percent}
          trailColor={token.colorWarning}
          format={(percent) => <div className='text-xs'>{`${accept}/${total}`}</div>}
        ></Progress>
      )}
    </div>
  )
}

export default AcPercentLabel
