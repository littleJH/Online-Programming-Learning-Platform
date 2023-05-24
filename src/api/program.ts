import axios from 'axios'
import { baseURL, baseConfig, jsonConfig } from './baseConfig'

const request = axios.create({
  baseURL: `${baseURL}/program`
})

export const createProgramApi = (data: any, config = jsonConfig) => {
  return request.post('/create', data, config)
}

export const getProgramApi = (id: any, config = baseConfig) => {
  return request.get(`/show/${id}`, config)
}

export const updateProgramApi = (id: any, data: any, config = baseConfig) => {
  return request.put(`/update/${id}`, data, config)
}

export const deleteProgramApi = (id: any, config = baseConfig) => {
  return request.delete(`/delete/${id}`, config)
}
