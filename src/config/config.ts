import { IMonacoOptions, ITheme } from '@/type'

export const themeDefault: ITheme = {
  colorPrimary: '#40a9ff',
  colorSuccess: '#10b981',
  colorWarning: '#f59e0b',
  colorError: '#ef4444',
  colorInfo: '#3b82f6'
  // colorTextBase: '#000'
}

export const monacoOptionsDefault: IMonacoOptions = {
  fontSize: 14,
  fontWeight: '400',
  lineHeight: 24,
  letterSpacing: 1,
  smoothScrolling: true,
  cursorSmoothCaretAnimation: 'on',
  emptySelectionClipboard: true,
  mouseWheelScrollSensitivity: 1,
  mouseWheelZoom: true,
  padding: {
    bottom: 10,
    top: 10
  }
}

export const cpp = ['C', 'C++', 'C++11', 'C++14', 'C++17', 'C++20']

export const getPagination = (type: 'list' | 'table', pageNum: number, pageSize: number, total: number, handlePageChange: Function) => {
  return {
    position: type === 'list' ? 'bottom' : ['bottomCenter'],
    current: pageNum,
    pageSize: pageSize,
    total: total,
    showQuickJumper: true,
    // hideOnSinglePage: true,
    showSizeChanger: true,
    onChange: (page: number, pageSize: number) => handlePageChange(page, pageSize)
  } as any
}
