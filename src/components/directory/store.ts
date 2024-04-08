import { IToc } from '@/type'
import { atom } from 'recoil'

export const directoryDataState = atom<IToc[]>({
  key: 'directoryDataState',
  default: [],
  effects: [
    ({ onSet }) => {
      // 监听目录数据的变化
      onSet((newValue, oldValue, object) => {
        console.log('directoryDataState change ==> ', newValue)
      })
    },
  ],
})

export const directorySelectKeysState = atom<string[]>({
  key: 'directorySelectKeysState',
  default: [],
})
