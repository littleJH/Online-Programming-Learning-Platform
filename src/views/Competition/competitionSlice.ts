import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

interface CompetitionState {
  competition_id: string
}

const initialState: CompetitionState = {
  competition_id: ''
}

const competitionSlice = createSlice({
  name: 'competition',
  initialState,
  reducers: {
    changeId: (state, action: PayloadAction<string>) => {
      state.competition_id = action.payload
    }
  }
})

export const { changeId } = competitionSlice.actions
export const selectCompetition_id = (state: RootState) =>
  state.competition.competition_id
export default competitionSlice.reducer
