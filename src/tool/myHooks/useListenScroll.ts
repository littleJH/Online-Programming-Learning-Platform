import { directorySelectKeysState } from '@/components/directory/store'
import React, { useEffect, useRef } from 'react'
import { useSetRecoilState } from 'recoil'
import Throttle from '../myFns/throttle'

const useListenContentScroll = (options: { followScroll?: boolean; loadMoreFn?: () => void }) => {
  const { followScroll, loadMoreFn } = options
  const contentEl = document.getElementById('content')
  const setKeys = useSetRecoilState(directorySelectKeysState)
  const headings = useRef<NodeListOf<HTMLElement>>()
  let flag = 0

  const setDirectoryKeys = Throttle((scrollTop: number) => {
    console.log('scrollTop ==> ', scrollTop)
    if (headings.current) {
      let index = 0
      for (let item of headings.current) {
        // 向下滚动
        // if (flag < scrollTop) {
        // 当前滚动位置以下的第一个item
        if (item.offsetTop >= scrollTop + 14 + 24) {
          console.log('↓ item ==> ', item.offsetTop)
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
    flag = scrollTop
  }, 0)

  const handleReachBottom = Throttle(() => {
    loadMoreFn && loadMoreFn()
  }, 2000)

  const eventFn = (e: any) => {
    if (!headings.current) headings.current = contentEl?.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
    followScroll && setDirectoryKeys([e.target.scrollTop])
    console.log('e.target ==> ', e)
    e.target.scrollTop + e.target.clientHeight + 20 > e.target.scrollHeight && loadMoreFn && handleReachBottom()
  }

  useEffect(() => {
    contentEl && contentEl.addEventListener('scroll', eventFn)
    return () => {
      contentEl && contentEl.removeEventListener('scroll', eventFn)
    }
  }, [])
}

export default useListenContentScroll
