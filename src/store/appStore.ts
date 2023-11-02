import { getCurrentUserinfo } from '@/api/user'
import { IArticle, IProblem, IMonacoOptions, User } from '@/type'
import { atom, selector } from 'recoil'
import { notification } from 'antd'
import { getPathArray } from '@/tool/myUtils/utils'
import { themeDefault, monacoOptionsDefault } from '@/config/config'
import { NotificationInstance } from 'antd/es/notification/interface'

export const userInfoAtomState = atom<User | null>({
  key: 'userInfoAtomState',
  default: getCurrentUserinfo()
    .then((res) => {
      if (res.data.code === 200) return Promise.resolve(res.data.data.user)
      else return null
    })
    .catch(() => {
      if (['/login'].includes(location.pathname)) return
      const a = document.createElement('a')
      a.href = '/login'
      a.click()
    })
})

export const userInfoState = selector<User | null>({
  key: 'userInfoState',
  get: ({ get }) => (get(userInfoAtomState) ? get(userInfoAtomState) : null),
  set: ({ set }, newValue) => {
    console.log('userInfo newValue ==> ', newValue)
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
      const theme = JSON.parse(userInfo.theme !== '' ? userInfo.theme : '{}')
      const globalStyle = document.getElementsByTagName('body')[0].style
      for (let key in theme) {
        if (theme[key]) {
          globalStyle.setProperty(`--${key}`, `#${theme[key]}`)
        }
      }
      return { ...themeDefault, ...theme }
    }
  },
  set: ({ set, get }, newValue) => {
    const userInfo = get(userInfoState) as User
    const theme = JSON.parse(userInfo.theme !== '' ? userInfo.theme : '{}')
    const newTheme = { ...theme, ...newValue }
    set(userInfoState, {
      ...userInfo,
      theme: newTheme
    })
    const globalStyle = document.getElementsByTagName('body')[0].style
    for (let key in newTheme) {
      if (newTheme[key]) {
        globalStyle.setProperty(`--${key}`, `#${newTheme[key]}`)
      }
    }
  }
})

export const monacoOptionsState = selector<IMonacoOptions>({
  key: 'monacoOptionsState',
  get: ({ get }) => {
    const userInfo = get(userInfoState)
    if (userInfo?.monaco_options === '' || !userInfo) {
      return monacoOptionsDefault
    } else {
      const monaco_options = JSON.parse(userInfo?.monaco_options)
      return { ...monacoOptionsDefault, ...monaco_options }
    }
  },
  set: ({ set, get }, newValue) => {
    const userInfo = get(userInfoState) as User
    const newInfo = {
      ...userInfo,
      monaco_options: String(newValue)
    }
    set(userInfoState, newInfo)
  }
})

export const monacoThemeState = selector<string>({
  key: 'monacoThemeState',
  get: ({ get }) => {
    const userInfo = get(userInfoState)
    if (userInfo?.monaco_theme === '' || !userInfo) return 'vs-dark'
    else return userInfo.monaco_theme
  },
  set: ({ set, get }, newValue) => {
    const userInfo = get(userInfoState) as User
    const newInfo = {
      ...userInfo,
      monaco_theme: String(newValue)
    }
    set(userInfoState, newInfo)
  }
})

export const languageState = selector<string>({
  key: 'languageState',
  get: ({ get }) => {
    const userInfo = get(userInfoState)
    if (userInfo?.language === '' || !userInfo) return 'C++'
    else return userInfo.language
  },
  set: ({ set, get }, newValue) => {
    const userInfo = get(userInfoState) as User
    const newInfo = {
      ...userInfo,
      language: String(newValue)
    }
    set(userInfoState, newInfo)
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

export const notificationApi = atom<NotificationInstance | null>({
  key: 'notificationApi',
  default: null
})

export const isDarkState = atom<boolean>({
  key: 'isDarkState',
  default: (async () => {
    const isDark = Boolean(localStorage.getItem('isDark'))
    return Promise.resolve(isDark)
  })()
})
