import { getCurrentUserinfo } from '@/api/user'
import {
  IArticle,
  IProblem,
  IMonacoConfig,
  User,
  IPersonalizeConfig
} from '@/vite-env'
import { select } from 'd3'
import { atom, atomFamily, selector } from 'recoil'

export const userInfoState = selector<User>({
  key: 'userInfoState',
  get: async () => {
    const res = await getCurrentUserinfo()
    return res.data.data.user
  },
  set: ({ set }, newValue) => {
    set(userInfoState, newValue)
  }
})

export const monacoConfigState = selector<IMonacoConfig>({
  key: 'monacoConfigState',
  get: ({ get }) => {
    const userInfo = get(userInfoState)
    if (userInfo?.res_long === '' || !userInfo) {
      return {
        language: 'cpp',
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
