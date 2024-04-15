import { cpp } from '@/config/config'
import MySvgIcon from '../Icon/MySvgIcon'

const basicLanguagesMap = new Map([
  ['XML', 'xml'],
  ['PHP', 'php'],
  ['C#', 'csharp'],
  ['C++', 'cpp'],
  ['Razor', 'razor'],
  ['Markdown', 'markdown'],
  ['Diff', 'diff'],
  ['Java', 'java'],
  ['VB', 'vb'],
  ['CoffeeScript', 'coffeescript'],
  ['Handlebars', 'handlebars'],
  ['Batch', 'batch'],
  ['Pug', 'pug'],
  ['F#', 'f#'],
  ['Lua', 'lua'],
  ['Powershell', 'powershell'],
  ['Python', 'python'],
  ['Ruby', 'ruby'],
  ['SASS', 'sass'],
  ['R', 'r'],
  ['Objective-C', 'objective-c'],
])

const intelliSenseLanguagesMap = new Map([
  ['TypeScript', 'typescript'],
  ['JavaScript', 'javascript'],
  ['CSS', 'css'],
  ['LESS', 'less'],
  ['SCSS', 'scss'],
  ['JSON', 'json'],
  ['HTML', 'html'],
])

export const languagesMap = new Map([...basicLanguagesMap, ...intelliSenseLanguagesMap])

const getList = (list: string[]) => {
  const result: any = []
  list.forEach((language) => {
    // if (languagesMap.has(language) || cpp.includes(language))
    result.push({
      label: (
        <div className="flex items-center">
          <span className="flex items-center">
            <MySvgIcon size={2} href={`#icon-${cpp.includes(language) ? 'cpp' : language}`}></MySvgIcon>
          </span>
          <span className="mx-4">{language}</span>
        </div>
      ),
      value: language,
    })
  })
  return result
}

export const languageList = getList([
  'C',
  'CSharp',
  'C++',
  'C++11',
  'C++14',
  'C++17',
  'C++20',
  'Erlang',
  'Go',
  'Java',
  'JavaScript',
  'Kotlin',
  'Pascal',
  'php',
  'Python',
  'Ruby',
  'Rust',
  'Swift',
])

export const poj_languageList = getList(['C++', 'C', 'Java', 'fortran', 'pascal'])

export const ural_languageList = getList([])

const vijos_languageList = languageList

export const ojLanguagesObject: {
  [key: string]: any
} = {
  poj_languageList,
  ural_languageList,
  vijos_languageList,
  defaultLanguageList: languageList,
}
