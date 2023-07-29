/// <reference types="vite/client" />

import { Descendant, string } from 'slate'
import { ResultStatusType } from 'antd/es/result'

export interface IPrblemTableDataType {
  key: string
  index: number
  title: string
  description: string
  totaRecords: number
  accpet: string
  acPerc: JSX.Element
  labels: {
    id: string
    created_at: string
    updated_at: string
    label: string
    problem_id: string
  }[]
}

export interface IProblem {
  title: string
  description: string
  res_long?: string
  res_short?: string
  time_limit: string
  time_unit: string
  memory_limit: string
  memory_unit: string
  input: string
  output: string
  sample_case: {
    input: string
    output: string
  }
  test_case: {
    input: string
    output: string
  }
  hint: string
  source: string
  special_judge: string
  standard: string
  input_check: string
  input_check_id: string
  id: string
  user_id?: string
  created_at?: string
  updated_at?: string
  competition_id?: string
  visibleNum?: number
  liked?: 1 | 0 | -1 = 0
  likeNum?: number
  dislikeNum?: number
  collected?: boolean
  collectNum?: number
  labels?: IArticleLabel[]
}

export interface ICaseSample {
  key: string
  cid: number
  input: string
  output: string
  problem_id: string
}

export interface ICaseTest {
  cid: number
  input: string
  output: string
  memory: number
  record_id: string
  time: number
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
  state: ResultStatusType
}

export interface ICompetition {
  [key: string]: string | number
  content: string
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
  collect_num?: number
  email: string
  icon: string
  id?: string
  level?: string
  like_num?: number
  name: string
  score?: string
  sex: boolean
  unlike_num?: number
  visit_num?: number
  res_short: string
  res_long: string
}

export interface IPersonalizeConfig {
  monacoConfig: IMonacoConfig
  theme: 'light' | 'dark' = 'light'
}

export interface IMonacoConfig {
  language: string
  theme: 'vs-dark' | 'light'
  options: {
    fontSize?: number = 14
    fontWeight?: string = '400'
    lineHeight?: number = 24
    letterSpacing?: number = 1
    smoothScrolling?: boolean = true
    cursorSmoothCaretAnimation?: 'on' | 'off' | 'explicit' = 'on'
    emptySelectionClipboard?: boolean = true
    mouseWheelScrollSensitivity?: number = 1
    mouseWheelZoom?: boolean = true
    padding: {
      bottom?: number = 10
      top?: number = 10
    }
    scrollBeyondLastLine?: boolean = false
    showUnused?: boolean = true
  }
}

export interface IEditorConfig {
  theme: 'vs-dark' | 'light'
  language: string
}

export type HackState = 'hacked' | 'notHack' | 'unableHack'

export interface IRecordTableDataSource {
  key: string
  condition: JSX.Element
  create_at: string
  language: string | React.ReactNode
  pass: number
  problem?: IProblem
  user?: User
  hack: HackState
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

type CompetitionState = 'notEnter' | 'underway' | 'enter' | 'finished'

export interface IArticle {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  res_short: string
  res_long: string
  category_id: string
  user: User
  visibleNum: number
  liked: 1 | 0 | -1 = 0
  likeNum: number
  collected: boolean
  collectNum: number
  labels: IArticleLabel[]
  remark: {
    remarks: IRemark[]
    total: number
  }
  hot?: string | number
}

export interface IArticleLabel {
  article_id: string
  created_at: string
  id: string
  label: string
  updated_at: string
}

export interface IRemark {
  id: string
  user_id: string
  user: User
  article_id: string
  content: string
  created_at: string
  updated_at: string
  res_short: string
  res_long: string
  liked: 1 | 0 | -1 = 0
  likeNum: number
  dislikeNum: number
  collected: boolean
  collectNum: number
}

export interface ICategory {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
  res_short: string
  res_long: string
}

export interface ITopic {
  id: string
  user_id: string
  user?: User
  title: string
  content: string
  created_at: string
  updated_at: string
  res_short: string
  res_long: string
  problems?: IProblem[]
}

export interface IFormCreate {
  title: string
  content: string
  res_long?: string
  res_short?: string
  topics: string[]
  groups?: string[]
  auto_update: boolean
  auto_pass: boolean
  pass_num: number
  pass_re: boolean
}

export interface IForm extends IFormCreate {
  id: string
  user_id: string
}
