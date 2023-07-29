import axios from 'axios'
import { baseURL, baseConfig, jsonConfig } from './baseConfig'

const request = axios.create({
  baseURL: `${baseURL}/program`
})

export const createProgramApi = (data: any) => {
  return request.post('/create', data, jsonConfig())
}

export const getProgramApi = (id: any) => {
  return request.get(`/show/${id}`, jsonConfig())
}

export const updateProgramApi = (id: any, data: any) => {
  return request.put(`/update/${id}`, data, jsonConfig())
}

export const deleteProgramApi = (id: any) => {
  return request.delete(`/delete/${id}`, jsonConfig())
}
