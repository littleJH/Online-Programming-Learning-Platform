import { CompetitionType, ICompetition, IGroup } from '@/vite-env'
import {
  Button,
  Space,
  Steps,
  Form,
  Input,
  Switch,
  Result,
  notification,
  List,
  Modal
} from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { Fragment, useEffect, useState } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import {
  applyEnterGroupApi,
  createUserGroupApi,
  getGroupApi,
  getUserGroupListApi,
  searchGroupByTextApi
} from '@/api/group'
import { enterCompetitionApi } from '@/api/competitionMixture'
import GroupInfo from './GroupInfo'
import { getCurrentUserinfo } from '@/api/user'

type Mode = 'create' | 'enter' | 'undetermined' | 'already'

interface IDataSource {
  key: string
  group: IGroup
}

const EnterGroup: React.FC<{
  competition: ICompetition | undefined
  type: CompetitionType
}> = props => {
  const [form] = Form.useForm()
  const { competition, type } = props
  const [currentStep, setcurrentStep] = useState(0)
  const [mode, setmode] = useState<Mode>('undetermined')
  const [title2, settitle2] = useState('')
  const [group, setgroup] = useState<IGroup>({} as IGroup)
  const [dataSource, setdataSource] = useState<IDataSource[]>([])
  const [searchText, setsearchText] = useState('')
  const [applyContent, setapplyContent] = useState('')
  const [groupIdText, setgroupIdText] = useState('')

  useEffect(() => {
    let title: string = ''
    switch (mode) {
      case 'create':
        title = '创建用户组'
        break
      case 'enter':
        title = '加入用户组'
        break
      case 'already':
        title = '已有用户组'
        break
    }
    settitle2(title)
  }, [mode])

  useEffect(() => {
    if (currentStep === 0) {
      setmode('undetermined')
    }
    setsearchText('')
    setdataSource([])
    setgroupIdText('')
  }, [currentStep])

  useEffect(() => {
    if (groupIdText) fetchGroupInfo()
  }, [groupIdText])

  const createGroup = () => {
    form
      .validateFields()
      .then(() => {
        const data = form.getFieldsValue()
        createUserGroupApi(JSON.stringify(data)).then(res => {
          console.log(res.data)
          if (res.data.code === 200) {
            setgroup(res.data.data.group)
            setcurrentStep(value => value + 1)
          } else {
            notification.warning({
              message: res.data.msg,
              placement: 'topRight'
            })
          }
        })
      })
      .catch(err => {})
  }

  const enterCompetition = (index: number) => {
    const data = {
      passwd_id: ' '
    }
    let id: string = ''
    switch (mode) {
      case 'create':
        id = group.id
        break
      case 'already':
        id = dataSource[index].group.id
    }
    enterCompetitionApi(
      type,
      competition?.id as string,
      JSON.stringify(data),
      id
    ).then(res => {
      if (res.data.code === 200) {
        notification.success({
          message: res.data.msg,
          placement: 'topRight'
        })
        setgroup(index >= 0 ? dataSource[index].group : group)
        setcurrentStep(value => value + 1)
      } else {
        notification.warning({
          message: res.data.msg,
          placement: 'topRight'
        })
      }
    })
  }

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      switch (mode) {
        case 'enter':
          searchGroup()
          break
        case 'already':
          fetchGroupInfo()
      }
    }
  }

  const searchGroup = () => {
    setdataSource([])
    searchGroupByTextApi(searchText).then(res => {
      console.log(res)
      const groups = res.data.data.groups as IGroup[]
      setdataSource(
        groups.map(item => {
          return {
            key: item.id,
            group: item
          }
        })
      )
    })
  }

  const enterGroup = (index: number) => {
    const data = {
      content: applyContent
    }
    applyEnterGroupApi(dataSource[index].group.id, JSON.stringify(data)).then(
      res => {
        if (res.data.code === 200) {
          notification.success({
            message: res.data.msg,
            placement: 'topRight'
          })
          setgroup(dataSource[index].group)
          setcurrentStep(value => value + 1)
        } else {
          notification.warning({
            message: res.data.msg,
            placement: 'topRight'
          })
        }
      }
    )
  }

  const fetchMyGroupList = () => {
    getCurrentUserinfo().then(res => {
      getUserGroupListApi(res.data.data.user.id).then(res => {
        const groups = res.data.data.groups as IGroup[]
        setdataSource(
          groups.map(item => {
            return {
              key: item.id,
              group: item
            }
          })
        )
      })
    })
  }

  const fetchGroupInfo = () => {
    setdataSource([])
    getGroupApi(groupIdText).then(res => {
      if (res.data.code === 200) {
        const group = res.data.data.group as IGroup
        setdataSource([
          {
            key: group.id,
            group: group
          }
        ])
      }
    })
  }
  return (
    <div>
      <Steps
        className="py-8 px-16"
        current={currentStep}
        items={[
          {
            title: ''
          },
          {
            title: title2
          },
          {
            title: ''
          }
        ]}
      ></Steps>
      {currentStep === 0 && (
        <div className="flex justify-center">
          <Space>
            <Button
              onClick={() => {
                setmode('create')
                setcurrentStep(value => value + 1)
              }}
            >
              创建用户组
            </Button>
            <Button
              onClick={() => {
                setmode('enter')
                setcurrentStep(value => value + 1)
              }}
            >
              加入用户组
            </Button>
            <Button
              onClick={() => {
                setmode('already')
                setcurrentStep(value => value + 1)
              }}
            >
              已有用户组
            </Button>
            <Button
              onClick={() => {
                setmode('create')
                setcurrentStep(value => value + 1)
              }}
            >
              创建标准用户组
            </Button>
          </Space>
        </div>
      )}
      {currentStep === 1 && mode === 'create' && (
        <div>
          <Form layout="vertical" form={form}>
            <Form.Item
              name={'title'}
              label="小组名"
              rules={[{ required: true }]}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
              name={'content'}
              label="小组描述"
              rules={[{ required: true }]}
            >
              <TextArea></TextArea>
            </Form.Item>
            <Form.Item
              name={'auto'}
              label="自动通过用户申请"
              rules={[{ required: true }]}
            >
              <Switch
                checked={form.getFieldValue('auto')}
                onChange={value => form.setFieldValue('auto', value)}
              ></Switch>
            </Form.Item>
            <Form.List name={'users'}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...field}
                      label={
                        <div>
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                          <span className="mx-2">{`用户${index + 1}`}</span>
                        </div>
                      }
                      colon={false}
                      key={field.key}
                    >
                      <Input placeholder="请填入用户 id"></Input>
                    </Form.Item>
                  ))}
                  <Form.Item label=" " colon={false}>
                    <Button
                      size="large"
                      className=""
                      type="dashed"
                      style={{ width: '100%' }}
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      添加用户
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form>
          <div className="flex justify-center mt-8">
            <Space>
              <Button
                onClick={() => {
                  setcurrentStep(0)
                }}
              >
                上一步
              </Button>
              <Button type="primary" onClick={createGroup}>
                创建
              </Button>
            </Space>
          </div>
        </div>
      )}
      {currentStep === 1 && mode === 'enter' && (
        <div>
          <div>
            <div className="searchInput flex">
              <Input
                size="large"
                autoFocus
                placeholder="搜索用户组"
                onKeyDown={e => {
                  handleKeydown(e)
                }}
                value={searchText}
                onChange={value => setsearchText(value.target.value)}
                className="border-0 border-b border-slate-500"
              ></Input>
              <svg
                className="icon ml-4 hover:cursor-pointer "
                onClick={searchGroup}
              >
                <use href="#icon-search"></use>
              </svg>
            </div>
          </div>
          <GroupList
            dataSource={dataSource}
            callBack={enterGroup}
            extra="申请加入"
          ></GroupList>
          <div className="flex justify-center">
            <Button
              onClick={() => {
                setcurrentStep(0)
              }}
            >
              上一步
            </Button>
          </div>
        </div>
      )}
      {currentStep === 1 && mode === 'already' && (
        <Fragment>
          <div className="flex items-center">
            <Input
              placeholder="请输入用户组的id"
              value={groupIdText}
              onChange={value => setgroupIdText(value.target.value)}
              onKeyDown={handleKeydown}
            ></Input>
            <span className="px-4">或</span>
            <Button
              onClick={() => {
                fetchMyGroupList()
              }}
            >
              查看我的用户组
            </Button>
          </div>
          <GroupList
            dataSource={dataSource}
            callBack={enterCompetition}
            extra="点击报名"
          ></GroupList>
          <div className="flex justify-center">
            <Button
              onClick={() => {
                setcurrentStep(0)
              }}
            >
              上一步
            </Button>
          </div>
        </Fragment>
      )}
      {currentStep === 2 && (
        <div>
          {mode === 'create' && (
            <Result
              status={'success'}
              title={'创建小组成功'}
              extra={
                <Fragment>
                  <GroupInfo group={group}></GroupInfo>
                  <Space>
                    <Button onClick={() => enterCompetition(-1)}>
                      点击报名
                    </Button>
                    <Button
                      onClick={() => {
                        setcurrentStep(1)
                      }}
                    >
                      点击修改
                    </Button>
                  </Space>
                </Fragment>
              }
            ></Result>
          )}
          {mode === 'enter' && <Result></Result>}
        </div>
      )}
    </div>
  )
}

export default EnterGroup

const GroupList: React.FC<{
  dataSource: IDataSource[]
  callBack: Function
  extra: string
}> = props => {
  const { dataSource, callBack, extra } = props
  return (
    <List
      className="mx-4"
      dataSource={dataSource}
      renderItem={(item, index) => (
        <List.Item
          extra={
            <Button size="small" onClick={() => callBack(index)}>
              {extra}
            </Button>
          }
        >
          <List.Item.Meta
            title={<div>{item.group.title}</div>}
            description={
              <div>
                <p>id：{item.group.id}</p>
                <p>小组描述：{item.group.content}</p>
                <p>自动通过用户申请：{item.group.auto ? '是' : '否'}</p>
              </div>
            }
          ></List.Item.Meta>
        </List.Item>
      )}
    ></List>
  )
}
