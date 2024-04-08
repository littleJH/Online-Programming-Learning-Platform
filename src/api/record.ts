import { createRequest, baseConfig, jsonConfig, wsBaseUrl } from '../config/apiConfig'

const request = createRequest({ baseURL: 'record' })

export const createRecordApi = (data: any) => {
  return request.post('/create', data, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json',
    },
  })
}

export const getRecordApi = (id: string, config = baseConfig()) => {
  return request.get(`/show/${id}`, config)
}

export const getRecordListApi = (paramsObj: {
  [key: string]: string | number | undefined
  problem_id?: string
  condition?: string
  pageNum?: number
  pageSize?: number
  language?: string
  user_id?: string
  start_time?: string
  end_time?: string
  pass_low?: string
  pass_top?: string
  hack?: string
}) => {
  let params = ''
  let length = 0
  Object.keys(paramsObj).forEach((key, index) => {
    length++
  })
  Object.keys(paramsObj).forEach((key, index) => {
    params += `${key}=${paramsObj[key]}`
    index === length - 1 ? (params += '') : (params += '&')
  })
  return request.get(`/list?${params}`)
}

export const getRecordCaseListApi = (id: string) => {
  return request.get(`/list/case/${id}`, baseConfig())
}

export const hackRecordApi = (id: string, data: any) => {
  return request.post(`/hack/${id}`, data, jsonConfig())
}

export const enterPublishRecordWs = (id: string) => {
  return `${wsBaseUrl}/record/publish/${id}`
}
