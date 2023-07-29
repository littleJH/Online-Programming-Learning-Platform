import axios from 'axios'
import { formConfig, imgBaseUrl } from './baseConfig'
const request = axios.create({
  baseURL: `${imgBaseUrl}/img`
})

export const uploadImgApi = (data: any) => {
  return request.post('/upload', data, formConfig())
}
