import { formConfig, createRequest } from '../config/apiConfig'

const request = createRequest({ baseURL: 'img', type: 'img' })

export const uploadImgApi = (data: any) => {
  return request.post('/upload', data, formConfig())
}
