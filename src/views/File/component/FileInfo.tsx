import { IFile } from '@/type'
import React from 'react'

const FileInfo: React.FC<{ file: IFile }> = ({ file }) => {
  return (
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
          label: '文件路径',
          children: file.path,
        },
        {
          label: '文件类型',
          children: file.type,
        },
        {
          label: '文件大小',
          children: file.size,
        },
        {
          label: '修改时间',
          children: file.lastWriteTime,
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
  )
}

export default FileInfo
