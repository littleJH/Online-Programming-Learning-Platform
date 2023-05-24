import { IRecordState } from '@/vite-env'
export const recordStates: IRecordState[] = [
  {
    value: 'Code is empty',
    label: '代码为空',
    state: 'error'
  },
  {
    value: 'Waiting',
    label: '等待',
    state: 'waiting'
  },
  {
    value: "Input Doesn't Exist",
    label: '输入在数据库中不存在',
    state: 'error'
  },
  {
    value: "Output Doesn't Exist",
    label: '输出在数据库中不存在',
    state: 'error'
  },
  {
    value: 'System Error 1',
    label: '服务器问题：创建文件失败',
    state: 'error'
  },
  {
    value: 'System Error 2',
    label: '服务器问题：编译指令执行失败',
    state: 'error'
  },
  {
    value: 'Compile Time Out',
    label: '编译超时',
    state: 'error'
  },
  {
    value: 'Compile Error',
    label: '编译错误',
    state: 'error'
  },
  {
    value: 'System Error 3',
    label: '服务器问题：消息管道创建失败',
    state: 'error'
  },
  {
    value: 'System Error 4',
    label: '服务器问题：运行指令执行失败',
    state: 'error'
  },
  {
    value: 'Time Limit Exceeded',
    label: '超出时间限制',
    state: 'error'
  },
  {
    value: 'Runtime Error',
    label: '运行时错误',
    state: 'error'
  },
  {
    value: 'Memory Limit Exceeded',
    label: '超出空间限制',
    state: 'error'
  },
  {
    value: 'Wrong Answer',
    label: '错误答案',
    state: 'error'
  },
  {
    value: 'System error 5',
    label: '服务器问题：数据库插入数据失败',
    state: 'error'
  },
  {
    value: 'Accepted',
    label: '提交通过',
    state: 'success'
  },
  {
    value: 'ok',
    label: '测试通过',
    state: 'success'
  },
  {
    value: 'Language Error',
    label: '语言错误',
    state: 'error'
  }
]
