import { userInfoState } from '@/store/appStore'
import { getArticleListApi } from '@/api/article'
import { getProblemListApi, getUserProblemListApi } from '@/api/problem'
import { Descriptions } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import style from '../../style.module.scss'

const CreationRoot: React.FC = () => {
  const info = useRecoilValue(userInfoState)
  const [problemTotal, setProblemTotal] = useState()
  const [articleTotal, setArticleTotal] = useState()

  useEffect(() => {
    if (!info) return
    getArticleListApi(1, 0).then((res) => {
      setArticleTotal(res.data.data.total)
    })
    getUserProblemListApi(info.id, 1, 0).then((res) => {
      setProblemTotal(res.data.data.total)
    })
  }, [])
  return (
    <div className={style.creationRoot}>
      {/* <div>
        <Descriptions layout="vertical">
          <Descriptions.Item label="题目">{problemTotal}</Descriptions.Item>
          <Descriptions.Item label="文章">{articleTotal}</Descriptions.Item>
        </Descriptions>
      </div> */}
      <Outlet></Outlet>
    </div>
  )
}

export default CreationRoot
