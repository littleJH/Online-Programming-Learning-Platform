const Throttle = (callback: Function, delay: number = 500) => {
  let flag: boolean = false
  let timeout: ReturnType<typeof setTimeout>
  return (args: any[]) => {
    if (!flag) {
      callback(...args)
      flag = true
      timeout = setTimeout(() => {
        flag = false
        clearTimeout(timeout)
      }, delay)
    } else return
  }
}

export default Throttle
