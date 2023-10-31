import { createRequest, baseConfig, formConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'letter' })

export const craeteLetterApi = (id: string, data: any) => {
  return request.post(`/send/${id}`, data, formConfig())
}

export const getGroupLettersApi = (id: string) => {
  return request.get(`/list/${id}`, baseConfig())
}
