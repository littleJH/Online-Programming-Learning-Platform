import {CompetitionState, ICompetition} from '@/type'
import {atom} from 'recoil'

export const competitionStateAtom = atom<CompetitionState | null>({
  key: 'competitionStateAtom',
  default: null
})

export const currentCompetitionAtom = atom<ICompetition | null>({
  key: 'currentCompetitionAtom',
  default: null
})
