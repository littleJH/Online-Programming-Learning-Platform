import { getCurrentUserinfo } from '@/api/user'
import { IArticle, IProblem, IMonacoOptions, User, IToc, ICompetition, TypeSideBar, IPost } from '@/type'
import { atom, selector } from 'recoil'
import utils from '@/tool/myUtils/utils'
import { themeDefault, monacoOptionsDefault } from '@/config/config'
import { NotificationInstance } from 'antd/es/notification/interface'
import { MessageInstance } from 'antd/es/message/interface'

// 用户信息初始化
export const userInfoAtomState = atom<User | null>({
  key: 'userInfoAtomState',
  default: getCurrentUserinfo()
    .then((res) => {
      if (res.data.code === 200) return Promise.resolve(res.data.data.user)
      else return null
    })
    .catch(() => {
      if (['/login', '/home', '/'].includes(location.pathname)) return
      const a = document.createElement('a')
      a.href = '/login'
      a.click()
    }),
})

// 用户信息
export const userInfoState = selector<User | null>({
  key: 'userInfoState',
  get: ({ get }) => get(userInfoAtomState),
  set: ({ set }, newValue) => {
    console.log('userInfo newValue ==> ', newValue)
    set(userInfoAtomState, newValue)
  },
})

// 登录状态
export const loginStatusState = selector<boolean>({
  key: 'loginStatusState',
  get: ({ get }) => (get(userInfoState) ? true : false),
})

// 全局主题
export const themeState = selector({
  key: 'themeState',
  get: ({ get }) => {
    const userInfo = get(userInfoState)
    if (userInfo?.res_long === '' || !userInfo) return themeDefault
    else {
      console.log(userInfo.theme)
      const theme = JSON.parse(userInfo.theme !== '' ? userInfo.theme : '{}')
      const globalStyle = document.getElementsByTagName('body')[0].style
      for (let key in theme) {
        if (theme[key]) {
          globalStyle.setProperty(`--${key}`, `${theme[key]}`)
        }
      }
      return { ...themeDefault, ...theme }
    }
  },
  set: ({ set, get }, newValue) => {
    const userInfo = get(userInfoState) as User
    const theme = JSON.parse(userInfo.theme !== '' ? userInfo.theme : '{}')
    const newTheme = { ...theme, ...newValue }
    console.log('new theme ==> ', newTheme)
    set(userInfoState, {
      ...userInfo,
      theme: JSON.stringify(newTheme),
    })
    const globalStyle = document.getElementsByTagName('body')[0].style
    for (let key in newTheme) {
      if (newTheme[key]) {
        globalStyle.setProperty(`--${key}`, `#${newTheme[key]}`)
      }
    }
  },
})

// 用户代码编辑器设置
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
      monaco_options: JSON.stringify(newValue),
    }
    set(userInfoState, newInfo)
  },
})

// 用户代码编辑器主题偏好
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
      monaco_theme: String(newValue),
    }
    set(userInfoState, newInfo)
  },
})

// 用户编程语言偏好
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
      language: String(newValue),
    }
    set(userInfoState, newInfo)
  },
})

export const currentArticleState = atom<null | IArticle>({
  key: 'articleState',
  default: null,
})

export const currentProblemState = atom<null | IProblem>({
  key: 'problemState',
  default: null,
})

export const currentPostState = atom<null | IPost>({
  key: 'postState',
  default: null,
})

export const pathNameState = atom<string>({
  key: 'pathNameState',
  default: location.pathname,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        console.log('pathNameState ==> ', newValue)
      })
    },
  ],
})

export const searchQueryState = atom<string>({
  key: 'searchQueryState',
  default: location.search,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        console.log('searchQueryState ==> ', newValue)
      })
    },
  ],
})

// 头部导航栏状态
export const headerNavState = selector<string>({
  key: 'headerNavState',
  get: ({ get }) => {
    const pathname = get(pathNameState)
    return utils.getPathArray(pathname)[0]
  },
})

// sidebar 类型
export const sideBarTypeState = atom<TypeSideBar>({
  key: 'sideBarTypeState',
  default: 'none',
})

// nogification 全局api
export const notificationApi = atom<NotificationInstance | null>({
  key: 'notificationApi',
  default: null,
})

// 是否为黑暗主题
export const isDarkState = atom<boolean>({
  key: 'isDarkState',
  default: (async () => {
    const themeMedia = window.matchMedia('(prefers-color-scheme: dark)')
    let isDark = localStorage.getItem('isDark') || themeMedia.matches
    return Promise.resolve(isDark === 'true')
  })(),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue) => {
        localStorage.setItem('isDark', String(newValue))
      })
    },
  ],
})

// 是否为移动端
export const isMobileAtom = atom<boolean>({
  key: 'isMobileAtom',
  default: (async () => {
    return utils.getIsMobile()
  })(),
})

// 是否开启监听content滚动，加载更多
// export const openLoadmoreState = atom<boolean>({
//   key: 'openLoadmoreState',
//   default: false
// })

// 是否开启监听content滚动，目录跟随滚动
// export const openFollowScroll = atom<boolean>({
//   key: 'openFollowScroll',
//   default: false
// })
