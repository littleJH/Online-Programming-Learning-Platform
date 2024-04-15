import { useEffect, useRef, useState } from 'react'
import { directorySelectKeysState } from '@/components/directory/store'
import { useNavigate } from 'react-router-dom'
import {
  headerNavState,
  isMobileAtom,
  loginStatusState,
  notificationApi,
  pathNameState,
  searchQueryState,
  sideBarTypeState,
} from '@/store/appStore'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import utils from '../myUtils/utils'
import { RecoilState, useRecoilState } from 'recoil'

const useCountdown = (initCount = 10, callback: any) => {
  const [count, setcount] = useState<number>(initCount)
  const counter = useRef(null)

  useEffect(() => {
    if (count <= 0) {
      clearInterval(counter.current as any)
      setTimeout(() => {
        callback()
      }, 1000)
    }
  }, [count])

  const start = () => {
    setcount(initCount)
    const interval = setInterval(() => {
      setcount((count) => count - 1)
    }, 1000)
    counter.current = interval as any
  }

  useEffect(() => {
    return () => {
      clearInterval(counter.current as any)
    }
  }, [])

  return {
    count,
    start,
  }
}

const useListenContentScroll = (options: { followScroll?: boolean; loadMoreFn?: () => void }) => {
  const { followScroll, loadMoreFn } = options
  const setKeys = useSetRecoilState(directorySelectKeysState)
  const headings = useRef<NodeListOf<HTMLElement>>()
  const contentElRef = useRef<HTMLElement>()
  let loadLock = useRef<boolean>(false)

  useEffect(() => {
    contentElRef.current = document.getElementById('content') || undefined
    if (contentElRef.current) {
      followScroll && contentElRef.current.addEventListener('scroll', handler1)
      loadMoreFn && contentElRef.current.addEventListener('scroll', handler2)
    }
    return () => {
      if (contentElRef.current) {
        followScroll && contentElRef.current.removeEventListener('scroll', handler1)
        loadMoreFn && contentElRef.current.removeEventListener('scroll', handler2)
      }
    }
  }, [])

  const handler1 = (e: any) => {
    if (followScroll && contentElRef.current) {
      if (!headings.current)
        headings.current = contentElRef.current?.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
      setDirectoryKeys([e.target.scrollTop])
    }
  }

  const handler2 = (e: any) => {
    if (loadMoreFn && e.target.scrollTop + e.target.clientHeight + 100 > e.target.scrollHeight) {
      if (!loadLock.current) {
        loadMoreFn()
        loadLock.current = true
        setTimeout(() => {
          loadLock.current = false
        }, 3000)
      }
    }
  }

  const setDirectoryKeys = utils.throttle((scrollTop: number) => {
    if (headings.current) {
      let index = 1
      for (let item of headings.current) {
        if (item.offsetTop >= scrollTop + 14 + 24) {
          setKeys([headings.current[index - 1].id])
          break
        }
        index++
      }
    }
  }, 0)
}

const useNavTo = (options?: { back: number }) => {
  const nav = useNavigate()
  const isMobile = useRecoilValue(isMobileAtom)
  const setPathNameState = useSetRecoilState(pathNameState)
  const serSearchQuery = useSetRecoilState(searchQueryState)
  const loginStatus = useRecoilValue(loginStatusState)
  const setSideBarType = useSetRecoilState(sideBarTypeState)
  const navTo = (path: string) => {
    const authPath = ['profile']
    const pathArr = utils.getPathArray(path)
    const shouldAuth = authPath.includes(pathArr[0])

    if (shouldAuth && !loginStatus) {
      nav('/login')
    } else {
      setSideBarType(isMobile ? 'none' : utils.getSideBarType(path))
      nav(path)
    }
    setPathNameState(location.pathname)
    serSearchQuery(location.search)
  }

  return navTo
}

const useThrottleFn = <T, U extends any[]>(fn: (...args: U) => T, ms: number = 500, args: U) => {
  const [state, setstate] = useState<T | null>(null)
  const timeout = useRef<ReturnType<typeof setTimeout>>()
  const nextArgs = useRef<U>()

  useEffect(() => {
    if (!timeout.current) {
      setstate(fn(...args))

      const timeoutCallback = () => {
        if (nextArgs.current) {
          setstate(fn(...nextArgs.current))
          nextArgs.current = undefined
          timeout.current = setTimeout(timeoutCallback, ms)
        } else {
          timeout.current = undefined
        }
      }
    } else {
      nextArgs.current = args
    }
  }, [args])

  useEffect(() => () => timeout.current && clearTimeout(timeout.current))

  return state
}

const useUpdateState = function <K extends object>(store: RecoilState<K>) {
  const [state, setState] = useRecoilState(store)
  return function updateData<T extends K[keyof K]>(
    params: { [key: string]: T } | ((state: K) => { [key: string]: T })
  ): void {
    if (typeof params === 'function') {
      setState((state) => ({ ...state, ...params(state) }))
    } else if (typeof params === 'object') {
      setState((state) => ({ ...state, ...params }))
    }
  }
}

// const useUpdateAtomState = function <K>() {
//   return function <T extends K[keyof K]>(state: RecoilState<T>, value: T) {

//   }
// }

const useWsConnect = (options: {
  wsUrl?: string
  onMessage?: (message: any) => void
  onOpen?: (e: Event) => void
  onClose?: (e: Event) => void
  immediately?: boolean
  onTimeout?: (retryTime: number) => void
  onFail?: () => void
}) => {
  const { wsUrl, onMessage, onOpen, onClose, onTimeout, onFail, immediately = true } = options
  const notification = useRecoilValue(notificationApi)
  let ws: WebSocket
  // let retryTime = 0

  useEffect(() => {
    immediately && connectWs()
    return () => {
      console.log('useWsConnect close', new Date())
      closeWs()
    }
  }, [])

  const connectWs = (url?: string) => {
    // if (ws && ws.readyState === ws.OPEN) return

    ws = new WebSocket(url || wsUrl || '')

    ws.onopen = (e: Event) => {
      console.log('chatWsOpen...', new Date())
      onOpen && onOpen(e)
    }
    ws.onmessage = (e: MessageEvent) => {
      const message = JSON.parse(e.data)
      console.log('chatWsMessage ==> ', message, new Date())
      onMessage && onMessage(message)
    }
    ws.onclose = (e: Event) => {
      console.log('chatWsClose...', new Date())
      onClose && onClose(e)
      // retryTime++
      // if (retryTime < 3) {
      //   notification &&
      //     notification.warning({
      //       message: '连接超时',
      //       description: `正在为您第${retryTime}次重连中 ...`,
      //       duration: 3,
      //     })
      //   connectWs()
      // } else {
      //   onFail && onFail()
      //   notification &&
      //     notification.error({
      //       message: '连接失败',
      //       description: '请刷新页面重试',
      //     })
      // }
    }
    ws.onerror = (e: Event) => {
      console.log('chatWsError...')
      // onClose && onClose(e)
    }
  }

  const closeWs = () => {
    console.log('before websocket close ==> ', ws)
    ws && ws.close()
    // retryTime = 0
  }

  return { connectWs, closeWs }
}

const myHooks = {
  useCountdown,
  useListenContentScroll,
  useNavTo,
  useThrottleFn,
  useUpdateState,
  useWsConnect,
}

export default myHooks
