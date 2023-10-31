import { jsonConfig, createRequest } from '../config/apiConfig'

const request = createRequest({ baseURL: 'test', type: 'test' })

export const createTestApi = (data: any) => {
  return request.post('/create', data, jsonConfig())
}
