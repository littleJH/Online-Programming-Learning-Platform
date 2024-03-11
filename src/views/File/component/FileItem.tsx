import { IFile } from '@/type'
import { Descriptions, Input, InputRef, List, Modal, Popover, theme } from 'antd'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { IFileStore, fileStoreSelector } from '../fileStore'
import myHooks from '@/tool/myHooks/myHooks'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import style from '../style.module.scss'
import { downloadFileApi, makeDirectoryApi, renameFileApi } from '@/api/file'

interface IProps {
  file: IFile
}

const FileItem: React.FC<IProps> = (props) => {
  const { file } = props
  const { viewType, inputText, currentPath, fileList, fileIconSize, openMenuItem, showInput } =
    useRecoilValue(fileStoreSelector)
  const updateState = myHooks.useUpdateState<IFileStore>(fileStoreSelector)
  const [isEdit, setIsEdit] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<InputRef>(null)
  const { token } = theme.useToken()

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.setSelectionRange(0, file.name.length)
    }
    itemRef.current &&
      itemRef.current.addEventListener('contextmenu', eventHandler.handleContextMenu, { passive: false })
  }, [])

  const eventHandler = {
    handleMakeDirectory: async (type: 'rename' | 'new') => {
      if (type === 'new') {
        const text = fileList.findIndex((item) => item.name === inputText) < 0 ? inputText : `${inputText}(1)`
        const res = await makeDirectoryApi(currentPath.path, text)
        updateState((state) => ({
          ...state,
          showInput: false,
          fileList: res.data.data === 200 ? state.fileList : state.fileList.slice(0, state.fileList.length - 2),
        }))
      } else if (type === 'rename') {
        setIsEdit(false)
        const res = await renameFileApi(currentPath, inputText)
        res.data.code === 200 &&
          updateState((state) => {
            const fileList = [...state.fileList]
            fileList[fileList.findIndex((item) => item.name === inputText)].name = inputText
            console.log('after rename filelist => ', fileList)
            return {
              ...state,
              fileList,
              currentPath: {
                path: state.currentPath.path,
                name: inputText,
              },
            }
          })
      }
    },
    handleClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      updateState({
        currentPath: {
          path: file.path,
          name: file.name,
        },
      })
    },
    handleDoubleClick: async (e: React.MouseEvent) => {
      if (file.type.toLowerCase() === 'dir') {
        updateState((state) => ({
          currentPath: {
            path: file.path + '/' + file.name,
            name: '',
          },
        }))
      } else {
        const res = await downloadFileApi(file.path, file.name)
      }
    },
    handleContextMenu: (e: Event) => {
      updateState({
        openMenuItem: file.name,
      })
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
          },
          {
            label: '文件大小',
            children: file.size,
          },
          {
            label: '修改时间',
            children: file.lastWriteTime,
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
            <span>{`${item.children}`}</span>
          </p>
        ))}
      </div>
    ),
    menuList: () => {
      const menuItems = [
        {
          label: '下载',
          onclick: async () => {
            const res = await downloadFileApi(file.path, file.name)
          },
        },
        {
          label: '复制',
          onclick: () => {},
        },
        {
          label: '剪切',
          onclick: () => {},
        },
        {
          label: '重命名',
          onclick: () => {
            setIsEdit(true)
            setTimeout(() => {
              inputRef.current?.focus()
              inputRef.current?.setSelectionRange(0, file.name.length)
            }, 0)
          },
        },
        {
          label: '删除',
          onclick: () => {},
        },
        {
          label: '详细信息',
          onclick: () => {
            setOpenModal(true)
          },
        },
      ]
      return (
        <List
          size="small"
          dataSource={menuItems}
          renderItem={(item, index) => (
            <List.Item
              style={{
                padding: '0',
              }}
              key={index}
            >
              <div className={style.menuItem} onClick={item.onclick}>
                {item.label}
              </div>
            </List.Item>
          )}
        ></List>
      )
    },
    inputEl: (type: 'new' | 'rename') => (
      <Input
        size="small"
        ref={inputRef}
        onPressEnter={() => eventHandler.handleMakeDirectory(type)}
        onBlur={() => eventHandler.handleMakeDirectory(type)}
        defaultValue={file.name}
        onChange={(e) => updateState({ inputText: e.target.value })}
      ></Input>
    ),
  }

  return (
    <div ref={itemRef}>
      {viewType === 'list' && (
        // <Popover mouseEnterDelay={1.5} content={render.detailContent()}>
        <Popover placement="right" open={openMenuItem === file.name} arrow={false} content={render.menuList()}>
          <div
            id="fileItem"
            className={`${style.fileItem} flex-col justify-center items-center cursor-pointer rounded`}
            style={{
              maxWidth: 'min-content',
              backgroundColor: currentPath.name === file.name ? token.colorInfoBg : '',
            }}
            onDoubleClick={eventHandler.handleDoubleClick}
            onClick={eventHandler.handleClick}
          >
            <MySvgIcon href={`${file.type.replace(/\./g, '').toUpperCase()}`} size={`${fileIconSize}px`}></MySvgIcon>
            <div className={style.name}>{isEdit ? render.inputEl('rename') : file.name}</div>
          </div>
        </Popover>
        // </Popover>
      )}
      {viewType === 'table' && <div>{render.inputEl('new')}</div>}
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
