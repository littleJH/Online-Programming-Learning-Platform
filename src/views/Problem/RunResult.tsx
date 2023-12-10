import React, {useLayoutEffect} from 'react'
import {Spin, theme} from 'antd'
import {IRunResult, IRecordState} from '@/type'
import {recordStates} from '@/assets/recordStates'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import Loading from '@/components/Loading/Loading'

interface IProps {
  caseSample: {
    input: string | undefined
    output: string | undefined
  }
  runResult: IRunResult | undefined
  currentState: IRecordState
  setcurrentState: Function
}

const iconSize = 2

const RunResult: React.FC<IProps> = (props) => {
  const {caseSample, runResult, currentState, setcurrentState} = props
  const {token} = theme.useToken()

  useLayoutEffect(() => {
    if (runResult) {
      console.log(runResult)
      recordStates.forEach((item: IRecordState) => {
        if (item.value === runResult.condition) {
          setcurrentState(item)
        }
      })
    }
  }, [runResult])

  return (
    <div className='w-full h-full flex '>
      {/* left */}
      <div className='h-12 pr-4 flex items-center'>
        {currentState.state === 'info' && currentState.value === '' && (
          <MySvgIcon
            href='#icon-info'
            size={iconSize}
            color={token.colorInfo}></MySvgIcon>
        )}
        {currentState.state === 'info' && currentState.value !== '' && (
          <Loading></Loading>
        )}
        {currentState.state === 'error' && (
          <MySvgIcon
            href='#icon-error'
            size={iconSize}
            color={token.colorError}></MySvgIcon>
        )}
        {currentState.state === 'success' && (
          <MySvgIcon
            href='#icon-success'
            size={iconSize}
            color={token.colorSuccess}></MySvgIcon>
        )}
      </div>
      <div className='w-full'>
        {(currentState.state === 'error' || currentState.state === 'info') && (
          <div className='h-12 flex items-center'>{currentState.label}</div>
        )}
        {currentState.state === 'success' && runResult && (
          <div className=''>
            <div className=''>
              <span>Time：{runResult.time}</span>
              <span className='ml-4'>Memory：{runResult.memory}</span>
            </div>
            <div>
              <p>
                <span>输入：</span>
                <span>{caseSample.input}</span>
              </p>
              <p>
                <span>输出：</span>
                <span>{caseSample.output}</span>
              </p>
              <p>
                <span>当前输出：</span>
                <span
                  className={`rounded ${
                    runResult.output === caseSample.output
                      ? 'bg-green-300'
                      : 'bg-red-300'
                  }`}>
                  {runResult.output}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RunResult
