import React from 'react'
import { atom } from 'recoil'

export const siderNodeState = atom<React.ReactNode>({
  key: 'siderNodeState',
  default: '',
})
