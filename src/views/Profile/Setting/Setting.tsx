import { Button, Divider } from 'antd'
import React, { useCallback, useState } from 'react'
import CodeEditorConfig from '@/components/Editor/CodeEditorConfig'
import { useRecoilState, useRecoilValue } from 'recoil'
import { monacoConfigState, userInfoState } from '@/recoil/store'
import { getCurrentUserinfo, updateInfoApi } from '@/api/user'
import { User } from '@/vite-env'

const Setting: React.FC = () => {
  const monacoConfigRecoil = useRecoilValue(monacoConfigState)
  const [monacoConfig, setMonacoConfig] = useState(monacoConfigRecoil)
  const [info, setInfo] = useRecoilState(userInfoState)

  const handleClick = () => {
    updateConfig()
  }

  const updateConfig = useCallback(
    (language?: string) => {
      const personalizeConfig =
        info.res_long !== '' ? JSON.parse(info.res_long) : {}
      const newInfo: User = {
        ...info,
        res_long: JSON.stringify({
          ...personalizeConfig,
          monacoConfig: {
            language: language ? language : monacoConfig.language,
            theme: monacoConfig.theme,
            options: monacoConfig.options
          }
        })
      }
      updateInfoApi(JSON.stringify(newInfo)).then(async res => {
        console.log(res.data)
        if (res.data.code === 200) {
          const res = await getCurrentUserinfo()
          console.log(res.data)
          setInfo(res.data.data.user)
        }
      })
    },
    [monacoConfig, info]
  )

  return (
    <div>
      <h3 className="label">代码编辑器设置</h3>
      <Divider></Divider>
      <CodeEditorConfig
        monacoConfig={monacoConfig}
        setMonacoConfig={setMonacoConfig}
      ></CodeEditorConfig>
      <div className="text-end">
        <Button type="primary" onClick={handleClick}>
          保存
        </Button>
      </div>
    </div>
  )
}

export default Setting
