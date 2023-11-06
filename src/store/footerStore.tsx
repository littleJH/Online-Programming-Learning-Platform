import React from 'react'
import { atom } from 'recoil'

export const footerRightNode = atom<React.ReactNode>({
  key: 'footerRightNodeState',
  default: ''
})

export const footerLeftNode = atom<React.ReactNode>({
  key: 'footerLeftNodeState',
  default: (async () => {
    const node: React.ReactNode = ''
    return Promise.resolve(node)
  })()
})
