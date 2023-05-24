import axios from 'axios'
import { baseURL, baseConfig, jsonConfig } from './baseConfig'
const request = axios.create({
  baseURL: `${baseURL}/problem/new`
})

export const createProblemNewApi = (data: any) => {
  return request.post('/create', data, jsonConfig)
}

export const getProblemNewApi = (id: string) => {
  return request.get(`/show/${id}`, baseConfig)
}

export const updateProblemNewApi = (id: string, data: any) => {
  return request.put(`/update/${id}`, data, jsonConfig)
}

export const deleteProblemNewApi = (id: string) => {
  return request.delete(`/delete/${id}`, baseConfig)
}

export const getProblemNewListApi = (
  id: string,
  pageNum = 1,
  pageSize = 20
) => {
  return request.get(`/list/${id}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const quoteProblemApi = (
  competition_id: string,
  problem_id: string,
  score: string
) => {
  return request.post(
    `/quote/${competition_id}/${problem_id}/${score}`,
    {},
    baseConfig
  )
}
