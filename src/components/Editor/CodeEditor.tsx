import Editor, { Monaco, useMonaco } from '@monaco-editor/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Loading from '@/components/Loading/Loading'
import { Modal, Select, Button, theme, Space, Dropdown, Result, Switch } from 'antd'
import { languageList, languagesMap, ojLanguagesObject, poj_languageList } from '@/components/Editor/LanguageList'
import { getCurrentUserinfo, updateInfoApi } from '@/api/user'
import CodeEditorConfig from '@/components/Editor/CodeEditorConfig'
import { useRecoilState, useRecoilValue } from 'recoil'
import { languageState, monacoOptionsState, monacoThemeState, notificationApi, userInfoState } from '@/store/appStore'
import MySvgIcon from '../Icon/MySvgIcon'
import { cpp } from '@/config/config'
import { changeCodeLanguageApi, getCodeCommentApi, getCodeFormNoteApi, getNoteFormCodeApi } from '@/api/chatGpt'
import { LoadingOutlined, SwapRightOutlined } from '@ant-design/icons'
import { editor } from 'monaco-editor'
import Highlight from './Highlight'
import utils from '@/tool/myUtils/utils'
import { useParams } from 'react-router-dom'
import { showProblemApi } from '@/api/problem'
import { recordStates } from '@/assets/recordStates'

interface Iprops {
  value: string
  className?: string
  height: number
  codeChange: Function
  onLanguageChange?: Function
  oj?: string
}

const CodeEditor: React.FC<Iprops> = (props: Iprops) => {
  const { height, value, className, codeChange, oj, onLanguageChange } = props
  const monaco = useMonaco()
  const { id = '' } = useParams()
  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const [openConfigModal, setopenConfigModal] = useState(false)
  const [openExchangeModal, setOpenExchangeModal] = useState(false)
  const [openCommentModal, setOpenCommentModal] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [info, setInfo] = useRecoilState(userInfoState)
  const [monacoOptions, setMonacoOptions] = useRecoilState(monacoOptionsState)
  const [language, setLanguage] = useRecoilState(languageState)
  const [exchangeLanguages, setExchangeLanguages] = useState([language, language])
  const [exchangeResult, setExchangeResult] = useState('')
  const [commentResult, setCommentResult] = useState<any>()
  const [monacoTheme, setMonacoTheme] = useRecoilState(monacoThemeState)
  const [loading, setLoading] = useState(false)
  const { token } = theme.useToken()
  const notification = useRecoilValue(notificationApi)
  const [showSourceCode, setShowSourceCode] = useState(false)

  useEffect(() => console.log('language ==> ', language), [language])

  const languageOptions = useMemo(
    () => ojLanguagesObject[`${oj?.toLowerCase()}_languageList`] || ojLanguagesObject['defaultLanguageList'],
    [oj]
  )

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor
    editor.onDidChangeCursorSelection((e: editor.ICursorSelectionChangedEvent) => {
      const selectedText = editor.getModel()?.getValueInRange(e.selection)
      if (selectedText) setSelectedText(selectedText)
    })
  }

  const handleLanguageChange = (value: any) => {
    setLanguage(value)
    onLanguageChange && onLanguageChange(value)
  }

  const handleMonacoThemeChange = () => {
    setMonacoTheme((value) => (value === 'vs-dark' ? 'light' : 'vs-dark'))
  }

  const updateConfig = () => {
    let newInfo = {
      ...info,
      monaco_options: JSON.stringify(monacoOptions),
    }
    if (language) newInfo = { ...newInfo, language }
    if (monacoTheme) newInfo = { ...newInfo, monaco_theme: monacoTheme }
    updateInfoApi(JSON.stringify(newInfo)).then(async (res) => {
      if (res.data.code === 200) {
        const res = await getCurrentUserinfo()
        setInfo(res.data.data.user)
      }
    })
  }

  const noteFromCode = async () => {
    try {
      setLoading(true)
      const res = (await getNoteFormCodeApi(language, value)).data.data.res
      codeChange(res)
    } finally {
      setLoading(false)
    }
  }

  const codeFromNote = async () => {
    if (!selectedText) {
      notification &&
        notification.warning({
          message: '请选择源文本',
          duration: 1,
        })
      return
    }

    try {
      setLoading(true)
      const res = (await getCodeFormNoteApi(language, selectedText)).data.data.res
      insertTextBelowSelected(res)
    } finally {
      setLoading(false)
    }
  }

  const exchangeCode = async () => {
    try {
      setLoading(true)
      const res = (await changeCodeLanguageApi(exchangeLanguages[0], exchangeLanguages[1], value)).data.data.res
      setExchangeResult(res)
      if (res) {
        const bool = utils.copyToClipboard(res)
        bool &&
          notification &&
          notification.success({
            message: '已将转换结果复制到剪切板',
            duration: 1,
          })
      }
    } finally {
      setLoading(false)
    }
  }

  const commentCode = async () => {
    try {
      setLoading(true)
      const res = await showProblemApi(id)
      if (res.data.code === 200) {
        const data = {
          problem: res.data.data.problem,
          code: value,
        }
        const result = (await getCodeCommentApi(language, data)).data.data
        setCommentResult(result)
        setOpenCommentModal(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const insertTextBelowSelected = (text: string) => {
    if (!editorRef.current || !monaco) return
    const editor = editorRef.current
    const selection = editor.getSelection()
    const endLineNumber = selection?.endLineNumber

    const model = editor.getModel()
    const lineCount = model?.getLineCount()

    const newLineNumber = endLineNumber ? endLineNumber + 1 : lineCount ? lineCount - 1 : 1
    const newColumn = 1

    model?.applyEdits([
      {
        range: new monaco.Range(newLineNumber, newColumn, newLineNumber, newColumn),
        text,
      },
    ])
  }
  return (
    <>
      <div
        style={{
          height: `${height}px`,
        }}
      >
        <div
          className={'h-12 p-2 flex items-center'}
          style={{
            backgroundColor: token.colorPrimaryBg,
          }}
        >
          <Select
            style={{
              minWidth: 'max-content',
            }}
            dropdownStyle={{
              minWidth: 'max-content',
            }}
            variant={'borderless'}
            defaultValue={language}
            options={languageOptions}
            onChange={handleLanguageChange}
          ></Select>
          <div className="grow"></div>
          <Space>
            <Button
              type="text"
              className="flex items-center"
              icon={<MySvgIcon href="chexiao" size={2}></MySvgIcon>}
              onClick={() => {
                // editorRef.current && editorRef.current.trigger('keyboard', 'undo', null)
              }}
            ></Button>
            <Button
              type="text"
              className="flex items-center"
              icon={<MySvgIcon href="huifu" size={2}></MySvgIcon>}
            ></Button>
            <Dropdown
              disabled={loading}
              arrow
              menu={{
                items: [
                  {
                    key: 'note',
                    label: '生成注释',
                    onClick: () => {
                      noteFromCode()
                    },
                  },
                  {
                    key: 'code',
                    label: '生成代码',
                    onClick: () => {
                      codeFromNote()
                    },
                  },
                  {
                    key: 'exchange',
                    label: '代码转换',
                    onClick: () => {
                      setOpenExchangeModal(true)
                    },
                  },
                  {
                    key: 'comment',
                    label: '代码编写意见',
                    onClick: () => {
                      commentCode()
                    },
                  },
                ],
              }}
            >
              <Button
                icon={!loading ? <MySvgIcon href="chatGPT" size={2}></MySvgIcon> : <LoadingOutlined />}
                type="text"
                className="flex items-center"
                disabled={loading}
              ></Button>
            </Dropdown>
            <Button
              icon={
                <MySvgIcon
                  href={`#icon-${monacoTheme === 'light' ? 'light' : 'vs-dark'}`}
                  size={2}
                  color={`${monacoTheme === 'light' ? '#fff' : '#000'}`}
                ></MySvgIcon>
              }
              type="text"
              className="flex items-center"
              onClick={handleMonacoThemeChange}
            ></Button>
            <Button
              icon={<MySvgIcon href="#icon-setting" size={2}></MySvgIcon>}
              type="text"
              className="flex items-center"
              onClick={() => setopenConfigModal(true)}
            ></Button>
          </Space>
        </div>
        <Editor
          value={value}
          height={`${height - 42}px`}
          width="100%"
          className={`${className} bg-white`}
          language={cpp.includes(language) ? 'cpp' : languagesMap.get(language)}
          theme={monacoTheme}
          loading={<Loading></Loading>}
          onChange={(value) => codeChange(value)}
          options={monacoOptions}
          onMount={handleEditorDidMount}
        />
      </div>
      <Modal
        title={<p>代码编辑器配置</p>}
        open={openConfigModal}
        onCancel={() => setopenConfigModal(false)}
        afterClose={() => updateConfig()}
        footer={[]}
        centered
      >
        <div
          style={{
            maxHeight: '50vh',
            overflowY: 'scroll',
          }}
        >
          <CodeEditorConfig monacoOptions={monacoOptions} setMonacoOptions={setMonacoOptions}></CodeEditorConfig>
        </div>
      </Modal>
      <Modal
        title="代码转换"
        width={'80vw'}
        open={openExchangeModal}
        onCancel={() => {
          setOpenExchangeModal(false)
        }}
        afterClose={() => {
          setExchangeResult('')
        }}
        maskClosable={false}
        footer={[
          <Button key={1} type="primary" onClick={() => setOpenExchangeModal(false)}>
            取消
          </Button>,
          <Button key={2} type="primary" onClick={exchangeCode} loading={loading}>
            开始转换
          </Button>,
        ]}
        centered
      >
        <div>
          <Space size={'large'} align="center" className="justify-center flex">
            <Select
              size="large"
              options={languageList}
              defaultValue={language}
              onChange={(value) => setExchangeLanguages((prev) => [value, prev[1]])}
            ></Select>
            <span className="flex flex-col">
              <SwapRightOutlined />
              <SwapRightOutlined />
            </span>
            <Select
              size="large"
              options={languageList}
              defaultValue={language}
              onChange={(value) => setExchangeLanguages((prev) => [prev[0], value])}
            ></Select>
          </Space>
          <div
            style={{
              maxHeight: '400px',
              overflow: 'scroll',
            }}
          >
            <h4>源代码</h4>
            <Highlight code={value}></Highlight>
          </div>
          {exchangeResult && (
            <div
              style={{
                maxHeight: '400px',
                overflow: 'scroll',
              }}
            >
              <h4>目标代码</h4>
              <Highlight code={exchangeResult}></Highlight>
            </div>
          )}
        </div>
      </Modal>
      <Modal
        title="代码编写意见"
        open={openCommentModal}
        onCancel={() => setOpenCommentModal(false)}
        footer={[]}
        width={'80vw'}
        centered
      >
        <div>
          <Result
            style={{
              padding: '2rem 1rem',
            }}
            title={commentResult?.res || ''}
            status={recordStates.find((item) => item.value === commentResult?.res)?.state}
          ></Result>
          <Highlight code={commentResult?.description || ''}></Highlight>
        </div>
        <div>
          <Switch
            checkedChildren="收起"
            unCheckedChildren="查看源代码"
            defaultChecked={false}
            onChange={(value) => setShowSourceCode(value)}
          ></Switch>
          {showSourceCode && <Highlight code={value}></Highlight>}
        </div>
      </Modal>
    </>
  )
}

export default CodeEditor
