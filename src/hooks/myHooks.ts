import { useEffect, useRef, useState } from 'react'

type counterType = NodeJS.Timeout | string | number | undefined

export const useCountdown = (initCount = 10, callback: any) => {
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
      setcount(count => count - 1)
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
    start
  }
}

const useDebounce = (callback: Function, delay = 500, immediate = false) => {
  let timeout: ReturnType<typeof setTimeout>
  let immediateInvoke: boolean = true
  return function (this: any, args: any[]) {
    timeout ? clearTimeout(timeout) : null
    if (immediate) {
      if (immediateInvoke) {
        callback(...args)
        immediateInvoke = false
      } else {
        timeout = setTimeout(() => {
          callback(...args)
          immediateInvoke = true
        }, delay)
      }
    } else {
      timeout = setTimeout(() => {
        callback(...args)
        immediateInvoke = true
      }, delay)
    }
  }
}
