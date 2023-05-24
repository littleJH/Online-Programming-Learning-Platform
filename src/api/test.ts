import axios from 'axios'
import { baseURL } from './baseConfig'
const request = axios.create({
  baseURL: `/test/test`
})

export const createTestApi = (data: any) => {
  return request.post('/create', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
