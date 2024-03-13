import { IFile } from '@/type'
import { Button, Card, Dropdown, Input, List, Modal, Popover, Segmented, Skeleton, Space, Table, theme } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  RedoOutlined,
  PlusOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons'
import MyEmpty from './component/MyEmpty'
import FileItem from './component/FileItem'
import { useRecoilValue } from 'recoil'
import { IFileStore, Serv, fileStoreSelector } from './fileStore'
import Dragger from 'antd/es/upload/Dragger'
import Upload, { RcFile } from 'antd/es/upload'
import myHooks from '@/tool/myHooks/myHooks'
import GeneralTable from '@/components/table/GeneralTable'
import dayjs from 'dayjs'
import { showFileInfoApi } from '@/api/file'
import style from './style.module.scss'
import utils from '@/tool/myUtils/utils'
import MySvgIcon from '@/components/Icon/MySvgIcon'

const FileRoot: React.FC = () => {
  const { viewType, fileList, currentPath, showInput, openUploadModal, fileIconSize, backStack, forwardStack } =
    useRecoilValue(fileStoreSelector)
  const updateState = myHooks.useUpdateState<IFileStore>(fileStoreSelector)
  const ctnRef = useRef<HTMLDivElement>(null)
  const { token } = theme.useToken()

  const tableDS = useMemo(
    () =>
      fileList.map((file) => ({
        ...file,
        key: `${file.path}/${file.name}`,
        action: '',
      })),
    [fileList]
  )

  useEffect(() => {
    fetchFileList()
    document.documentElement.style.setProperty('--file-item-width', fileIconSize + 'px')
    ctnRef.current && ctnRef.current.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('contextmenu', handleContentMenu)
    return () => {
      document.removeEventListener('contextmenu', handleContentMenu)
    }
  }, [])

  const fetchFileList = async (path?: string) => {
    try {
      const emptyFile = {}
      const res = await showFileInfoApi(path || currentPath)
      updateState({
        fileList:
          res.data.code === 200
            ? res.data.data?.files?.map((file: IFile) => ({
                ...file,
                path: file.path.replace(/\.\/file/g, ''),
                type: file.type.replace(/\./g, '').toUpperCase(),
              }))
            : [],
      })
      return res.data.code === 200
    } catch {
      return false
    }
  }

  const back = async () => {
    const forwardStackClone = [...forwardStack]
    const popPath = forwardStackClone.pop()
    const done = await fetchFileList(forwardStackClone[forwardStackClone.length - 1])
    done &&
      updateState((state) => ({
        forwardStack: forwardStackClone,
        backStack: popPath ? [...state.backStack, popPath] : [...state.backStack],
        currentPath: forwardStackClone[forwardStackClone.length - 1] || state.currentPath,
      }))
  }
  const forward = async () => {
    const backStackClone = [...backStack]
    const popPath = backStackClone.pop()
    const done = await fetchFileList(popPath)
    if (done) {
      updateState((state) => ({
        forwardStack: popPath ? [...state.forwardStack, popPath] : [...state.forwardStack],
        backStack: backStackClone,
        currentPath: popPath || state.currentPath,
      }))
    }
  }
  const goUp = async () => {
    const pathArr = utils.getPathArray(currentPath)
    console.log(pathArr)
    const path = pathArr.slice(0, pathArr.length - 1).join('/')
    const done = await fetchFileList(`/${path}`)
    done &&
      updateState((state) => ({
        currentPath: `/${path}`,
      }))
  }
  const refresh = () => {
    fetchFileList()
  }

  const handlePressEnter = () => {
    fetchFileList()
  }

  const handleContentMenu = (e: Event) => {
    e.preventDefault()
  }

  const handleWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const quota = 10
      updateState((state) => ({
        fileIconSize: e.deltaY >= 0 ? state.fileIconSize - quota : state.fileIconSize + quota,
      }))
    }
  }

  const henldeRowClick = (e: Event) => {
    const { type } = e
    switch (type) {
      case 'contextmenu':
        break
      case 'dblclick':
        break
      default:
        break
    }
    console.log('henldeRowClick ==> ', e)
  }

  const handleCtnClick = (e: React.MouseEvent) => {
    console.log('handle ctn click ...')
    updateState((state) => ({
      selectedFile: [],
    }))
  }

  const mkdir = () => {
    console.log('handle mkdir')
    if (viewType === 'table') {
      updateState({
        fileList: [
          ...fileList,
          {
            name: '新建文件夹',
            path: currentPath,
            type: 'dir',
            lastWriteTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          },
        ],
        showInput: true,
      })
    }
  }

  const beforeUpload = async (file: RcFile, fileList: RcFile[]) => {
    console.log('handle upload file', file, fileList)
    const fileName = await Serv.upload({
      path: currentPath,
      data: file,
    })
    if (fileName) {
    }
  }

  const handleNewDir = () => {
    updateState((state) => ({
      inputText: '新建文件夹',
      fileList: [
        ...state.fileList,
        {
          name: '新建文件夹',
          path: currentPath,
          type: 'NEW_DIR',
          lastWriteTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
      ],
    }))
  }

  return (
    <div className="w-full h-full flex items-center justify-center select-none">
      <div
        ref={ctnRef}
        style={{
          width: '75%',
          height: '100%',
        }}
      >
        <Card
          title="文件系统"
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          className="w-full h-full"
          bodyStyle={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="flex justify-between items-center">
            <Space
              style={{
                minWidth: 'max-content',
              }}
            >
              <Button disabled={forwardStack.length === 1 && forwardStack.includes('/')} type="text" onClick={back}>
                <ArrowLeftOutlined
                  style={{
                    color: forwardStack.length === 1 && forwardStack.includes('/') ? '#ccc' : '',
                  }}
                />
              </Button>
              <Button disabled={backStack.length === 0} type="text" onClick={forward}>
                <ArrowRightOutlined
                  style={{
                    color: backStack.length > 0 ? '' : '#ccc',
                  }}
                />
              </Button>
              <Button disabled={currentPath === '/'} type="text" onClick={goUp}>
                <ArrowUpOutlined
                  style={{
                    color: currentPath !== '/' ? '' : '#ccc',
                  }}
                />
              </Button>
              <Button type="text" onClick={refresh}>
                <RedoOutlined />
              </Button>
              <Popover
                overlayInnerStyle={{
                  padding: '4px 8px',
                }}
                placement="bottom"
                content={
                  <List
                    size="small"
                    dataSource={[
                      {
                        label: '文件夹',
                        onclick: handleNewDir,
                      },
                    ]}
                    renderItem={(item, index) => (
                      <List.Item style={{ padding: '0' }} key={index}>
                        <div className={style.menuItem} onClick={item.onclick}>
                          {item.label}
                        </div>
                      </List.Item>
                    )}
                  ></List>
                }
              >
                <Button type="dashed" icon={<PlusOutlined />}>
                  新建
                </Button>
              </Popover>
            </Space>
            <div className="ml-8 mr-12 w-full">
              <Input
                prefix={'当前路径：'}
                value={`${currentPath}`}
                onChange={(e) => updateState((state) => ({ currentPath: e.target.value }))}
                onPressEnter={handlePressEnter}
              ></Input>
            </div>
            <Segmented
              options={[
                { label: '列表视图', value: 'list' },
                { label: '表格视图', value: 'table' },
              ]}
              value={viewType}
              onChange={(value: any) => updateState({ viewType: value })}
            ></Segmented>
          </div>
          <div onClick={handleCtnClick} className={`${style.bodyCtn}`}>
            {viewType === 'list' && (
              <div className={style.listCtn}>
                <div className={style.listGridCtn}>
                  {fileList.map((file: IFile, index: number) => (
                    <div id={`fileitem${index}`} className={style.listItem} key={file.path + file.name}>
                      <FileItem file={file} fetchFileList={fetchFileList}></FileItem>
                    </div>
                  ))}
                  {/* <Skeleton.Node active>
                    <FolderOpenOutlined
                      style={{
                        fontSize: fileIconSize,
                        color: '#bfbfbf',
                      }}
                    />
                  </Skeleton.Node>
                  <Skeleton.Input active></Skeleton.Input> */}
                </div>
              </div>
            )}
            {viewType === 'table' && (
              <div>
                <GeneralTable
                  dataSource={tableDS}
                  onRow={(record: IFile) => {
                    return {
                      onClick: henldeRowClick,
                      onDoubleClick: henldeRowClick,
                      onContextMenu: henldeRowClick,
                    }
                  }}
                  columns={[
                    {
                      title: '名称',
                      dataIndex: 'name',
                      key: 'name',
                      render: (value: string, item: IFile) => (
                        <>
                          {item.type === 'NEW_DIR' ? <FileItem file={item}></FileItem> : value.replace(/\.[^.]+$/, '')}
                        </>
                      ),
                    },
                    {
                      title: '修改日期',
                      dataIndex: 'lastWriteTime',
                      key: 'lastWriteTime',
                      render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
                    },
                    {
                      title: '类型',
                      dataIndex: 'type',
                      key: 'type',
                    },
                    {
                      title: '大小',
                      dataIndex: 'size',
                      key: 'size',
                      render: (value: number) => utils.formatFileSize(Number(value)),
                    },
                    {
                      title: '',
                      dataIndex: 'action',
                      key: 'action',
                      render: (value: React.ReactNode, record: any) => <FileItem file={record}></FileItem>,
                    },
                  ]}
                  emptyText={
                    <MyEmpty onUpload={() => updateState({ openUploadModal: true })} onMkdir={mkdir}></MyEmpty>
                  }
                ></GeneralTable>
              </div>
            )}
          </div>
        </Card>
      </div>
      <Modal
        title={'上传文件'}
        open={openUploadModal}
        onCancel={() => updateState({ openUploadModal: false })}
        footer={[]}
      >
        <div className="p-4">
          <Dragger
            showUploadList={{
              showDownloadIcon: false,
              showRemoveIcon: false,
              showPreviewIcon: false,
            }}
            height={200}
            beforeUpload={beforeUpload}
          ></Dragger>
        </div>
      </Modal>
    </div>
  )
}

export default FileRoot
