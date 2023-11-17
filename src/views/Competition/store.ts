import { CompetitionState } from '@/type'
import { atom } from 'recoil'

export const competitionStateAtom = atom<CompetitionState | null>({
  key: 'competitionStateAtom',
  default: null
})
