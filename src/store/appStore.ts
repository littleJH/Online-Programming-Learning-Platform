import { getCurrentUserinfo } from '@/api/user'
import { IArticle, IProblem, IMonacoConfig, User, IPersonalizeConfig } from '@/type'
import { atom, selector } from 'recoil'
import { notification } from 'antd'
import { getPathArray } from '@/tool/MyUtils/utils'
import { themeDefault, monacoConfigDefault } from '@/config/config'

export const userInfoAtomState = atom<User | null>({
  key: 'userInfoAtomState',
  default: getCurrentUserinfo()
    .then((res) => {
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

export const userInfoState = selector<User | null>({
  key: 'userInfoState',
  get: ({ get }) => (get(userInfoAtomState) ? get(userInfoAtomState) : null),
  set: ({ set }, newValue) => {
    set(userInfoAtomState, newValue)
  }
})

export const loginStatusState = selector<boolean>({
  key: 'loginStatusState',
  get: ({ get }) => (get(userInfoState) ? true : false)
})

export const themeState = selector({
  key: 'themeState',
  get: ({ get }) => {
    const userInfo = get(userInfoState)
    if (userInfo?.res_long === '' || !userInfo) return themeDefault
    else {
      console.log('personalConfig ==> ', JSON.parse(userInfo.res_long))
      const { theme } = JSON.parse(userInfo.res_long) as IPersonalizeConfig
      return { ...themeDefault, ...theme }
    }
  },
  set: ({ set }, newValue) => {
    console.log({ ...newValue })
  }
})

export const monacoConfigState = selector<IMonacoConfig>({
  key: 'monacoConfigState',
  get: ({ get }) => {
    const userInfo = get(userInfoState)
    if (userInfo?.res_long === '' || !userInfo) {
      return monacoConfigDefault
    } else {
      const { monacoConfig } = JSON.parse(userInfo?.res_long) as IPersonalizeConfig
      return { ...monacoConfigDefault, ...monacoConfig }
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

export const pathNameState = atom<string>({
  key: 'pathNameState',
  default: location.pathname,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        console.log('pathNameState ==> ', newValue)
      })
    }
  ]
})

export const headerNavState = selector<string>({
  key: 'headerNavState',
  get: ({ get }) => {
    const pathname = get(pathNameState)
    return getPathArray(pathname)[0]
  }
})

export const sideBarCollapsed = atom<boolean>({
  key: 'sideBarCollapsed',
  default: false
})
