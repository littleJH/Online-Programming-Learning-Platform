import React, { useLayoutEffect } from 'react'
import { Spin } from 'antd'
import { IRunResult, IRecordState } from '@/type'
import { recordStates } from '@/assets/recordStates'

interface IProps {
  caseSample: {
    input: string | undefined
    output: string | undefined
  }
  runResult: IRunResult | undefined
  currentState: IRecordState
  setcurrentState: Function
}

const RunResult: React.FC<IProps> = props => {
  const { caseSample, runResult, currentState, setcurrentState } = props

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
    <div className="w-full h-full flex ">
      {/* left */}
      <div className="">
        {currentState.state === 'info' ? (
          <Spin size="large"></Spin>
        ) : (
          <div className="h-12 pr-4 flex items-center">
            <svg className="w-12" aria-hidden="true">
              {/* {currentState.state === 'info' && <use href="#icon-info"></use>} */}
              {currentState.state === 'success' && (
                <use href="#icon-success"></use>
              )}
              {currentState.state === 'error' && <use href="#icon-error"></use>}
            </svg>
          </div>
        )}
      </div>
      <div className="w-full">
        {(currentState.state === 'error' || currentState.state === 'info') && (
          <div className="h-12 flex items-center">{currentState.label}</div>
        )}
        {currentState.state === 'success' && runResult && (
          <div className="">
            <div className="">
              <span>Time：{runResult.time}</span>
              <span className="ml-4">Memory：{runResult.memory}</span>
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
                  }`}
                >
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
