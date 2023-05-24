/// <reference types="vite/client" />

import { Descendant } from 'slate'
import { ResultStatusType } from 'antd/es/result'

export interface AcDataType {
  key: string
  index: number
  title: JSX.Element
  totaRecords: number
  accpet: string
  acPerc: JSX.Element
}

export interface IProblem {
  title: string
  description: Descendant[] | string
  res_long?: string
  res_short?: string
  time_limit: string
  time_unit: string
  memory_limit: string
  memory_unit: string
  input: Descendant[] | string
  output: Descendant[] | string
  sample_case: {
    input: string
    output: string
  }
  test_case: {
    input: string
    output: string
  }
  hint: Descendant[] | string
  source: Descendant[] | string
  special_judge?: string
  standard?: string
  input_check?: string
  id?: string
  user_id?: string
  created_at?: string
  updated_at?: string
  competition_id?: string
}

export interface ICaseSample {
  key: string
  cid: number
  input: string
  output: string
  problem_id: string
}

export interface IRunResult {
  condition: string
  memory: number
  output: string
  time: number
}

export type ProgramMode =
  | 'standard'
  | 'special_judge'
  | 'standardHack'
  | 'specialHack'

export interface IRecordState {
  value: string
  label: string
  state: ResultStatusType | 'waiting'
}

export interface ICompetition {
  [key: string]: Descendant[] | string | number
  content: Descendant[] | string
  created_at: string
  end_time: string
  group_id: string
  hack_num: number
  hack_score: number
  hack_time: string
  id: string
  less_num: number
  passwd_id: string
  res_long: string
  res_short: string
  start_time: string
  title: string
  type: CompetitionType
  up_num: number
  updated_at: string
  user_id: string
}

export type ProgramMode =
  | 'standard'
  | 'special_judge'
  | 'standardHack'
  | 'specialHack'

export interface IRecord {
  [key: strinig]: string | number
  code: string
  condition: string
  created_at: string
  hack_id: string
  id: string
  language: string
  pass: number
  problem_id: string
  updated_at: string
  user_id: string
}

export interface User {
  address: string
  blog: string
  collect_num: number
  email: string
  icon: string
  id: string
  level: string
  like_num: number
  name: string
  score: string
  sex: boolean
  unlike_num: number
  visit_num: number
}

export interface IEditorConfig {
  theme: 'vs-dark' | 'light'
  language: string
}

export interface IRecordTableDataSource {
  key: string
  index: number
  condition: JSX.Element
  create_at: string
  language: string
  pass: number
  problem: IProblem
  user: User
  hack: boolean
}

export type CompetitionType =
  | 'Single'
  | 'Group'
  | 'Match'
  | 'OI'
  | ''
  | 'single'
  | 'group'
  | 'match'
  | 'Normal'
  | 'normal'

export interface IRank {
  create_at: string
  updated_at: string
  member_id: string
  competition_id: string
  penalties: string
  score: number
}

export type HackState = 'hacked' | 'notHack' | 'unableHack'

export interface IHack {
  record_id: string
  user_id: string
  input: string
  type: CompetitionType
  created_at: string
}

export interface IGroup {
  auto: boolean
  competition_at: string //参加比赛的结束时间
  content: string
  created_at: string
  id: string
  leader_id: string
  res_long: string
  res_short: string
  title: string
  updated_at: string
  members?: User[]
}
