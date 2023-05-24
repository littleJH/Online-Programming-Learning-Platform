export const baseURL = '/api'

interface IConfig {
  headers: {
    Authorization: string
    'Content-Type'?: string
  }
  'Content-Type'?: string
}

export const baseConfig: IConfig = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

export const jsonConfig: IConfig = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json'
  }
}
