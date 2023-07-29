import axios from 'axios'
import { jsonConfig, testBaseUrl } from './baseConfig'
const request = axios.create({
  baseURL: `${testBaseUrl}/test`
})

export const createTestApi = (data: any) => {
  return request.post('/create', data, jsonConfig())
}
