import { baseConfig, jsonConfig, formConfig, createRequest } from '../config/apiConfig'

const request = createRequest({ baseURL: 'user' })

export const searchUserByTextApi = (text: string, pageNum = 1, pageSize = 20) => {
  return request.get(`/search/${text}?pageNum=${pageNum}&pageSize=${pageSize}`)
}

export const getVerifyApi = (id: string) => {
  return request.get(`/verify/${id}`)
}

export const registerApi = (data: any) => {
  return request.post('regist', data)
}

export const loginApi = (data: any) => {
  return request.post('/login', data)
}

export const securityApi = (data: any) => {
  return request.put('/security', data, {})
}

export const updateInfoApi = (data: any) => {
  return request.put('/update', data, jsonConfig())
}

export const getCurrentUserinfo = () => {
  return request.get('/info', baseConfig())
}

export const getUserInfoApi = (id: string) => {
  return request.get(`/show/${id}`)
}

export const updatePasswordApi = (data: any) => {
  return request.put('/update/password', data, formConfig())
}

export const findPasswordApi = (data: any) => {
  return request.put('/security', data, formConfig())
}
