import { configureStore } from '@reduxjs/toolkit'
import themelReducer from './slice/themeSlice'
import competitionReducer from '../components/Competition/competitionSlice'
const stroe = configureStore({
  reducer: {
    theme: themelReducer,
    competition: competitionReducer
  }
})

export type RootState = ReturnType<typeof stroe.getState>
export type AppDispatch = typeof stroe.dispatch

export default stroe
