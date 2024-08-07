/// <reference types="vite/client" />

import { ResultStatusType } from 'antd/es/result'

export type TypeSideBar = 'nav' | 'directory' | 'competitionRank' | 'fileInfo' | 'none'

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
  key?:string
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

export type ProgramMode = 'standard' | 'special_judge' | 'standardHack' | 'specialHack'

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
  labels?: {
    id: string
    label: string
    competition_id: string
  } []
}

export type ProgramMode = 'standard' | 'special_judge' | 'standardHack' | 'specialHack'

export interface IRecord {
  [key: string]: string | number
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
  id: string
  level?: number
  like_num?: number
  name: string
  score?: number
  sex: boolean
  unlike_num?: number
  visit_num?: number
  res_short: string
  res_long: string
  theme: string
  monaco_options: string
  language: string
  monaco_theme: string
}

export interface IPersonalizeConfig {
  monacoConfig: IMonacoConfig
  theme: ITheme
}

export interface ITheme {
  [key: string]: string
}

export interface IMonacoOptions {
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

export type CompetitionType = 'Single' | 'Group' | 'Match' | 'OI' | '' | 'single' | 'group' | 'match' | 'Normal' | 'normal' | 'oi'

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
  entered?: boolean
}

type CompetitionState = 'notStart' | 'underway' | 'finished'

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

export interface IComment {
  id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  res_short: string
  res_long: string
  user: User
  visibleNum: number
  liked: 1 | 0 | -1 = 0
  likeNum: number
  collected: boolean
  collectNum: number
  reply: {
    replys: IReply[]
    total: number
  }
  hot?: string | number
}

export interface IPost {
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

export interface IReply extends IRemark {}

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

export interface IChat {
  chat: {
    created_at: string
    group_id: string
    author_id: string
    content: string
    res_long: string
    res_short: string
  }
  user: User
}

export interface INavOptions {
  path: string
  key?: string
}

export interface IToc {
  key: string
  title: string
  children: IToc[]
}

export interface ICountDown {
  day: string
  hour: string
  min: string
  second: string
}

export interface IFile {
  name: string
  path: string
  type: string
  lastWriteTime: string
  size?: string | number
  openMenu?: boolean
}

export interface INotice {
  title: string
  content: string
  res_long: string
  res_short: string
  created_at: string
  updated_at: string
  id: string
  user_id: string
  user?: User
}

