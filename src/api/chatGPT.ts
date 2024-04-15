import { baseConfig, createRequest, jsonConfig } from '../config/apiConfig'

const request = createRequest({ baseURL: 'chatgpt', type: 'gpt' })

export const getCodeFormNoteApi = (language: string, text: string) => {
  return request.post(`/generate/code/${language}`, JSON.stringify({ Text: text }), jsonConfig())
}

export const getNoteFormCodeApi = (language: string, text: string) => {
  return request.post(`/generate/note/${language}`, JSON.stringify({ Text: text }), jsonConfig())
}

export const changeCodeLanguageApi = (language1: string, language2: string, text: string) => {
  return request.post(`/change/${language1}/${language2}`, JSON.stringify({ Text: text }), jsonConfig())
}

export const getCodeCommentApi = (language: string, data: any) => {
  return request.post(`/opinion/${language}`, JSON.stringify(data), jsonConfig())
}
