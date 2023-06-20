import React, { useLayoutEffect } from 'react'
import { Spin } from 'antd'
import ReadOnly from '@/components/Editor/ReadOnly'
import { IRunResult, IRecordState } from '@/vite-env'
import { recordStates } from '@/assets/recordStates'

interface IProps {
  caseSample: {
    input: string | undefined
    output: string | undefined
  }
  runResult: IRunResult
  currentState: IRecordState
  setcurrentState: Function
}

const RunResult: React.FC<IProps> = props => {
  const { caseSample, runResult, currentState, setcurrentState } = props

  useLayoutEffect(() => {
    console.log(runResult)
    recordStates.forEach((item: IRecordState) => {
      if (item.value === runResult.condition) {
        setcurrentState(item)
      }
    })
  }, [runResult])

  return (
    <div className="w-full h-full flex ">
      {/* left */}
      <div className="p-4">
        {currentState.state === 'waiting' ? (
          <Spin size="large"></Spin>
        ) : (
          <svg className="icon" aria-hidden="true">
            {currentState.state === 'info' && <use href="#icon-info"></use>}
            {currentState.state === 'success' && (
              <use href="#icon-success"></use>
            )}
            {currentState.state === 'error' && <use href="#icon-error"></use>}
          </svg>
        )}
      </div>
      <div className="w-full">
        {(currentState.state === 'error' || currentState.state === 'info') && (
          <ReadOnly className="py-2" text={[currentState.label]}></ReadOnly>
        )}
        {currentState.state === 'success' && (
          <div className="p-4">
            <div className="">
              <span>Time:&nbsp;{runResult.time}</span>
              <span className="ml-4">Memory:&nbsp;{runResult.memory}</span>
            </div>
            <div>
              <p>
                <span>Input:&nbsp;</span>
                <span>{caseSample.input}</span>
              </p>
              <p>
                <span>Output:&nbsp;</span>
                <span>{runResult.output}</span>
              </p>
              <p>
                <span>Currect output:&nbsp;</span>
                <span
                  className={`bg-gray-100 rounded p-2 ${
                    runResult.output === caseSample.output
                      ? 'bg-green-300'
                      : 'bg-red-300'
                  }`}
                >
                  {caseSample.output}
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
