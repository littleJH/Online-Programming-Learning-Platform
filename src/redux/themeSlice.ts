import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
  name: 'theme',
  initialState: 'light',
  reducers: {
    setTheme: state => {
      return state === 'light' ? 'dark' : 'light'
    }
  }
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer
