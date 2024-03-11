import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  getProblemCollectNumApi,
  getProblemCollectedApi,
  getProblemLikeNumApi,
  getProblemLikedApi,
  getProblemVisibleNumApi,
  showProblemApi,
} from '@/api/problem'
import style from './style.module.scss'
import { Button, Menu, Modal, Popover, Space, theme } from 'antd'
import { Input } from 'antd'
import { createTestApi } from '@/api/test'
import { createRecordApi, enterPublishRecordWs, getRecordListApi } from '@/api/record'
import RunResult from './RunResult'
import { IRecordState, IRunResult, ICaseSample, IRecord, IProblem } from '@/type'
import RecordModal from '../../components/Record/RecordModal'
import CodeEditor from '@/components/Editor/CodeEditor'
import { recordStates } from '@/assets/recordStates'
import ojmap from '@/assets/ojmap'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import myHooks from '@/tool/myHooks/myHooks'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { languageState, pathNameState } from '@/store/appStore'
import utils from '@/tool/myUtils/utils'
import { footerRightNode } from '@/store/nodeStore'
import { DownOutlined, UpOutlined } from '@ant-design/icons'

interface IState extends IRecordState {
  case_id: number
}
const initTestState: IRecordState = {
  value: '',
  label: '待运行',
  state: 'info',
}

const initRecordState: IState = {
  value: 'Running',
  label: '运行中',
  state: 'info',
  case_id: 0,
}

let resizebar: HTMLElement
let container: HTMLElement

let ws: WebSocket

export const Detail: React.FC = () => {
  const { TextArea } = Input
  const nav = myHooks.useNavTo()
  const pathname = useRecoilValue(pathNameState)
  const { id } = useParams()
  const [problem, setproblem] = useState<IProblem>()
  const [tabHeadMode, settabHeadMode] = useState<string>(utils.getPathArray(pathname)[2])
  const [caseSamples, setcaseSamples] = useState<ICaseSample[]>([])
  const language = useRecoilValue(languageState)
  const [code, setcode] = useState('')
  const [showConsole, setshowConsole] = useState(true)
  const [consoleMode, setconsoleMode] = useState('test')
  const [testTextareaValue, settestTextareaValue] = useState<string>()
  const [runResult, setrunResult] = useState<IRunResult>()
  // const [recordList, setrecordList] = useState<IRecord[]>([])
  const [currentState, setcurrentState] = useState<IRecordState>(initTestState)
  const [currentRecordState, setCurrentRecordState] = useState<IState>(initRecordState)
  const [openRecordModal, setopenRecordModal] = useState(false)
  const [recordResponse, setrecordResponse] = useState<IRecord>()
  const [codeHeight, setcodeHeight] = useState(0)
  const rightCtnRef = useRef(null as any)
  const consoleRef = useRef(null as any)
  const setFooterRight = useSetRecoilState(footerRightNode)
  const { token } = theme.useToken()
  const { connectWs } = myHooks.useWsConnect({
    onOpen,
    onMessage,
    immediately: false,
  })

  useLayoutEffect(() => {
    setcodeHeight(resizeEditorHeight())
  }, [consoleMode, currentState, showConsole, testTextareaValue])

  useEffect(() => {
    setcode(localStorage.getItem(`code-${id}`) || '')
    resizebar = document.querySelector('#resizebar') as HTMLElement
    container = document.querySelector('#container') as HTMLElement
  }, [])

  useEffect(() => {
    problem && setFooterRight(renderFooterRight())
  }, [problem, code, language])

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
        showProblemApi(id),
      ]).then((res) => {
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

  const resizeEditorHeight = () =>
    rightCtnRef.current.clientHeight - (consoleRef.current ? consoleRef.current.clientHeight : 0)

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

  function onOpen() {
    setCurrentRecordState(initRecordState)
  }

  function onMessage(message: any) {
    const state = recordStates.find((item) => item.value === message.condition)
    setCurrentRecordState(() =>
      state
        ? {
            case_id: message.case_id,
            ...state,
          }
        : {
            ...initRecordState,
            case_id: message.case_id,
          }
    )
    // getRecordListApi({
    //   problem_id: id
    // }).then((res) => {
    //   console.log(res.data.data)
    //   setrecordList(res.data.data.records)
    // })
  }

  const renderFooterRight = () => {
    const runCode = () => {
      setshowConsole(true)
      setconsoleMode('result')
      setcurrentState({
        value: 'Running',
        label: '运行中',
        state: 'info',
      })

      const data = {
        language,
        code: code,
        input: testTextareaValue,
        time_limit: problem?.time_limit,
        memory_limit: problem?.memory_limit,
      }
      createTestApi(JSON.stringify(data)).then((res) => {
        setrunResult(res.data.data)

        console.log(res.data)
      })
    }
    const craeteRecord = async () => {
      const data = {
        language,
        code: code,
        problem_id: problem?.id || '',
      }
      localStorage.setItem(`code_${problem?.id}`, code)
      const res = await createRecordApi(JSON.stringify(data))
      if (res.data.code === 200) {
        const record = res.data.data.record
        console.log(res.data)
        connectWs(enterPublishRecordWs(record.id))
        // tabHeadMode === 'records' ? null : nav('records')
        setrecordResponse(record)
        setopenRecordModal(true)
      }
    }
    return (
      <div
        className="flex items-center justify-end px-2 h-12"
        style={{
          boxSizing: 'border-box',
        }}
      >
        <Space>
          <Button
            size="small"
            type="dashed"
            icon={
              showConsole ? (
                <DownOutlined
                  style={{
                    fontSize: '0.75rem',
                  }}
                />
              ) : (
                <UpOutlined
                  style={{
                    fontSize: '0.75rem',
                  }}
                />
              )
            }
            onClick={() => setshowConsole((value) => !value)}
          >
            控制台
          </Button>
          <Button size="small" onClick={runCode}>
            执行代码
          </Button>
          <Button size="small" onClick={craeteRecord} type="primary">
            提交
          </Button>
        </Space>
      </div>
    )
  }

  return (
    <>
      <div
        id="container"
        className="flex h-full w-full"
        style={{
          backgroundColor: token.colorBgBase,
        }}
      >
        {/* left */}
        <div
          className="w-1/2"
          style={{
            resize: 'horizontal',
            minWidth: '256px',
            // maxWidth: '768px'
          }}
        >
          <div className="h-full flex flex-col">
            {/* header */}
            <div className={'w-full bg-slate-50'}>
              <Menu
                mode="horizontal"
                style={{
                  height: '3rem',
                }}
                items={[
                  {
                    label: '题目描述',
                    key: 'description',
                  },
                  {
                    label: '提交记录',
                    key: 'records',
                  },
                ]}
                onClick={(e) => {
                  settabHeadMode(e.key)
                  nav(`${e.key}`)
                }}
                selectedKeys={[tabHeadMode]}
              ></Menu>
            </div>
            {/* body */}
            <div className="grow overflow-scroll">
              <Outlet context={[problem, caseSamples]}></Outlet>
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
          <Space direction="vertical">
            <MySvgIcon href="#icon-Scrollvertical"></MySvgIcon>
            <MySvgIcon href="#icon-Scrollvertical"></MySvgIcon>
            <MySvgIcon href="#icon-Scrollvertical"></MySvgIcon>
          </Space>
        </div>
        {/* right */}
        <div
          className="w-1/2 h-full"
          style={{
            minWidth: '512px',
          }}
        >
          <div ref={rightCtnRef} className="h-full flex flex-col">
            {/* codeEditor */}
            <div
              style={{
                height: '100px',
                flexGrow: '1',
                overflow: 'hidden',
              }}
            >
              <CodeEditor
                height={codeHeight}
                value={code}
                codeChange={(value: string) => {
                  localStorage.setItem(`code-${id}`, value)
                  setcode(value)
                }}
                oj={ojmap.get(id?.slice(0, id.indexOf('-')))}
              ></CodeEditor>
            </div>
            {/* console */}
            {showConsole && (
              <div ref={consoleRef} style={{ height: 'min-content' }}>
                <div>
                  <Menu
                    selectedKeys={[consoleMode]}
                    style={{
                      padding: '0',
                      height: '3rem',
                    }}
                    mode="horizontal"
                    items={[
                      {
                        label: '测试用例',
                        key: 'test',
                      },
                      {
                        label: '执行结果',
                        key: 'result',
                      },
                    ]}
                    onClick={(e) => setconsoleMode(e.key)}
                  ></Menu>
                </div>
                <div className="w-full">
                  <div className="p-4">
                    {consoleMode === 'test' && (
                      <TextArea
                        value={testTextareaValue}
                        autoSize={{
                          minRows: 3,
                        }}
                        onChange={(e) => settestTextareaValue(e.target.value)}
                      ></TextArea>
                    )}
                    {consoleMode === 'result' && (
                      <RunResult
                        caseSample={{
                          input: testTextareaValue,
                          output: caseSamples[0]?.output,
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
          // setrecordList={setrecordList}
        ></RecordModal>
      )}
    </>
  )
}

export default Detail
