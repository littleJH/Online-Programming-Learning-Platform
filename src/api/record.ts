import axios from 'axios'
import { baseURL, baseConfig, jsonConfig } from './baseConfig'

const request = axios.create({
  baseURL: `${baseURL}/record`
})

export const createRecordApi = (data: any) => {
  return request.post('/create', data, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  })
}

export const getRecordApi = (id: string, config = baseConfig) => {
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

export const getRecordCaseApi = (id: string) => {
  return request.get(`/list/case/${id}`)
}

export const getTestCaseApi = (id: string) => {
  return request.get(`/case/${id}`)
}

export const hackRecordApi = (id: string, data: any) => {
  return request.post(`/hack/${id}`, data, jsonConfig)
}
