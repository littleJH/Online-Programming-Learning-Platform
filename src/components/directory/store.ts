import { IToc } from '@/type'
import { atom } from 'recoil'

export const directoryDataState = atom<IToc[]>({
  key: 'directoryDataState',
  default: [],
})

export const directorySelectKeysState = atom<string[]>({
  key: 'directorySelectKeysState',
  default: [],
})
