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
