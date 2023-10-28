import { getCurrentUserinfo } from '@/api/user'
import {
  IArticle,
  IProblem,
  IMonacoConfig,
  User,
  IPersonalizeConfig
} from '@/type'
import { atom, selector } from 'recoil'
import { notification } from 'antd'
import { getPathArray } from '@/tool/MyUtils/utils'

const userInfoAtomState = atom<User | null>({
  key: 'userInfoAtomState',
  default: getCurrentUserinfo()
    .then(res => {
      if (res.data.code === 200) return Promise.resolve(res.data.data.user)
      else return null
    })
    .catch(() => {
      if (['/login'].includes(location.pathname)) return
      notification.error({
        message: '获取个人信息失败',
        description: '请检查登录状态'
      })
      const a = document.createElement('a')
      a.href = '/login'
      a.click()
    })
})

const userInfoState = selector<User | null>({
  key: 'userInfoState',
  get: ({ get }) => (get(userInfoAtomState) ? get(userInfoAtomState) : null),
  set: ({ set }, newValue) => {
    set(userInfoAtomState, newValue)
  }
})

const loginStatusState = selector<boolean>({
  key: 'loginStatusState',
  get: ({ get }) => (get(userInfoState) ? true : false)
})

const monacoConfigState = selector<IMonacoConfig>({
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

const currentArticleState = atom<null | IArticle>({
  key: 'articleState',
  default: null
})

const currentProblemState = atom<null | IProblem>({
  key: 'problemState',
  default: null
})

const pathNameState = atom<string>({
  key: 'pathNameState',
  default: location.pathname,
  effects: [
    ({ onSet }) => {
      onSet(newValue => {
        console.log('pathNameState ==> ', newValue)
      })
    }
  ]
})

const headerNavState = selector<string>({
  key: 'headerNavState',
  get: ({ get }) => {
    const pathname = get(pathNameState)
    return getPathArray(pathname)[0]
  }
})

export {
  userInfoAtomState,
  userInfoState,
  loginStatusState,
  monacoConfigState,
  currentArticleState,
  currentProblemState,
  headerNavState,
  pathNameState
}
