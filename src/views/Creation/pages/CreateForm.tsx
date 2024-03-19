import { getTopicListApi, getTopicProblemsApi } from '@/api/topic'
import TextEditor from '@/components/editor/TextEditor'
import { IGroup, ITopic } from '@/type'
import { Button, Form, Input, InputNumber, InputRef, Modal, Result, ResultProps, Switch, Table } from 'antd'
import Search from 'antd/es/input/Search'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PlusOutlined, MinusCircleOutlined, MenuOutlined } from '@ant-design/icons'
import { RowSelectMethod } from 'antd/es/table/interface'
import { getGroupListApi } from '@/api/group'
import NoData from '@/components/empty/NoData'
import { createFormApi } from '@/api/form'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from 'react-router-dom'

type LeftMode = 'topics' | 'groups' | 'close'

interface ITopicTableDataType extends ITopic {
  key: string
  total: number
}

interface IGroupTableDataType extends IGroup {
  key: string
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

const Row = ({ children, ...props }: RowProps) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  })

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 99 } : {}),
  }

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined ref={setActivatorNodeRef} style={{ touchAction: 'none', cursor: 'move' }} {...listeners} />
            ),
          })
        }
        return child
      })}
    </tr>
  )
}

const CreateForm: React.FC = () => {
  const nav = useNavigate()
  const [form] = Form.useForm()
  const [leftMode, setLeftMode] = useState<LeftMode>('close')
  const [topicList, setTopicList] = useState<ITopicTableDataType[]>([])
  const [groupList, setGroupList] = useState<IGroupTableDataType[]>([])
  const [searchText, setSearchText] = useState('')
  const [content, setcontent] = useState<string | undefined>('')
  const [selectedTopics, setSelectedTopics] = useState<ITopicTableDataType[]>([])
  const [selectedGroups, setSelectedGroups] = useState<IGroupTableDataType[]>([])
  const titleInputRef = useRef<InputRef>(null)
  const [openResultModal, setOpenResultModal] = useState(false)
  const [result, setResult] = useState<ResultProps>()

  useEffect(() => {
    titleInputRef.current?.focus()
    fetchTopics()
    fetchGroups()
  }, [])

  const selectedTopicRowKeys = useMemo(() => selectedTopics.map((value) => value.id), [selectedTopics])

  const selectedGroupRowKeys = useMemo(() => selectedGroups.map((value) => value.id), [selectedGroups])

  useEffect(() => {
    form.setFieldValue('topics', selectedTopicRowKeys)
    form.setFieldValue('groups', selectedGroupRowKeys)
  }, [selectedTopicRowKeys, selectedGroupRowKeys])

  const fetchTopics = useCallback(() => {
    getTopicListApi(1, 99999).then((res) => {
      const list: ITopicTableDataType[] = []
      res.data.data.topics.forEach(async (topic: ITopic) => {
        const res = await getTopicProblemsApi(topic.id, 1, 0)
        list.push({
          ...topic,
          key: topic.id,
          total: res.data.data.total,
        })
      })
      setTopicList(list)
    })
  }, [])

  const fetchGroups = useCallback(() => {
    getGroupListApi(1, 99999).then((res) => {
      console.log(res.data)
      const list: IGroupTableDataType[] = []
      res.data.data.groups.forEach((group: IGroup) => {
        list.push({
          ...group,
          key: group.id,
        })
      })
      setGroupList(list)
    })
  }, [])

  const handleValuesChange = (values: any) => {
    console.log(values)
  }

  const handleContentChange = (value: string) => {
    setcontent(value)
    form.setFieldValue('content', value === '<p><br></p>' || value === '' ? undefined : value)
  }

  const handleSearch = (value: string) => {}

  const handleSelectedChange = useCallback(
    (value: React.Key[], selectedRows: ITopic[] | IGroup[], info: { type: RowSelectMethod }) => {
      switch (leftMode) {
        case 'topics':
          if (info.type === 'all') {
            value.length
              ? setSelectedTopics((prev: any) => [...prev, ...selectedRows])
              : setSelectedTopics((prev: ITopicTableDataType[]) => [
                  ...prev.filter((value) => topicList.findIndex((val) => val.key === value.key) === -1),
                ])
          }
          break
        case 'groups':
          if (info.type === 'all') {
            value.length
              ? setSelectedGroups((prev: any) => [...prev, ...selectedRows])
              : setSelectedGroups((prev: IGroupTableDataType[]) => [
                  ...prev.filter((value) => groupList.findIndex((val) => val.key === value.key) === -1),
                ])
          }
          break
        default:
          break
      }
    },
    [topicList, groupList, leftMode]
  )

  const handleRowSelect = useCallback(
    (record: ITopicTableDataType | IGroupTableDataType, selected: boolean) => {
      switch (leftMode) {
        case 'topics':
          selected
            ? setSelectedTopics((prev: ITopicTableDataType[]) => [...prev, record as ITopicTableDataType])
            : setSelectedTopics((prev: ITopicTableDataType[]) => [...prev.filter((value) => value.key !== record.key)])
          break
        case 'groups':
          selected
            ? setSelectedGroups((prev: IGroupTableDataType[]) => [...prev, record as IGroupTableDataType])
            : setSelectedGroups((prev: IGroupTableDataType[]) => [...prev.filter((value) => value.key !== record.key)])
          break
        default:
          break
      }
    },
    [leftMode]
  )

  const handleDragEnd = ({ active, over }: DragEndEvent, mode: LeftMode) => {
    switch (mode) {
      case 'topics':
        if (active.id !== over?.id) {
          setSelectedTopics((previous) => {
            const activeIndex = previous.findIndex((i) => i.key === active.id)
            const overIndex = previous.findIndex((i) => i.key === over?.id)
            return arrayMove(previous, activeIndex, overIndex)
          })
        }
        break
      case 'groups':
        if (active.id !== over?.id) {
          setSelectedGroups((previous) => {
            const activeIndex = previous.findIndex((i) => i.key === active.id)
            const overIndex = previous.findIndex((i) => i.key === over?.id)
            return arrayMove(previous, activeIndex, overIndex)
          })
        }
        break
      default:
        break
    }
  }

  const handleMinusClick = useCallback((index: number, mode: LeftMode) => {
    switch (mode) {
      case 'topics':
        setSelectedTopics((value) => [...value.slice(0, index), ...value.slice(index + 1)])
        break
      case 'groups':
        setSelectedGroups((value) => [...value.slice(0, index), ...value.slice(index + 1)])
        break
      default:
        break
    }
  }, [])

  const handleButtonClick = useCallback(() => {
    form
      .validateFields()
      .then((data) => {
        console.log(data)
        createFormApi(JSON.stringify(data)).then((res) => {
          console.log(res.data)
          if (res.data.code === 200) {
            setResult({
              status: 'success',
              title: '创建成功',
              subTitle: '',
              extra: [
                <Button type="primary" key={'detail'} onClick={() => {}}>
                  查看详情
                </Button>,
                <Button
                  type="primary"
                  key={'next'}
                  onClick={() => {
                    form.resetFields()
                    setOpenResultModal(false)
                    setSelectedGroups([])
                    setSelectedTopics([])
                    setcontent('')
                    setLeftMode('close')
                  }}
                >
                  继续创建
                </Button>,
              ],
            })
          } else {
            setResult({
              status: 'error',
              title: '创建失败',
              subTitle: (
                <div>
                  <p>{res.data.msg}</p>
                  <p>组员数量大于限制或者成员是否重复</p>
                </div>
              ),
            })
          }
          setOpenResultModal(true)
        })
      })
      .catch((err) => console.log(err))
  }, [form])

  const handleDetailClick = useCallback((record: ITopicTableDataType) => {
    console.log(record)
    nav(`/problem/set/all?topic=${record.id}&text=&labels=`)
  }, [])

  return (
    <>
      <div className="flex h-full py-4 px-8">
        {leftMode !== 'close' && (
          <div
            style={{
              width: '384px',
            }}
          >
            <Search
              style={{
                padding: '1rem 0',
              }}
              placeholder="搜索题单"
              defaultValue={searchText}
              enterButton
              onSearch={handleSearch}
              onChange={(event) => {
                setSearchText(event.target.value)
              }}
            ></Search>
            {leftMode === 'topics' && (
              <Table
                rowSelection={{
                  columnWidth: 64,
                  selectedRowKeys: selectedTopicRowKeys,
                  onChange: (value, selectedRows, info) => handleSelectedChange(value, selectedRows, info),
                  onSelect: (record, selected) => handleRowSelect(record, selected),
                }}
                size="small"
                dataSource={topicList}
                pagination={false}
                columns={[
                  {
                    dataIndex: 'title',
                    key: 'title',
                    title: '题单',
                  },
                  {
                    dataIndex: 'content',
                    key: 'content',
                    title: '描述',
                    render: (value) => <div style={{}}>{value.replace(/<[^<>]+>/g, '')}</div>,
                  },
                  {
                    dataIndex: 'total',
                    key: 'total',
                    title: '题数',
                  },
                  {
                    key: 'action',
                    title: '操作',
                    render: (_, record, index) => (
                      <Button type="link" onClick={() => handleDetailClick(record)}>
                        详情
                      </Button>
                    ),
                  },
                ]}
              ></Table>
            )}
            {leftMode === 'groups' && (
              <Table
                rowSelection={{
                  columnWidth: 64,
                  selectedRowKeys: selectedGroupRowKeys,
                  onChange: (value, selectedRows, info) => handleSelectedChange(value, selectedRows, info),
                  onSelect: (record, selected) => handleRowSelect(record, selected),
                }}
                size="small"
                dataSource={groupList}
                pagination={false}
                columns={[
                  {
                    dataIndex: 'title',
                    key: 'title',
                    title: '用户组',
                  },
                  {
                    dataIndex: 'content',
                    key: 'content',
                    title: '描述',
                    render: (value) => <div style={{}}>{value.replace(/<[^<>]+>/g, '')}</div>,
                  },

                  {
                    key: 'action',
                    title: '操作',
                    render: (_, record) => <Button type="link"> 详情</Button>,
                  },
                ]}
              ></Table>
            )}
          </div>
        )}
        <div className="w-8"></div>
        <div
          style={{
            width: '640px',
          }}
        >
          <Form
            form={form}
            name="formForm"
            layout="vertical"
            onValuesChange={handleValuesChange}
            scrollToFirstError
            initialValues={{
              auto_update: true,
              auto_pass: false,
              pass_re: false,
            }}
          >
            <Form.Item name={'title'} label="标题：" rules={[{ required: true }]}>
              <Input ref={titleInputRef}></Input>
            </Form.Item>
            <Form.Item name={'content'} label="描述" rules={[{ required: true }]}>
              <TextEditor value={content} mode="markdown" htmlChange={handleContentChange}></TextEditor>
            </Form.Item>
            <Form.Item name={'topics'} label="题单：" rules={[{ required: true }]}>
              <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={(event) => handleDragEnd(event, 'topics')}>
                <SortableContext items={selectedGroups.map((i) => i.key)} strategy={verticalListSortingStrategy}>
                  <Table
                    pagination={false}
                    showHeader={false}
                    components={{
                      body: {
                        row: Row,
                      },
                    }}
                    rowKey={'key'}
                    size="small"
                    dataSource={selectedTopics}
                    columns={[
                      {
                        key: 'sort',
                        width: 32,
                      },
                      {
                        width: 64,
                        dataIndex: 'key',
                        render: (_, __, index) => <div className="select-none">{index + 1}</div>,
                      },
                      {
                        dataIndex: 'title',
                        key: 'title',
                      },
                      {
                        dataIndex: 'operation',
                        align: 'right',
                        render: (value, _, index) => (
                          <MinusCircleOutlined onClick={() => handleMinusClick(index, 'topics')} />
                        ),
                      },
                    ]}
                    locale={{
                      emptyText: <NoData text="暂无数据"></NoData>,
                    }}
                  ></Table>
                </SortableContext>
              </DndContext>
              <div className="flex justify-center w-full">
                <Button type="dashed" style={{ margin: '1rem' }} onClick={() => setLeftMode('topics')}>
                  <PlusOutlined style={{ width: '4rem' }} />
                </Button>
              </div>
            </Form.Item>
            <Form.Item name={'groups'} label="用户组：">
              <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={(event) => handleDragEnd(event, 'groups')}>
                <SortableContext items={selectedTopics.map((i) => i.key)} strategy={verticalListSortingStrategy}>
                  <Table
                    pagination={false}
                    showHeader={false}
                    rowKey={'key'}
                    components={{
                      body: {
                        row: Row,
                      },
                    }}
                    size="small"
                    dataSource={selectedGroups}
                    columns={[
                      {
                        key: 'sort',
                        width: 32,
                      },
                      {
                        width: 64,
                        dataIndex: 'key',
                        render: (_, __, index) => <div className="select-none">{index + 1}</div>,
                      },
                      {
                        dataIndex: 'title',
                        key: 'title',
                      },
                      {
                        dataIndex: 'operation',
                        align: 'right',
                        render: (value, _, index) => (
                          <MinusCircleOutlined onClick={() => handleMinusClick(index, 'groups')} />
                        ),
                      },
                    ]}
                    locale={{
                      emptyText: <NoData text="暂无数据"></NoData>,
                    }}
                  ></Table>
                </SortableContext>
              </DndContext>
              <div className="flex justify-center w-full">
                <Button type="dashed" style={{ margin: '1rem' }} onClick={() => setLeftMode('groups')}>
                  <PlusOutlined style={{ width: '4rem' }} />
                </Button>
              </div>
            </Form.Item>
            <Form.Item name={'auto_update'} label="每小时更新排名：" valuePropName="checked">
              <Switch defaultChecked></Switch>
            </Form.Item>
            <Form.Item name={'auto_pass'} label="自动通过用户组申请：" valuePropName="checked">
              <Switch></Switch>
            </Form.Item>
            <Form.Item name={'pass_num'} label="用户组成员数量限制：" rules={[{ required: true }]}>
              <InputNumber min={1}></InputNumber>
            </Form.Item>
            <Form.Item name={'pass_re'} label="用户组成员可重复：" valuePropName="checked">
              <Switch></Switch>
            </Form.Item>
          </Form>
          <div className="text-center">
            <Button
              type="primary"
              style={{
                margin: '1rem 0',
              }}
              onClick={handleButtonClick}
            >
              点击创建
            </Button>
          </div>
        </div>
      </div>
      <Modal
        open={openResultModal}
        footer={null}
        onCancel={() => setOpenResultModal(false)}
        style={{
          translate: '0 50%',
        }}
      >
        <Result {...result}></Result>
      </Modal>
    </>
  )
}

export default CreateForm
