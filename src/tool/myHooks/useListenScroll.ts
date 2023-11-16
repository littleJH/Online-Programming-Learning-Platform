import { directorySelectKeysState } from '@/components/directory/store'
import React, { useEffect, useRef } from 'react'
import { useSetRecoilState } from 'recoil'
import Throttle from '../myFns/Throttle'

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

  const setDirectoryKeys = Throttle((scrollTop: number) => {
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

export default useListenContentScroll
