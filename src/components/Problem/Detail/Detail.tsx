import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { showProblemApi } from '@/api/problem'
import Code from '@/components/Editor/Code'
import style from './detail.module.scss'
import { Button, Popover, Segmented, notification } from 'antd'
import { languageList } from '@/components/Editor/LanguageList'
import { Input } from 'antd'
import { createTestApi } from '../../../api/test'
import { createRecordApi } from '@/api/record'
import RunResult from './RunResult'
import { IRecordState, IRunResult, ICaseSample } from '@/vite-env'

type TabMode = 'problem' | 'records'

export default function Detail() {
  const nav = useNavigate()
  const loaction = useLocation()
  const { id } = useParams()
  const [problem, setproblem] = useState<{
    [key: string]: string
  }>()
  const [tabHeadMode, settabHeadMode] = useState<TabMode>(
    loaction.pathname.indexOf('submit') > 0 ? 'records' : 'problem'
  )
  const [caseSamples, setcaseSamples] = useState<Array<ICaseSample>>(
    [] as ICaseSample[]
  )
  const [currentLang, setcurrentLang] = useState(0)
  const [code, setcode] = useState(
    localStorage.getItem(`code-${id}`)
      ? (localStorage.getItem(`code-${id}`) as string)
      : ''
  )
  const [openLanguageList, setopenLanguageList] = useState(false)
  const [showConsole, setshowConsole] = useState(false)
  const [consoleMode, setconsoleMode] = useState<'test' | 'result'>('test')
  const [testTextareaValue, settestTextareaValue] = useState<string>()
  const [runResult, setrunResult] = useState<IRunResult>({} as IRunResult)
  const [currentState, setcurrentState] = useState<IRecordState>({
    value: '',
    label: '待运行',
    state: 'info'
  })
  const { TextArea } = Input
  const rightCtnRef = useRef(null as any)
  const consoleRef = useRef(null as any)
  const consoleFooterRef = useRef(null as any)
  const [codeHeight, setcodeHeight] = useState('50vh')

  useLayoutEffect(() => {
    setcodeHeight(`${resizeEditorHeight()}px`)
    // console.log('route go or back!!!')
  }, [consoleMode, currentState, showConsole])

  useEffect(() => {
    loaction.pathname.indexOf('submit') > 0 ? 'records' : 'problem'
    // console.log('route go or back!!!')
  }, [])

  useEffect(() => {
    window.addEventListener('resize', () => {
      setcodeHeight(`${resizeEditorHeight()}px`)
    })
    showProblemApi(id as string).then(res => {
      const data = res.data.data
      console.log('problem', data)
      setcaseSamples(data.caseSamples)
      setproblem(data.problem)
      settestTextareaValue(data.caseSamples[0].input)
    })
  }, [])

  const resizeEditorHeight = () => {
    const height =
      rightCtnRef.current.clientHeight -
      (consoleRef.current ? consoleRef.current.clientHeight : 0) -
      consoleFooterRef?.current.clientHeight
    return height
  }

  const runCode = () => {
    setcurrentState({
      value: 'Running',
      label: '运行中',
      state: 'waiting'
    })
    setshowConsole(true)
    setconsoleMode('result')

    const data = {
      language: 'C++11',
      code: code,
      input: testTextareaValue,
      time_limit: problem?.time_limit,
      memory_limit: problem?.memory_limit
    }
    createTestApi(JSON.stringify(data)).then(res => {
      setrunResult(res.data.data)

      console.log(res.data)
    })
  }

  const craeteRecord = () => {
    const data = {
      language: 'C++11',
      code: code,
      problem_id: problem?.id
    }
    createRecordApi(JSON.stringify(data)).then(res => {
      console.log(res.data)
      if (res.data.code === 200) {
        notification.success({
          message: res.data.msg,
          placement: 'topRight'
        })
      } else {
        notification.warning({
          message: res.data.msg,
          placement: 'topRight'
        })
      }
    })
  }

  return (
    <div className="flex h-full w-full">
      {/* left */}
      <div className="w-1/2 overflow-scroll">
        {/* header */}
        <div
          className={
            'sticky top-0 z-10 w-full flex items-center bg-gray-100 shadow'
          }
        >
          <Segmented
            defaultValue={tabHeadMode}
            size="large"
            block
            onChange={value => settabHeadMode(value as TabMode)}
            options={[
              {
                label: (
                  <div
                    onClick={() => {
                      settabHeadMode('problem')
                      nav('')
                    }}
                    className="flex items-center"
                  >
                    <svg
                      className="icon"
                      style={{ height: '1rem', width: '1rem' }}
                    >
                      <use href="#icon-tiku"></use>
                    </svg>
                    <span>{problem?.title}</span>
                  </div>
                ),
                value: 'problem' as TabMode
              },
              {
                label: (
                  <div
                    onClick={() => {
                      settabHeadMode('records')
                      nav('submit-records')
                    }}
                    className="flex items-center"
                  >
                    <svg
                      className="icon"
                      style={{ height: '1rem', width: '1rem' }}
                    >
                      <use href="#icon-jilu"></use>
                    </svg>
                    <span>提交记录</span>
                  </div>
                ),
                value: 'records' as TabMode
              }
            ]}
          ></Segmented>
        </div>
        <Outlet context={[problem, caseSamples]}></Outlet>
      </div>
      {/* resize */}
      <div
        className={`h-full w-3 p-0 bg-gray-100 flex flex-col justify-center  items-center  hover:bg-gray-300 hover:shadow transition-all duration-300 ${style.resizeBar}`}
      >
        <svg className="w-4 h-6 " aria-hidden="true">
          <use href="#icon-Scrollvertical"></use>
        </svg>
        <svg className="w-4 h-6" aria-hidden="true">
          <use href="#icon-Scrollvertical"></use>
        </svg>
        <svg className="w-4 h-6" aria-hidden="true">
          <use href="#icon-Scrollvertical"></use>
        </svg>
      </div>
      {/* right */}
      <div className=" w-1/2 h-full flex flex-col">
        {/* header */}
        <div className={'bg-gray-100 p-2 flex items-center'}>
          <Popover
            style={{
              width: '4rem',
              padding: '0'
            }}
            trigger="click"
            open={openLanguageList}
            content={languageList.map((value: any, index: number) => {
              return (
                <div
                  className="px-2 hover:cursor-pointer hover:shadow rounded flex items-center justify-start"
                  onClick={() => {
                    setopenLanguageList(false)
                    setcurrentLang(index)
                  }}
                >
                  <span>{value.label}</span>
                  <span className="px-2"> {value.value}</span>
                </div>
              )
            })}
          >
            <div
              onClick={() => setopenLanguageList(true)}
              className="hover:cursor-pointer hover:shadow flex justify-center items-center px-2 rounded"
            >
              <span>{languageList[currentLang].label}</span>
            </div>
          </Popover>
        </div>
        {/* body */}
        <div
          ref={rightCtnRef}
          className="flex-auto flex flex-col overflow-hidden"
        >
          {/* codeEditor */}
          <div className="flex-auto">
            <Code
              value={code}
              theme="vs-dark"
              language={languageList[currentLang].value}
              className=""
              height={codeHeight}
              width="100%"
              codeChange={(value: string) => {
                localStorage.setItem(`code-${id}`, value)
                setcode(value)
              }}
            ></Code>
          </div>
          {/* console */}
          {showConsole && (
            <div
              ref={consoleRef}
              className=" border border-solid border-gray-300 rounded"
            >
              <Segmented
                options={[
                  {
                    label: '测试用例',
                    value: 'test'
                  },
                  {
                    label: '执行结果',
                    value: 'result'
                  }
                ]}
                value={consoleMode}
                onChange={value => setconsoleMode(value as 'test' | 'result')}
              ></Segmented>
              <div className="w-full">
                {consoleMode === 'test' ? (
                  <div className="p-4">
                    <TextArea
                      value={testTextareaValue}
                      style={{ height: '100%' }}
                      onChange={e => settestTextareaValue(e.target.value)}
                    ></TextArea>
                  </div>
                ) : (
                  <RunResult
                    caseSample={{
                      input: testTextareaValue,
                      output: caseSamples[0]?.output
                    }}
                    runResult={runResult}
                    currentState={currentState}
                    setcurrentState={setcurrentState}
                  ></RunResult>
                )}
              </div>
            </div>
          )}
          {/* footer */}
          <div ref={consoleFooterRef} className="flex items-center py-1">
            <div className="flex-grow">
              <Button onClick={() => setshowConsole(value => !value)}>
                控制台
              </Button>
            </div>
            <div className="">
              <Button onClick={runCode}>执行代码</Button>
              <Button onClick={craeteRecord} className="mx-1" type="primary">
                提交
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
