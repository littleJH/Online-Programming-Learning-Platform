import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'

const theme = localStorage.getItem('theme') as string

interface themeState {
  theme: string
}

const initialState: themeState = {
  theme
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toLight: state => {
      state.theme = 'light'
      localStorage.setItem('theme', 'light')
    },
    toDark: state => {
      state.theme = 'dark'
      localStorage.setItem('theme', 'dark')
    }
  }
})

export const { toLight, toDark } = themeSlice.actions
export const selectTheme = (state: RootState) => state.theme.theme
export default themeSlice.reducer
