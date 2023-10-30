import { RcFile } from 'antd/es/upload'

export const formatProblemJson = async (file: RcFile) => {
  const text = await file.text()
  const data = JSON.parse(text)
  switch (data.oj) {
    case 'POJ':
      const index = data.time_limit.search(/[A-z]|[a-z]/)
      data.time_unit = data.time_limit.slice(index).toLowerCase()
      data.time_limit = Number(data.time_limit.slice(0, index))
      const index1 = data.memory_limit.search(/[A-Z]|[a-z]/)
      data.memory_unit = data.memory_limit.slice(index1).toLowerCase()
      data.memory_unit.includes('b')
        ? null
        : (data.memory_unit = `${data.memory_unit}b`)
      data.memory_limit = Number(data.memory_limit.slice(0, index1))
      data.oj = 'POJ'
      data.sample_case = [
        {
          input: data.sample_case.sample_input,
          output: data.sample_case.sample_outpit
        }
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

export const getPathArray = (path: string) => {
  const index = path.indexOf('?')
  const arr = path.slice(0, index > 0 ? index : path.length).split('/')
  arr.shift()
  return arr
}
