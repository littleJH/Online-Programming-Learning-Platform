import { getCurrentUserinfo, getUserInfoApi } from '@/api/user'
import {
  IArticle,
  IProblem,
  IMonacoConfig,
  User,
  IPersonalizeConfig
} from '@/vite-env'
import { atom, selector } from 'recoil'
import { redirect } from 'react-router-dom'

export const userInfoAtomState = atom<User | null>({
  key: 'userInfoAtomState',
  default: getCurrentUserinfo().then(res => {
    if (res.data.code === 200) return Promise.resolve(res.data.data.user)
    else return null
  })
})

export const userInfoState = selector<User | null>({
  key: 'userInfoState',
  get: ({ get }) => {
    const info = get(userInfoAtomState)
    if (info) return get(userInfoAtomState)
    else return null
  },
  set: ({ set }, newValue) => {
    set(userInfoAtomState, newValue)
  }
})

export const loginStatusState = selector<boolean>({
  key: 'loginStatusState',
  get: ({ get }) => {
    if (get(userInfoState)) return true
    else return false
  }
})

export const monacoConfigState = selector<IMonacoConfig>({
  key: 'monacoConfigState',
  get: ({ get }) => {
    const userInfo = get(userInfoState)
    if (userInfo?.res_long === '' || !userInfo) {
      return {
        language: 'C',
        theme: 'vs-dark',
        options: {
          fontSize: 14,
          fontWeight: '400',
          lineHeight: 24,
          letterSpacing: 1,
          smoothScrolling: true,
          cursorSmoothCaretAnimation: 'on',
          emptySelectionClipboard: true,
          mouseWheelScrollSensitivity: 1,
          mouseWheelZoom: true,
          padding: {
            bottom: 10,
            top: 10
          }
        }
      }
    } else {
      const config = JSON.parse(userInfo?.res_long) as IPersonalizeConfig
      console.log(config.monacoConfig)
      return config.monacoConfig
    }
  }
})

export const currentArticleState = atom<null | IArticle>({
  key: 'articleState',
  default: null
})

export const currentProblemState = atom<null | IProblem>({
  key: 'problemState',
  default: null
})
