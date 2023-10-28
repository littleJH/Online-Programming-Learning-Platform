import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ProblemList from '@/components/Problem/List/List'
import {
  Button,
  Input,
  InputRef,
  Modal,
  Popover,
  Result,
  ResultProps,
  Space,
  Table,
  Tooltip,
  notification
} from 'antd'
import Throttle from '@/tool/myFns/Throttle'
import TextEditor from '@/components/Editor/TextEditor'
import NoData from '@/components/Empty/NoData'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  MenuOutlined,
  MinusCircleOutlined,
  RedoOutlined
} from '@ant-design/icons'
import { IPrblemTableDataType } from '@/type'
import { createTopicApi } from '@/api/topic'
import ReadOnly from '@/components/Editor/ReadOnly'
import { useNavigate } from 'react-router-dom'

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

const creation_topic_title = localStorage.getItem('creation_topic_title')
const creation_topic_content = localStorage.getItem('creation_topic_content')
const creation_problem_selected = localStorage.getItem(
  'creation_problem_selected'
)
const Row = ({ children, ...props }: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: props['data-row-key']
  })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 99 } : {})
  }

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, child => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: 'none', cursor: 'move' }}
                {...listeners}
              />
            )
          })
        }
        return child
      })}
    </tr>
  )
}

const CreateTopic: React.FC = () => {
  const nav = useNavigate()
  const [title, settitle] = useState(
    creation_topic_title ? creation_topic_title : ''
  )
  const [content, setcontent] = useState(
    creation_topic_content ? creation_topic_content : ''
  )
  const [selectedProblems, setSelectedProblems] = useState<
    IPrblemTableDataType[]
  >(creation_problem_selected ? JSON.parse(creation_problem_selected) : [])
  const [openResultModal, setOpenResultModal] = useState(false)
  const [result, setResult] = useState<ResultProps>()
  const inputRef = useRef<InputRef>(null)

  useEffect(() => {
    selectedProblems.length
      ? localStorage.setItem(
          'creation_problem_selected',
          JSON.stringify(selectedProblems)
        )
      : null
  }, [selectedProblems])

  const selectedRowKeys = useMemo(
    () => [...selectedProblems.map(value => value.key)],
    [selectedProblems]
  )

  const createTopic = useCallback(() => {
    if (!selectedProblems.length || !title.length) {
      if (!title.length) {
        notification.error({
          message: '请输入标题',
          placement: 'topRight'
        })
        inputRef.current?.focus()
      }
      if (!selectedProblems.length)
        notification.error({
          message: '您还没有添加题目',
          placement: 'topRight'
        })
      return
    }
    const data = JSON.stringify({
      title: title,
      content: content,
      problems: [...selectedProblems.map(item => item.key)]
    })
    createTopicApi(data).then(res => {
      setOpenResultModal(true)
      if (res.data.code === 200) {
        setResult({
          status: 'success',
          title: '创建成功',
          subTitle: '',
          extra: [
            <Button type="primary" key={'detail'} onClick={() => {}}>
              查看详情
            </Button>,
            <Button type="primary" key={'next'} onClick={() => {}}>
              创建下一题
            </Button>
          ]
        })
        localStorage.removeItem('creation_topic_title')
        localStorage.removeItem('creation_topic_content')
        localStorage.removeItem('creation_problem_selected')
      }
    })
  }, [])

  const throttle = Throttle(createTopic, 1000)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    settitle(e.target.value)
    localStorage.setItem('creation_topic_title', e.target.value)
  }

  const handleHtmlChange = (value: string) => {
    setcontent(value)
    localStorage.setItem('creation_topic_content', value)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setSelectedProblems(previous => {
        const activeIndex = previous.findIndex(i => i.key === active.id)
        const overIndex = previous.findIndex(i => i.key === over?.id)
        return arrayMove(previous, activeIndex, overIndex)
      })
    }
  }

  const handleMinusClick = useCallback((index: number) => {
    setSelectedProblems(value => [
      ...value.slice(0, index),
      ...value.slice(index + 1)
    ])
  }, [])

  const toDetail = (index: number) => {
    const id = selectedProblems[index].key
    nav(`/problem/${id}`)
  }

  return (
    <>
      <div className="h-full flex p-4">
        <div className="h-full">
          <ProblemList
            mode="select"
            width={1000}
            selectedProblems={selectedProblems}
            setSelectedProblems={setSelectedProblems}
            selectedRowKeys={selectedRowKeys}
          ></ProblemList>
        </div>
        <div className="w-16"></div>
        <Space
          className="w-96 px-4 h-full  overflow-scroll"
          direction="vertical"
          size={'large'}
        >
          <Input
            ref={inputRef}
            autoFocus
            placeholder="标题"
            style={{}}
            size="large"
            value={title}
            onChange={handleInputChange}
          ></Input>
          <TextEditor
            mode="markdown"
            value={content}
            htmlChange={handleHtmlChange}
            placeholder="内容..."
            style={{
              height: '128px'
            }}
          ></TextEditor>
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedProblems.map(i => i.key)}
              strategy={verticalListSortingStrategy}
            >
              <Table
                caption={
                  <h4 className="w-full text-start">
                    已选题目
                    <RedoOutlined
                      className="mx-4 hover:cursor-pointer"
                      onClick={() => {
                        setSelectedProblems([])
                      }}
                    />
                  </h4>
                }
                showHeader={false}
                components={{
                  body: {
                    row: Row
                  }
                }}
                size="small"
                dataSource={selectedProblems}
                locale={{
                  emptyText: <NoData text="暂无题目"></NoData>
                }}
                rowKey={'key'}
                columns={[
                  {
                    key: 'sort',
                    title: '拖拽排序'
                  },
                  {
                    title: '序号',
                    align: 'center',
                    dataIndex: 'key',
                    render: (_, __, index) => (
                      <div className="select-none">{index + 1}</div>
                    )
                  },
                  {
                    title: '标题',
                    dataIndex: 'title',
                    align: 'center',
                    render: (value, _, index) => (
                      <Popover
                        mouseEnterDelay={0.3}
                        title={value}
                        content={
                          <ReadOnly
                            html={selectedProblems[index].description}
                          ></ReadOnly>
                        }
                        overlayStyle={{
                          maxWidth: '512px'
                        }}
                        overlayInnerStyle={{
                          maxHeight: '256px',
                          overflow: 'scroll'
                        }}
                      >
                        <div
                          className="hover:cursor-pointer"
                          onClick={() => toDetail(index)}
                        >
                          {value}
                        </div>
                      </Popover>
                    )
                  },
                  {
                    dataIndex: 'operation',
                    align: 'center',
                    render: (value, _, index) => (
                      <MinusCircleOutlined
                        onClick={() => handleMinusClick(index)}
                      />
                    )
                  }
                ]}
                pagination={false}
              />
            </SortableContext>
          </DndContext>

          <div className="flex justify-center">
            <Button onClick={() => throttle([])} type="primary">
              点击创建
            </Button>
          </div>
        </Space>
      </div>
      <Modal
        open={openResultModal}
        footer={null}
        onCancel={() => setOpenResultModal(false)}
        style={{
          translate: '0 50%'
        }}
      >
        <Result {...result}></Result>
      </Modal>
    </>
  )
}

export default CreateTopic
