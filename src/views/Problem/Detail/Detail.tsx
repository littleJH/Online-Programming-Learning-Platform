import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  getProblemCollectNumApi,
  getProblemCollectedApi,
  getProblemLikeNumApi,
  getProblemLikedApi,
  getProblemVisibleNumApi,
  showProblemApi
} from '@/api/problem'
import style from './style.module.scss'
import { Button, Menu, Modal, Popover, Space, notification } from 'antd'
import { Input } from 'antd'
import { createTestApi } from '@/api/test'
import {
  createRecordApi,
  enterPublishRecordWs,
  getRecordApi,
  getRecordListApi
} from '@/api/record'
import RunResult from './RunResult'
import {
  IRecordState,
  IRunResult,
  ICaseSample,
  IRecord,
  IProblem
} from '@/type'
import RecordModal from './Record/RecordModal'
import CodeEditor from '@/components/Editor/CodeEditor'
import { useRecoilValue } from 'recoil'
import { monacoConfigState } from '@/store/appStore'
import { recordStates } from '@/assets/recordStates'
import ojmap from '@/assets/ojmap'

interface IState extends IRecordState {
  case_id: number
}
type TabMode = '' | 'records'

const initTestState: IRecordState = {
  value: '',
  label: '待运行',
  state: 'info'
}

const initRecordState: IState = {
  value: 'Running',
  label: '运行中',
  state: 'info',
  case_id: 0
}

let resizebar: HTMLElement
let container: HTMLElement

let ws: WebSocket

export const Detail: React.FC = () => {
  const { TextArea } = Input
  const nav = useNavigate()
  const loaction = useLocation()
  const { id } = useParams()
  const [problem, setproblem] = useState<IProblem>()
  const [tabHeadMode, settabHeadMode] = useState<TabMode>()
  const [caseSamples, setcaseSamples] = useState<ICaseSample[]>([])
  const [language, setLanguage] = useState()
  const [code, setcode] = useState('')
  const [showConsole, setshowConsole] = useState(true)
  const [consoleMode, setconsoleMode] = useState<'test' | 'result'>('test')
  const [testTextareaValue, settestTextareaValue] = useState<string>()
  const [runResult, setrunResult] = useState<IRunResult>()
  const [recordList, setrecordList] = useState<IRecord[]>([])
  const [currentState, setcurrentState] = useState<IRecordState>(initTestState)
  const [currentRecordState, setCurrentRecordState] =
    useState<IState>(initRecordState)
  const [openRecordModal, setopenRecordModal] = useState(false)
  const [recordResponse, setrecordResponse] = useState<IRecord>()
  const [codeHeight, setcodeHeight] = useState(0)
  const rightCtnRef = useRef(null as any)
  const consoleRef = useRef(null as any)
  const consoleFooterRef = useRef(null as any)

  useLayoutEffect(() => {
    setcodeHeight(resizeEditorHeight())
  }, [consoleMode, currentState, showConsole])

  useEffect(() => {
    settabHeadMode(loaction.pathname.indexOf('records') > 0 ? 'records' : '')
    const code = localStorage.getItem(`code_${id}`)
    setcode(code ? code : '')
    resizebar = document.querySelector('#resizebar') as HTMLElement
    container = document.querySelector('#container') as HTMLElement
  }, [])

  useEffect(() => {
    window.addEventListener('resize', () => {
      setcodeHeight(resizeEditorHeight())
    })
    if (id) {
      Promise.all([
        getProblemLikedApi(id),
        getProblemLikeNumApi(id, 'true'),
        getProblemLikeNumApi(id, 'false'),
        getProblemCollectedApi(id),
        getProblemCollectNumApi(id),
        getProblemVisibleNumApi(id),
        showProblemApi(id)
      ]).then(res => {
        const data = res[6].data.data
        setcaseSamples(data.caseSamples)
        settestTextareaValue(data.caseSamples[0].input)
        const problemObj = data.problem
        problemObj.liked = res[0].data.data.like
        problemObj.likeNum = res[1].data.data.total
        problemObj.dislikeNum = res[2].data.data.total
        problemObj.collected = res[3].data.data.collect
        problemObj.collectNum = res[4].data.data.total
        problemObj.visibleNum = res[5].data.data.total
        setproblem(problemObj)
      })
    }
  }, [id])

  const resizeEditorHeight = () => {
    const height =
      rightCtnRef.current.clientHeight -
      (consoleRef.current ? consoleRef.current.clientHeight : 0) -
      consoleFooterRef?.current.clientHeight
    return height
  }

  const runCode = useCallback(() => {
    setcurrentState({
      value: 'Running',
      label: '运行中',
      state: 'info'
    })
    setshowConsole(true)
    setconsoleMode('result')

    const data = {
      language,
      code: code,
      input: testTextareaValue,
      time_limit: problem?.time_limit,
      memory_limit: problem?.memory_limit
    }
    createTestApi(JSON.stringify(data)).then(res => {
      setrunResult(res.data.data)

      console.log(res.data)
    })
  }, [code, testTextareaValue, problem])

  const craeteRecord = useCallback(() => {
    const data = {
      language,
      code: code,
      problem_id: problem?.id
    }
    localStorage.setItem(`code_${problem?.id}`, code)
    createRecordApi(JSON.stringify(data)).then(res => {
      console.log(res.data)
      openConnect(res.data.data.record.id)
      // tabHeadMode === 'records' ? null : nav('records')
      setrecordResponse(res.data.data.record)
      setopenRecordModal(true)
    })
  }, [code, problem])

  const handleResizeMousemove = (e: MouseEvent) => {
    console.log(e.clientX)
    console.log(container.clientWidth)
    resizebar.style.transform = `tranfromX()`
  }

  const removeResizeListener = () => {
    resizebar.removeEventListener('mousemove', handleResizeMousemove)
  }
  const addResizeListener = (e: any) => {
    resizebar.addEventListener('mousemove', handleResizeMousemove)
  }

  const openConnect = useCallback((id: string) => {
    ws = enterPublishRecordWs(id)
    ws.onopen = e => handleConnectOpen(e)
    ws.onmessage = e => handleConnectMessage(e)
    ws.onclose = e => handleConnectClose(e)
  }, [])

  const handleConnectOpen = useCallback((e: Event) => {
    setCurrentRecordState(initRecordState)
    console.log('Connection open...', e)
  }, [])

  const handleConnectClose = useCallback((e: Event) => {
    console.log('Connection Closed...', e)
  }, [])

  const handleConnectMessage = useCallback(
    (e: MessageEvent) => {
      const message = JSON.parse(e.data)
      console.log('message', message)
      const state = recordStates.find(item => item.value === message.condition)
      setCurrentRecordState(() =>
        state
          ? {
              case_id: message.case_id,
              ...state
            }
          : {
              ...initRecordState,
              case_id: message.case_id
            }
      )
      getRecordListApi({
        problem_id: id
      }).then(res => {
        console.log(res.data.data)
        setrecordList(res.data.data.records)
      })
    },
    [id, tabHeadMode]
  )

  return (
    <>
      <div id="container" className="flex h-full w-full">
        {/* left */}
        <div
          className="w-1/2"
          style={{
            resize: 'horizontal',
            minWidth: '256px'
            // maxWidth: '768px'
          }}
        >
          <div className="h-full flex flex-col">
            {/* header */}
            <div className={'w-full bg-slate-50'}>
              <Menu
                mode="horizontal"
                style={{
                  height: '3rem'
                }}
                items={[
                  {
                    label: '题目描述',
                    key: ''
                  },
                  {
                    label: '提交记录',
                    key: 'records'
                  }
                ]}
                className="bg-slate-50"
                onClick={e => {
                  settabHeadMode(e.key as TabMode)
                  nav(`${e.key}`)
                }}
                activeKey={tabHeadMode}
              ></Menu>
            </div>
            {/* body */}
            <div className="grow overflow-scroll">
              <Outlet
                context={[problem, caseSamples, recordList, setrecordList]}
              ></Outlet>
            </div>
            {/* footer */}
            {/* {problem && id && (
              <LeftFooter
                problem_id={id}
                problem={problem}
                setProblem={setproblem}
              ></LeftFooter>
            )} */}
          </div>
        </div>
        {/* resize */}
        <div
          id="resizebar"
          className={`h-full w-3 bg-slate-50 flex flex-col justify-center  items-center  hover:bg-slate-300 hover:shadow transition-all duration-300 ${style.resizeBar}`}
          onMouseDown={addResizeListener}
          onMouseUp={removeResizeListener}
          onMouseLeave={removeResizeListener}
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
        <div
          className="w-1/2 h-full flex flex-col"
          style={{
            minWidth: '512px'
          }}
        >
          <div
            ref={rightCtnRef}
            className="flex-auto flex flex-col overflow-hidden"
          >
            {/* codeEditor */}
            <div className="flex-auto">
              <CodeEditor
                height={codeHeight}
                value={code}
                setCodeLanguage={setLanguage}
                codeChange={(value: string) => {
                  localStorage.setItem(`code_${id}`, value)
                  setcode(value)
                }}
                oj={ojmap.get(id?.slice(0, id.indexOf('-')))}
              ></CodeEditor>
            </div>
            {/* console */}
            {showConsole && (
              <div ref={consoleRef} className="">
                <Menu
                  activeKey={consoleMode}
                  style={{
                    padding: '0'
                  }}
                  mode="horizontal"
                  items={[
                    {
                      label: '测试用例',
                      key: 'test'
                    },
                    {
                      label: '执行结果',
                      key: 'result'
                    }
                  ]}
                  onClick={e => setconsoleMode(e.key as 'test' | 'result')}
                ></Menu>
                <div className="w-full h-40 ">
                  <div className="h-full p-4  overflow-scroll">
                    {consoleMode === 'test' ? (
                      <TextArea
                        value={testTextareaValue}
                        autoSize={{
                          minRows: 3
                        }}
                        onChange={e => settestTextareaValue(e.target.value)}
                      ></TextArea>
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
              </div>
            )}
            {/* footer */}
            <div
              ref={consoleFooterRef}
              className="flex items-center px-2 h-12  bg-slate-50"
              style={{
                boxSizing: 'border-box'
              }}
            >
              <div className="flex-grow">
                <Button
                  size="small"
                  onClick={() => setshowConsole(value => !value)}
                >
                  控制台
                </Button>
              </div>
              <Space>
                <Button size="small" onClick={runCode}>
                  执行代码
                </Button>
                <Button size="small" onClick={craeteRecord} type="primary">
                  提交
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </div>
      {recordResponse && (
        <RecordModal
          tabMode={tabHeadMode}
          record={recordResponse}
          problem_id={problem?.id}
          openModal={openRecordModal}
          setopenModal={setopenRecordModal}
          state={currentRecordState}
          setrecordList={setrecordList}
        ></RecordModal>
      )}
    </>
  )
}

export default Detail
