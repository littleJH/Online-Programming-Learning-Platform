import axios from 'axios'
const request = axios.create({
  baseURL: import.meta.env.DEV ? '/test' : `http://test_oj.mgaronya.com/test`
})

export const createTestApi = (data: any) => {
  return request.post('/create', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
