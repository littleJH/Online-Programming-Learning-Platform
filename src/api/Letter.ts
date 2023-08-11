import axios from 'axios'
import { baseURL, baseConfig, formConfig } from './baseConfig'
const request = axios.create({
  baseURL: `${baseURL}/letter`
})

export const craeteLetterApi = (id: string, data: any) => {
  return request.post(`/send/${id}`, data, formConfig())
}

export const getGroupLettersApi = (id: string) => {
  return request.get(`/list/${id}`, baseConfig())
}
