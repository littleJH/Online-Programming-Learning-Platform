import { IFile } from '@/type'
import { Button, Card, Dropdown, Input, List, Modal, Popover, Segmented, Skeleton, Space, Table, theme } from 'antd'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
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
import { downloadFileApi, showFileInfoApi, uploadFileApi } from '@/api/file'
import style from './style.module.scss'
import utils from '@/tool/myUtils/utils'
import MySvgIcon from '@/components/Icon/MySvgIcon'

const getFileHref = (file: IFile) => {
  if (file.type === 'NEW_DIR') return 'DIR'
  else if (file.type.includes('RENAME')) return file.type.replace('RENAME_', '')
  else return file.type
}

const FileRoot: React.FC = () => {
  const { viewType, fileList, currentPath, openUploadModal, fileIconSize, backStack, forwardStack } =
    useRecoilValue(fileStoreSelector)
  const updateState = myHooks.useUpdateState<IFileStore>(fileStoreSelector)
  const [tableHeight, setTableHeight] = useState(0)
  const ctnRef = useRef<HTMLDivElement>(null)
  const bodyCtnRef = useRef<HTMLDivElement>(null)
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
    const height = bodyCtnRef.current?.clientHeight ?? 0
    setTableHeight(height - 56)
  }, [viewType, fileList, currentPath])

  useEffect(() => {
    fetchFileList()
    document.documentElement.style.setProperty('--file-item-width', fileIconSize + 'px')
    ctnRef.current && ctnRef.current.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('contextmenu', handleContentMenu)
    document.addEventListener('resize', handleResize)
    return () => {
      document.removeEventListener('contextmenu', handleContentMenu)
      document.removeEventListener('resize', handleResize)
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

  const handleResize = () => {
    const height = bodyCtnRef.current?.clientHeight ?? 0
    setTableHeight(height - 56)
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

  const henldeRowClick = async (e: Event, file: IFile) => {
    const { type } = e
    switch (type) {
      case 'contextmenu':
        break
      case 'dblclick':
        if (file.type.toLowerCase() === 'dir' && fetchFileList) {
          const done = await fetchFileList(file.path.replace(/\.\/file/g, ''))
          if (done) {
            updateState((state) => ({
              backStack: [],
              forwardStack: [...state.forwardStack, file.path],
              currentPath: file.path,
            }))
          }
        } else {
          const res = await downloadFileApi('./file' + file.path)
        }
        break
      default:
        break
    }
    console.log('henldeRowClick ==> ', e)
  }

  const handleCtnClick = (e: React.MouseEvent) => {
    updateState((state) => ({
      selectedFile: [],
    }))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    const bodyCtnEl = document.getElementById('bodyCtn')
    const fileItems = []
    if (e.type === 'drop') {
      for (let file of e.dataTransfer.items) {
        fileItems.push(file)
      }
      console.log('onDrag fileItems ==> ', fileItems)
    }
    if (e.type === 'dragleave' || e.type === 'drop') {
      bodyCtnEl && bodyCtnEl.style.setProperty('border', `1px solid ${token.colorBorder}`)
    }
    if (e.type === 'dragenter' || e.type === 'dragover') {
      bodyCtnEl && bodyCtnEl.style.setProperty('border', `2px dashed ${token.colorErrorBorderHover}`)
    }
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
    try {
      const res = await uploadFileApi(currentPath, file)
    } catch {}
    fetchFileList()
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
          <div draggable className="flex justify-between items-center">
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
              <Dropdown
                placement="bottom"
                menu={{
                  items: [
                    {
                      key: 'new',
                      label: '新建文件夹',
                      onClick: handleNewDir,
                    },
                    {
                      key: 'upload',
                      label: '上传文件',
                      onClick: () =>
                        updateState({
                          openUploadModal: true,
                        }),
                    },
                  ],
                }}
              >
                <Button type="dashed" icon={<PlusOutlined />}></Button>
              </Dropdown>
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
                { label: '平铺', value: 'list' },
                { label: '表格', value: 'table' },
              ]}
              value={viewType}
              onChange={(value: any) => updateState({ viewType: value })}
            ></Segmented>
          </div>
          <div
            ref={bodyCtnRef}
            id="bodyCtn"
            className={`${style.bodyCtn}`}
            onClick={handleCtnClick}
            onDrop={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDragEnter={handleDrag}
          >
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
              <div className={style.tableCtn}>
                <GeneralTable
                  scroll={{
                    y: tableHeight,
                  }}
                  dataSource={tableDS}
                  onRow={(record: IFile) => {
                    return {
                      onClick: (e: Event) => henldeRowClick(e, record),
                      onDoubleClick: (e: Event) => henldeRowClick(e, record),
                      onContextMenu: (e: Event) => henldeRowClick(e, record),
                    }
                  }}
                  columns={[
                    {
                      title: '名称',
                      dataIndex: 'name',
                      key: 'name',
                      render: (value: string, item: IFile) => (
                        <div className="flex items-center">
                          <MySvgIcon href={getFileHref(item)} size={2}></MySvgIcon>
                          <span className="ml-4">
                            {item.type === 'NEW_DIR' ? (
                              <FileItem file={item} onlyNew={true}></FileItem>
                            ) : (
                              value.replace(/\.[^.]+$/, '')
                            )}
                          </span>
                        </div>
                      ),
                    },
                    {
                      title: '修改日期',
                      dataIndex: 'lastWriteTime',
                      key: 'lastWriteTime',
                      width: 200,
                      render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
                    },
                    {
                      title: '类型',
                      dataIndex: 'type',
                      key: 'type',
                      width: 100,
                    },
                    {
                      title: '大小',
                      dataIndex: 'size',
                      key: 'size',
                      width: 100,
                      render: (value: number) => utils.formatFileSize(Number(value)),
                    },
                    {
                      title: '',
                      dataIndex: 'action',
                      key: 'action',
                      width: 80,
                      render: (value: React.ReactNode, record: any) => (
                        <>{record.type !== 'NEW_DIR' && <FileItem file={record} onlyMenu={true}></FileItem>}</>
                      ),
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
        title={'上传文件/压缩包'}
        open={openUploadModal}
        onCancel={() => updateState({ openUploadModal: false })}
        footer={[]}
        style={{
          translate: '0 50%',
        }}
      >
        <div className="pt-8">
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
