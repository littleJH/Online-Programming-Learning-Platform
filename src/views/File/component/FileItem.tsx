import { IFile } from '@/type'
import { Dropdown, Input, InputRef, List, Modal, Popover, Space, theme } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { IFileStore, atoms, fileStoreSelector } from '../fileStore'
import myHooks from '@/tool/myHooks/myHooks'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import style from '../style.module.scss'
import {
  deleteDirApi,
  deleteFileApi,
  downloadFileApi,
  makeDirectoryApi,
  moveCopyFileApi,
  renameFileApi,
  unzipFileApi,
} from '@/api/file'
import { notificationApi } from '@/store/appStore'
import dayjs from 'dayjs'
import { DownOutlined } from '@ant-design/icons'

interface IProps {
  file: IFile
  onlyNew?: boolean
  onlyMenu?: boolean
  fetchFileList?: (path?: string) => Promise<boolean>
}

const FileItem: React.FC<IProps> = (props) => {
  const { file, fetchFileList, onlyMenu, onlyNew } = props
  const { viewType, copyFile, currentPath, fileList, fileIconSize, selectedFile, cutFile } =
    useRecoilValue(fileStoreSelector)
  const setFileList = useSetRecoilState(atoms.fileListState)
  const setBackStack = useSetRecoilState(atoms.backStackState)
  const setForwardStack = useSetRecoilState(atoms.forwardStackState)
  const setCurrentPath = useSetRecoilState(atoms.currentPathState)
  const setInputText = useSetRecoilState(atoms.inputTextState)
  const setSelectedFile = useSetRecoilState(atoms.selectedFileState)
  const setCopyFile = useSetRecoilState(atoms.copyFileState)
  const setCutFile = useSetRecoilState(atoms.cutFileState)
  // const updateState = myHooks.useUpdateState<IFileStore>(fileStoreSelector)
  const [openModal, setOpenModal] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<InputRef>(null)
  const { token } = theme.useToken()
  const notification = useRecoilValue(notificationApi)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(0, file.name.length)
    }
    itemRef.current && itemRef.current.addEventListener('contextmenu', eventHandler.handleContextMenu)
    return () => {
      itemRef.current && itemRef.current.removeEventListener('contextmenu', eventHandler.handleContextMenu)
    }
  }, [selectedFile])

  const iconHref = useMemo(() => {
    if (file.type === 'NEW_DIR') return 'DIR'
    else if (file.type.includes('RENAME')) return file.type.replace('RENAME_', '')
    else return file.type
  }, [file])

  const eventHandler = {
    handleMakeDirectory: async (type: string, inputText: string) => {
      if (type === 'NEW_DIR') {
        const text = fileList.findIndex((item) => item.name === inputText) < 0 ? inputText : `${inputText}(1)`
        try {
          await makeDirectoryApi(currentPath, text)
        } catch {}
      } else if (type.includes('RENAME')) {
        try {
          await renameFileApi(file.path, inputText)
        } catch {}
      }
      fetchFileList && fetchFileList()
    },
    handleClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      if (e.ctrlKey) {
        setSelectedFile((value) => {
          const files = [...value]
          const index = files.findIndex((item) => item.name === file.name)
          return index < 0 ? [...value, file] : [...files.slice(0, index), ...files.slice(index + 1, files.length - 1)]
        })
      } else {
        setSelectedFile([file])
      }
    },
    handleDoubleClick: async (e: React.MouseEvent) => {
      if (file.type.toLowerCase() === 'dir' && fetchFileList) {
        const done = await fetchFileList(file.path.replace(/\.\/file/g, ''))
        if (done) {
          setBackStack([])
          setForwardStack((value) => [...value, file.path])
          setCurrentPath(file.path)
        }
      } else {
        await downloadFileApi('./file' + file.path)
      }
    },
    handleContextMenu: (e: Event) => {
      e.preventDefault()
      selectedFile.findIndex((item) => item.name === file.name) < 0 && setSelectedFile([file])
      // setFileList((value) =>
      //   value.map((item) => (item.name === file.name ? { ...item, openMenu: true } : { ...item, openMenu: false }))
      // )
    },
  }

  const render = {
    detailContent: () => (
      <div
        style={{
          maxWidth: 'min-content',
        }}
      >
        {[
          {
            label: '文件名',
            children: file.name,
            render: (value: string) => value.replace(/\.[^.]+$/, ''),
          },
          {
            label: '文件路径',
            children: file.path,
          },
          {
            label: '文件大小',
            children: file.size,
          },
          {
            label: '修改时间',
            children: file.lastWriteTime,
            render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            label: '文件类型',
            children: file.type,
          },
        ].map((item) => (
          <p
            key={item.label}
            style={{
              fontSize: '0.9rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              margin: '0.5rem 0',
            }}
          >
            <span>{`${item.label}：`}</span>
            <span>{`${item.render ? item.render(item.children) : item.children}`}</span>
          </p>
        ))}
      </div>
    ),
    menuList: () => {
      const menuItems = [
        {
          key: 'download',
          label: '下载',
          onclick: async () => {
            const res = await downloadFileApi(file.path)
          },
        },
        {
          key: 'copy',
          label: '复制',
          onclick: () => {
            setCopyFile([...selectedFile])
            setCutFile([])
          },
        },
        {
          key: 'cut',
          label: '剪切',
          onclick: () => {
            setCutFile([...selectedFile])
            setCopyFile([])
          },
        },
        {
          key: 'sticky',
          label: '粘贴',
          disabled: copyFile.length === 0 && cutFile.length === 0,
          onclick: async () => {
            // const res = await moveCopyFileApi({path: , name: }, )
          },
        },
        {
          key: 'unzip',
          label: '解压',
          disabled: file.type.toLowerCase() !== 'zip',
          onclick: async () => {
            try {
              const res = await unzipFileApi(file.path, currentPath)
              if (res.data.code === 200) {
                await deleteFileApi(file.path)
              }
            } catch {}
            fetchFileList && fetchFileList()
          },
        },
        {
          key: 'rename',
          label: '重命名',
          onclick: (e: any) => {
            e.domEvent.stopPropagation()
            const filelistClone = [...fileList]
            const list = filelistClone.map((item) =>
              item.name === file.name ? { ...item, type: `RENAME_${file.type}` } : item
            )
            // updateState({
            //   inputText: file.name,
            //   fileList: list,
            // })
            setInputText(file.name)
            setFileList(list)
            setTimeout(() => {
              inputRef.current?.focus()
              inputRef.current?.setSelectionRange(0, file.name.length)
            }, 0)
          },
        },

        {
          key: 'detail',
          label: '详细信息',
          onclick: () => {
            setOpenModal(true)
          },
        },
        {
          key: 'delete',
          label: '删除',
          danger: true,
          onclick: async () => {
            for (let file of selectedFile) {
              let res = null
              try {
                if (file.type.toLowerCase() === 'dir') {
                  res = (await deleteDirApi(file.path)).data.code
                } else {
                  res = (await deleteFileApi(file.path)).data.code
                }
                if (res === 200 && notification) {
                  notification.success({
                    message: `${file.name} 删除成功`,
                  })
                }
              } catch {}
            }

            fetchFileList && fetchFileList()
          },
        },
      ]
      return menuItems.map((item) => ({
        key: item.key,
        label: <span>{item.label}</span>,
        danger: item?.danger || false,
        disabled: item?.disabled || false,
        onClick: (info: any) => item.onclick(info),
      }))
    },
    inputEl: (type: string) => (
      <Input
        size="small"
        ref={inputRef}
        onPressEnter={(e) => eventHandler.handleMakeDirectory(type, e.currentTarget.value)}
        onBlur={(e) => eventHandler.handleMakeDirectory(type, e.currentTarget.value)}
        defaultValue={file.name}
      ></Input>
    ),
  }

  return (
    <div ref={itemRef}>
      {viewType === 'list' && (
        <Popover mouseEnterDelay={1} content={render.detailContent()}>
          <Dropdown trigger={['contextMenu']} arrow={false} placement="bottom" menu={{ items: render.menuList() }}>
            <div
              id="fileItem"
              className={style.fileItem}
              style={{
                backgroundColor: selectedFile.find((item) => item.name === file.name) ? token.colorInfoBg : '',
              }}
              onDoubleClick={eventHandler.handleDoubleClick}
              onClick={eventHandler.handleClick}
            >
              <MySvgIcon href={iconHref} size={`${fileIconSize}px`}></MySvgIcon>
              <div className={selectedFile.find((item) => item.name === file.name) ? style.name : style.ellipsisName}>
                <span>
                  {file.type.includes('RENAME') || file.type === 'NEW_DIR' ? render.inputEl(file.type) : file.name}
                </span>
              </div>
            </div>
          </Dropdown>
        </Popover>
      )}
      {onlyNew && <div>{render.inputEl('NEW_DIR')}</div>}
      {onlyMenu && (
        <Dropdown arrow={false} placement="bottom" menu={{ items: render.menuList() }}>
          <a
            onClick={(e) => e.preventDefault()}
            style={{
              fontSize: '0.9rem',
            }}
          >
            <Space>
              <span>操作</span>
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      )}
      <Modal
        open={openModal}
        title={'文件信息'}
        footer={[]}
        onCancel={() => setOpenModal(false)}
        // afterOpenChange={() => updateState({ openMenuItem: '' })}
      >
        {render.detailContent()}
      </Modal>
    </div>
  )
}

export default FileItem
