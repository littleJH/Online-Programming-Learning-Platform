import { IFile } from '@/type'
import { Button, Card, Input, List, Modal, Segmented, Space, Table } from 'antd'
import React, { useEffect, useMemo, useRef } from 'react'
import { ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons'
import MyEmpty from './component/MyEmpty'
import FileItem from './component/FileItem'
import { useRecoilValue } from 'recoil'
import { IFileStore, Serv, fileStoreSelector } from './fileStore'
import Dragger from 'antd/es/upload/Dragger'
import { RcFile } from 'antd/es/upload'
import myHooks from '@/tool/myHooks/myHooks'
import GeneralTable from '@/components/table/GeneralTable'
import dayjs from 'dayjs'
import { showFileInfoApi } from '@/api/file'
import style from './style.module.scss'

const FileRoot: React.FC = () => {
  const { viewType, fileList, history, previousPath, currentPath, showInput, openUploadModal, fileIconSize } =
    useRecoilValue(fileStoreSelector)
  const updateState = myHooks.useUpdateState<IFileStore>(fileStoreSelector)
  const ctnRef = useRef<HTMLDivElement>(null)

  const tableDS = useMemo(
    () =>
      fileList.map((file) => ({
        ...file,
        key: `${file.path}/${file.name}`,
      })),
    [fileList]
  )

  useEffect(() => {
    fetchFileList()
    document.documentElement.style.setProperty('--file-item-width', fileIconSize + 'px')
    ctnRef.current && ctnRef.current.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('contextmenu', handleContentMenu)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
      document.removeEventListener('contextmenu', handleContentMenu)
    }
  }, [])

  const fetchFileList = async () => {
    try {
      const res = await showFileInfoApi(currentPath.path, currentPath.name)
      updateState({ fileList: res.data.code === 200 ? res.data.data.files : [] })
    } catch {}
  }

  const back = () => {}
  const forward = () => {}
  const goUp = () => {}
  const refresh = () => {
    fetchFileList()
  }

  const handleContentMenu = (e: Event) => {
    e.preventDefault()
  }

  const handleDocumentClick = () => {
    updateState({
      openMenuItem: null,
    })
  }
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    if (e.ctrlKey) {
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
    updateState((state) => ({
      currentPath: {
        path: state.currentPath.path,
        name: '',
      },
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
            path: currentPath.path,
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
      path: currentPath.path,
      data: file,
    })
    if (fileName) {
    }
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
              <Button type="text" onClick={back}>
                <ArrowLeftOutlined />
              </Button>
              <Button type="text" onClick={forward}>
                <ArrowRightOutlined />
              </Button>
              <Button type="text" onClick={goUp}>
                <ArrowUpOutlined />
              </Button>
              <Button type="text" onClick={refresh}>
                <RedoOutlined />
              </Button>
            </Space>
            <div className="ml-8 mr-12 w-full">
              <Input
                prefix={'当前路径：'}
                value={`${currentPath.path}`}
                onChange={(e) =>
                  updateState((state) => ({ currentPath: { path: e.target.value, name: state.currentPath.name } }))
                }
                onPressEnter={fetchFileList}
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
          <div onClick={handleCtnClick} className="pt-8 px-4 grow">
            {viewType === 'list' && (
              <div className={style.listCtn}>
                {!showInput && (
                  <>
                    {fileList.map((file: IFile, index: number) => (
                      <div id={`fileitem${index}`} className={style.listItem} key={index}>
                        <FileItem file={file}></FileItem>
                      </div>
                    ))}
                  </>
                )}
                {/* {showInput && (
                  <List>
                    <List.Item>
                      <FileItem file={fileList[fileList.length - 1]}></FileItem>
                    </List.Item>
                  </List>
                )} */}
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
                        <>{showInput ? <FileItem file={item}></FileItem> : value}</>
                      ),
                    },
                    {
                      title: '修改日期',
                      dataIndex: 'lastWriteTime',
                      key: 'lastWriteTime',
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
