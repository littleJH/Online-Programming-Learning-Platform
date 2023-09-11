import axios from 'axios'
import { baseURL, jsonConfig } from './baseConfig'
const request = axios.create({
  baseURL: `${baseURL}/set`
})

export const createFormApi = (data: any) => {
  return request.post('/create', data, jsonConfig())
}

export const getFormApi = (id: string) => {
  return request.get(`/show/${id}`)
}

export const getFormListApi = (pageNum: number = 1, pageSize: number = 20) => {
  return request.get(`/list?pageNum=${pageNum}&pageSize=${pageSize}`)
}
