import { useEffect, useRef, useState } from 'react'
import { directorySelectKeysState } from '@/components/directory/store'
import { useNavigate } from 'react-router-dom'
import {
  headerNavState,
  isMobileAtom,
  loginStatusState,
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
  let loadLock = useRef<boolean>(false)
  let flag = 0

  useEffect(() => {
    const contentEl = document.getElementById('content')
    if (contentEl) {
      followScroll && contentEl.addEventListener('scroll', (e) => handler1(e, contentEl))
      loadMoreFn && contentEl.addEventListener('scroll', (e) => handler2(e))
    }
    return () => {
      if (contentEl) {
        followScroll && contentEl.removeEventListener('scroll', (e) => handler1(e, contentEl))
        loadMoreFn && contentEl.removeEventListener('scroll', (e) => handler2(e))
      }
    }
  }, [])

  const handler1 = (e: any, contentEl: HTMLElement) => {
    if (followScroll) {
      if (!headings.current) headings.current = contentEl?.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
      setDirectoryKeys([e.target.scrollTop])
    }
  }

  const handler2 = (e: any) => {
    if (loadMoreFn && e.target.scrollTop + e.target.clientHeight + 100 > e.target.scrollHeight) {
      console.log('lock ==> ', loadLock.current)
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
    console.log('scrollTop ==> ', scrollTop)
    if (headings.current) {
      let index = 0
      for (let item of headings.current) {
        // 向下滚动
        // if (flag < scrollTop) {
        // 当前滚动位置以下的第一个item
        if (item.offsetTop >= scrollTop + 14 + 24) {
          console.log('↓↑ item ==> ', item.offsetTop)
          setKeys([headings.current[index - 1].id])
          break
        }
        // }
        // 向上滚动
        // else {
        //   // 当前滚动位置以上的第一个item
        //   if (item.offsetTop >= scrollTop - 14 - 24) {
        //     console.log('↑ item ==> ', item.offsetTop)
        //     setKeys([item.id])
        //     break
        //   }
        // }
        index++
      }
    }
    // flag = scrollTop
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
  wsApi?: WebSocket | null
  onMessage?: (message: any) => void
  onOpen?: () => void
  immediately?: boolean
}) => {
  const { wsApi, onMessage, onOpen, immediately = true } = options
  let ws: WebSocket

  useEffect(() => {
    immediately && wsApi && connectWs(wsApi)
    const interval = setInterval(() => {
      if (ws && ws.readyState === ws.CLOSED) {
        console.log('reOpenWs...')
        wsApi && connectWs(wsApi)
      }
    }, 5000)
    return () => {
      clearInterval(interval)
      ws && ws.close()
    }
  }, [])

  const connectWs = (wsApi: WebSocket) => {
    ws = wsApi
    ws.onopen = (e: Event) => {
      console.log('chatWsOpen...')
      onOpen && onOpen()
    }
    ws.onmessage = async (e: MessageEvent) => {
      const message = JSON.parse(e.data)
      console.log('chatWsMessage ==> ', message)
      onMessage && onMessage(message)
    }
    ws.onclose = (e: Event) => {
      console.log('chatWsClose...')
    }
  }

  return { connectWs }
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
