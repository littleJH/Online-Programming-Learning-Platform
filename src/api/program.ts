import { createRequest, baseConfig, jsonConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'program' })

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
