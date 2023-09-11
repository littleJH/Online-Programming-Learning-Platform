const Debounce = (callback: Function, delay = 500, immediate = false) => {
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

export default Debounce
