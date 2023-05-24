import axios from 'axios'
import { baseURL, baseConfig, jsonConfig } from './baseConfig'

const request = axios.create({
  baseURL: `${baseURL}/problem`
})

export const createProblemApi = (data: any, config = jsonConfig) => {
  return request.post('/create', data, config)
}

export const showProblemApi = (id: string) => {
  return request.get(`/show/${id}`)
}

export const updateProblemApi = (id: string, config = baseConfig) => {
  return request.put(`/update/${id}`, config)
}

export const getProblemListApi = (pageNum = 1, pageSize = 20) => {
  return request.get(`/list?pageNum=${pageNum}&pageSize=${pageSize}`)
}

// searth problem

export const searthProblemByTextApi = (
  text: string,
  pageNum = 1,
  pageSize = 20
) => {
  return request.get(`/search/${text}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const searthProblemByLabelApi = (
  id: string,
  labels: string[],
  pageNum = 1,
  pageSize = 20
) => {
  return request.get(
    `/search/label/${id}/?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

export const searthProblemByTextAndLabelApi = (
  id: string,
  text: string,
  labels: string[],
  pageNum = 1,
  pageSize = 20
) => {
  return request.get(
    `/search/with/label/${id}/${text}/?pageNum=${pageNum}&pageSize=${pageSize}&labels=${labels}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
