import { createRequest, baseConfig, formConfig, wsBaseUrl } from '../config/apiConfig'

const request = createRequest({ baseURL: 'letter' })

export const craeteLetterApi = (id: string, data: any) => {
  return request.post(`/send/${id}`, data, formConfig())
}

export const getLettersApi = (id: string) => {
  return request.get(`/list/${id}`, baseConfig())
}

export const enterPublishLetterWS = (id: string) => {
  return `${wsBaseUrl}/letter/receive/${id}?token=${localStorage.getItem('token')}`
}
