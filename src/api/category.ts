import axios from 'axios'
import { baseConfig, baseURL, jsonConfig } from './baseConfig'
const request = axios.create({
  baseURL: `${baseURL}/category`
})

export const createCategoryApi = (data: any) => {
  return request.post('/create', data, jsonConfig())
}

export const getCategoryApi = (id: string) => {
  return request.get(`/show/${id}`)
}

export const updateCategoryApi = (id: string, data: any) => {
  return request.put(`/update/${id}`, data, jsonConfig())
}

export const deleteCategoryApi = (id: string) => {
  return request.delete(`/delete/${id}`, baseConfig())
}

export const getCategoryListApi = (
  pageNum: number = 1,
  pageSize: number = 20
) => {
  return request.get(`/list?pageNum=${pageNum}&pageSize=${pageSize}`)
}
