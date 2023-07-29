import axios from 'axios'
import { baseConfig, baseURL, jsonConfig } from './baseConfig'
import { CompetitionType } from '@/vite-env'
const request = axios.create({
  baseURL: `${baseURL}/competition/standard/`
})

export const enterStandardSingleApi = (
  type: CompetitionType,
  id: string,
  userNum = 50
) => {
  return request.post(`${type}/enter/${id}?userNum=${userNum}`, baseConfig())
}

export const getEnterConditionApi = (type: CompetitionType, id: string) => {
  return request.get(`${type}/enter/condition/${id}`, baseConfig())
}

export const cancelEnterStandardSingleApi = (
  type: CompetitionType,
  id: string
) => {
  return request.delete(`${type}/cancel/enter/${id}`, baseConfig())
}

export const getStandardUserListApi = (
  type: CompetitionType,
  id: string,
  pageNum = 1,
  pageSize = 20
) => {
  return request.get(
    `${type}/enter/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`,
    baseConfig()
  )
}
