export const iconBaseUrl = 'http://icon.mgaronya.com'
export const imgBaseUrl = 'http://api_img.mgaronya.com'
export const baseURL = import.meta.env.DEV
  ? '/api'
  : 'http://api_oj.mgaronya.com'

export const testBaseUrl = import.meta.env.DEV
  ? '/test'
  : 'http://test_oj.mgaronya.com/test'

export const tagBaseUrl = import.meta.env.DEV
  ? '/tag_api'
  : 'http://api_tag.mgaronya.com'

export const wsBaseUrl = 'ws://api_oj.mgaronya.com'

export const translateBaseUrl = import.meta.env.DEV
  ? '/translate_api'
  : 'http://api_translate.mgaronya.com/translator/translate'

export const baseConfig = () => {
  return {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  }
}

export const jsonConfig = () => {
  return {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  }
}

export const formConfig = () => {
  return {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'multipart/form-data'
    }
  }
}
