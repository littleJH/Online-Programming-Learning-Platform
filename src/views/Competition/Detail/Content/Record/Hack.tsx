import { getUserInfoApi } from '@/api/user'
import { CompetitionType, IRecord, User } from '@/vite-env'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect, useRef, useState } from 'react'
import hljs from '@/highlight'
import { Button, notification } from 'antd'
import Highlight from '@/components/Editor/Highlight'

interface Iprops {
  record: IRecord
  hackInput: string
  sethackInput: Function
  userInfo: User
  submit: Function
}

const Hack: React.FC<Iprops> = props => {
  const { record, hackInput, sethackInput, userInfo, submit } = props

  return (
    <div>
      <div>
        <div className="flex justify-between">
          <div className="hover:text-blue-500 hover:cursor-pointer hover:underline">
            {userInfo?.name}
          </div>
          <div>{record.created_at}</div>
        </div>
        <Highlight code={record.code}></Highlight>
      </div>
      <TextArea
        value={hackInput}
        onChange={e => sethackInput(e.target.value)}
      ></TextArea>
      <div className="flex justify-center mt-8">
        <Button type="primary" onClick={() => submit()}>
          Hack
        </Button>
      </div>
    </div>
  )
}

export default Hack
