import axios from 'axios'
import { baseConfig, createRequest, jsonConfig } from '../config/apiConfig'
import { CompetitionType } from '@/type'

const request = createRequest({ baseURL: 'competition/' })

export const createRecordApi = (
  type: CompetitionType,
  id: string,
  data: any,
) => {
  return request.post(`${type}/submit/${id}`, data, jsonConfig())
}

export const getRecordApi = (
  type: CompetitionType,
  id: string,
  config = baseConfig(),
) => {
  return request.get(`${type}/show/${id}`, config)
}

export const getRecordListApi = (
  type: CompetitionType,
  id: string,
  paramsObj: {
    [key: string]: string | number | undefined
    problm_id?: string
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
  },
) => {
  let params = ''
  let length = 0
  Object.keys(paramsObj).forEach((key, index) => {
    length++
  })
  length === 0 ? (params = '') : (params = '?')
  Object.keys(paramsObj).forEach((key, index) => {
    params += `${key}=${paramsObj[key]}`
    index === length - 1 ? (params += '') : (params += '&')
  })
  return request.get(`${type}/search/list/${id}${params}`, baseConfig())
}

export const enterCompetitionApi = (
  type: CompetitionType,
  competition_id: string,
  data: any,
  group_id?: string,
) => {
  return request.post(
    `${type}/enter/${competition_id}${group_id ? `/${group_id}` : ''}`,
    data,
    baseConfig(),
  )
}

export const getEnterConditionApi = (type: CompetitionType, id: string) => {
  return request.get(`${type}/enter/condition/${id}`, baseConfig())
}

export const cancelEnterApi = (
  type: CompetitionType,
  competition_id: string,
  group_id?: string,
) => {
  return request.delete(
    `${type}/cancel/enter/${competition_id}${group_id ? `/${group_id}` : ''}`,
    baseConfig(),
  )
}

export const getEnterListApi = (type: CompetitionType, id: string) => {
  return request.get(`${type}/enter/list/${id}`)
}

export const hackRecordApi = (type: CompetitionType, id: string, data: any) => {
  return request.post(`${type}/hack/${id}`, data, jsonConfig())
}
