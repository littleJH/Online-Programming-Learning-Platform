import { IFile } from '@/type'
import { Descriptions, Dropdown, Input, InputRef, List, Modal, Popover, Space, theme } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { IFileStore, fileStoreSelector } from '../fileStore'
import myHooks from '@/tool/myHooks/myHooks'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import style from '../style.module.scss'
import { deleteDirApi, deleteFileApi, downloadFileApi, makeDirectoryApi, renameFileApi } from '@/api/file'
import { notificationApi } from '@/store/appStore'
import dayjs from 'dayjs'
import { DownOutlined } from '@ant-design/icons'

interface IProps {
  file: IFile
  fetchFileList?: (path?: string) => Promise<boolean>
}

const FileItem: React.FC<IProps> = (props) => {
  const { file, fetchFileList } = props
  const { viewType, inputText, currentPath, fileList, fileIconSize, selectedFile } = useRecoilValue(fileStoreSelector)
  const updateState = myHooks.useUpdateState<IFileStore>(fileStoreSelector)
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
    // itemRef.current &&
    //   itemRef.current.addEventListener('contextmenu', eventHandler.handleContextMenu, { passive: false })
  }, [])

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
          const res = await makeDirectoryApi(currentPath, text)
          updateState((state) => ({
            showInput: false,
            fileList: res.data.data === 200 ? state.fileList : state.fileList.slice(0, state.fileList.length - 1),
          }))
        } catch {
          updateState((state) => ({
            showInput: false,
            fileList: state.fileList.slice(0, state.fileList.length - 1),
          }))
        }
      } else if (type.includes('RENAME')) {
        try {
          const res = await renameFileApi(file.path, inputText)
          updateState((state) => {
            return {
              fileList:
                res.data.code === 200
                  ? [...state.fileList].map((item) => (item.name === inputText ? { ...item, name: inputText } : item))
                  : [...state.fileList].map((item) =>
                      item.name === file.name ? { ...item, type: item.type.replace('RENAME_', '') } : item
                    ),
              currentPath: state.currentPath,
            }
          })
        } catch {
          updateState((state) => {
            return {
              fileList: [...state.fileList].map((item) =>
                item.name === file.name ? { ...item, type: item.type.replace('RENAME_', '') } : item
              ),
            }
          })
        }
      }
    },
    handleClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      if (e.ctrlKey) {
        updateState((state) => {
          const files = [...state.selectedFile]
          const index = files.findIndex((item) => item.name === file.name)
          return {
            selectedFile:
              index < 0
                ? [...state.selectedFile, file]
                : [...files.slice(0, index), ...files.slice(index + 1, files.length - 1)],
          }
        })
      } else {
        updateState({
          selectedFile: [file],
        })
      }
    },
    handleDoubleClick: async (e: React.MouseEvent) => {
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
    },
    // handleContextMenu: (e: Event) => {
    //   updateState({
    //     openMenuItem: file.name,
    //   })
    // },
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
          onclick: () => {},
        },
        {
          key: 'cut',
          label: '剪切',
          onclick: () => {},
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
            updateState({
              inputText: file.name,
              fileList: list,
            })
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
            let res = null
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
          },
        },
      ]
      return menuItems.map((item) => ({
        key: item.key,
        label: <span>{item.label}</span>,
        danger: item?.danger || false,
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
              className={`${style.fileItem} flex-col justify-center items-center cursor-pointer rounded`}
              style={{
                maxWidth: 'min-content',
                backgroundColor: selectedFile.find((item) => item.name === file.name) ? token.colorInfoBg : '',
              }}
              onDoubleClick={eventHandler.handleDoubleClick}
              onClick={eventHandler.handleClick}
            >
              <MySvgIcon href={iconHref} size={`${fileIconSize}px`}></MySvgIcon>
              <div className={style.name}>
                {file.type.includes('RENAME') || file.type === 'NEW_DIR' ? render.inputEl(file.type) : file.name}
              </div>
            </div>
          </Dropdown>
        </Popover>
      )}
      {viewType === 'table' && file.type === 'NEW_DIR' && <div>{render.inputEl('NEW_DIR')}</div>}
      {viewType === 'table' && (
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
