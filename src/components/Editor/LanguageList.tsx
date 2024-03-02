import { cpp } from '@/config/config'
import MySvgIcon from '../Icon/MySvgIcon'

const getLabel = (language: string) => {
  if (cpp.includes(language)) language = 'cpp'
  return (
    <div className="flex items-center">
      <MySvgIcon size={2} href={`#icon-${language}`}></MySvgIcon>
      <span className="mx-4">{language}</span>
    </div>
  )
}

const getList = (list: string[]) => {
  return list.map((item) => {
    return {
      label: getLabel(item),
      value: item,
    }
  })
}

export const languageList = getList(['C++11', 'Java', 'JavaScript', 'php', 'Python', 'Rust', 'Swift'])

export const poj_languageList = getList(['C++', 'C', 'Java', 'fortran', 'pascal'])
