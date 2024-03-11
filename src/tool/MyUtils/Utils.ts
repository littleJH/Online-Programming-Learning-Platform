import { IToc, TypeSideBar } from '@/type'
import { RcFile } from 'antd/es/upload'
import dayjs from 'dayjs'
import copy from 'copy-to-clipboard'

const formatProblemJson = async (file: RcFile) => {
  const text = await file.text()
  const data = JSON.parse(text)
  switch (data.oj) {
    case 'POJ':
      const index = data.time_limit.search(/[A-z]|[a-z]/)
      data.time_unit = data.time_limit.slice(index).toLowerCase()
      data.time_limit = Number(data.time_limit.slice(0, index))
      const index1 = data.memory_limit.search(/[A-Z]|[a-z]/)
      data.memory_unit = data.memory_limit.slice(index1).toLowerCase()
      data.memory_unit.includes('b') ? null : (data.memory_unit = `${data.memory_unit}b`)
      data.memory_limit = Number(data.memory_limit.slice(0, index1))
      data.oj = 'POJ'
      data.sample_case = [
        {
          input: data.sample_case.sample_input,
          output: data.sample_case.sample_outpit,
        },
      ]
      break
    case 'ATCODER':
      break
    default:
      data.problem_id = String(data.id)
      delete data.id
      break
  }
  return data
}

const getPathArray = (path: string) => {
  const index = path.indexOf('?')
  const arr = path.slice(0, index > 0 ? index : path.length).split('/')
  arr.shift()
  return arr
}

const generateTOC = (container: HTMLElement) => {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const toc: IToc[] = []

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1)) // 获取标题级别，如从'h1'中提取出1
    const title = heading.textContent
    const node: IToc = { key: heading.id, title: title || '', children: [] }

    // 在目录树中找到正确的位置插入节点
    let currentNode = toc
    for (let i = 1; i < level; i++) {
      const lastChild = currentNode[currentNode.length - 1]
      if (lastChild) {
        currentNode = lastChild.children
      }
    }

    currentNode.push(node)
  })

  return toc
}

const getDuration = (start: string, end: string): string => {
  const mill = dayjs(end).unix() - dayjs(start).unix()
  const duration = {
    hour: 0,
    min: 0,
  }
  duration.hour = Math.floor(mill / 3600)
  duration.min = (mill - duration.hour * 3600) / 60

  return `${duration.hour} 小时 ${duration.min} 分钟`
}

const getSideBarType = (path: string): TypeSideBar => {
  console.log('path ==> ', path)
  const pathArr = utils.getPathArray(path)
  const siderNavPath = [
    '/home',
    '/problemset/all',
    '/competition/common/set',
    '/competition/random',
    '/competition/standard',
    '/community/articleset',
    '/creation',
    '/learn',
  ]
  const directoryPath = ['/community/article/']
  if (siderNavPath.includes(path) || path.includes('/profile')) {
    return 'nav'
  } else if (directoryPath.find((item) => path.includes(item))) {
    return 'directory'
  } else if (pathArr[0] === 'competition' && pathArr[3] === 'problem') {
    return 'competitionRank'
  } else {
    return 'none'
  }
}

const getTimeAgo = (time: string) => {
  let ago: {
    num: number
    unit: '秒' | '分钟' | '小时' | '天' | '月' | '年'
  }
  const previous = dayjs(time)
  const current = dayjs()
  const gap = current.unix() - previous.unix()
  if (gap <= 60) {
    ago = {
      num: gap + 1,
      unit: '秒',
    }
  } else if (gap > 60 && gap <= 60 * 60) {
    ago = {
      num: current.diff(previous, 'minute'),
      unit: '分钟',
    }
  } else if (gap > 60 * 60 && gap <= 60 * 60 * 24) {
    ago = {
      num: current.diff(previous, 'hour'),
      unit: '小时',
    }
  } else if (gap > 60 * 60 * 24 && gap <= 60 * 60 * 24 * 30) {
    ago = {
      num: current.diff(previous, 'day'),
      unit: '天',
    }
  } else if (gap > 60 * 60 * 24 * 30 && gap <= 60 * 60 * 24 * 365) {
    ago = {
      num: current.diff(previous, 'month'),
      unit: '月',
    }
  } else {
    ago = {
      num: current.diff(previous, 'year'),
      unit: '年',
    }
  }
  return ago
}

const debounce = (callback: Function, delay = 500, immediate = false) => {
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

const throttle = (callback: Function, delay: number = 500) => {
  let flag: boolean = false
  let timeout: ReturnType<typeof setTimeout>
  return (args?: any[]) => {
    if (!flag) {
      args ? callback(...args) : callback()
      flag = true
      timeout = setTimeout(() => {
        flag = false
        clearTimeout(timeout)
      }, delay)
    } else return
  }
}

const utils = {
  formatProblemJson,
  getPathArray,
  generateTOC,
  getSideBarType,
  getDuration,
  copyToClipboard: copy,
  getTimeAgo,
  debounce,
  throttle,
}

export default utils
