import { userInfoState } from '@/store/appStore'
import { deleteProblemApi, getProblemListApi, getUserProblemListApi } from '@/api/problem'
import ProblemTable from '@/components/Problem/table/ProblemTable'
import { IProblem } from '@/type'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import myHooks from '@/tool/myHooks/myHooks'

const ProfileCretion: React.FC = () => {
  const nav = myHooks.useNavTo()
  const info = useRecoilValue(userInfoState)
  const [problemList, setProblemList] = useState<IProblem[]>([])
  const [total, setTotal] = useState(0)
  const [fetchDone, setFetchDone] = useState(false)
  const [first, setFirst] = useState(true)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  useEffect(() => {
    fetchProblems(pageNum, pageSize)
  }, [])

  const fetchProblems = (num: number, size: number) => {
    if (!info) return
    setFetchDone(false)
    getUserProblemListApi(info.id, num, size).then((res) => {
      setTotal(res.data.data.total)
      setProblemList(res.data.data.problems)
    })
  }

  const handlePageChange = (num: number, size: number) => {
    setPageNum(num)
    setPageSize(size)
    fetchProblems(num, size)
  }
  const handleColumnClick = (record: any) => {
    const id = record.key
    nav(`/problemdetail/${id}/description`)
  }
  const handleDelete = (index: number) => {
    deleteProblemApi(problemList[index].id).then((res) => {
      if (res.data.code === 200) {
        setTotal((value) => value - 1)
        setProblemList((value) => [...value.slice(0, index), ...value.slice(index + 1)])
      }
    })
  }

  const handleUpdate = (index: number) => {
    nav(`/creation/problem?id=${problemList[index].id}`)
  }

  return (
    <div>
      <ProblemTable
        mode="action"
        problemList={problemList}
        pageNum={pageNum}
        pageSize={pageSize}
        setPageNum={setPageNum}
        setPageSize={setPageSize}
        total={total}
        fetchDone={fetchDone}
        setFetchDone={setFetchDone}
        setFirst={setFirst}
        onPageChange={handlePageChange}
        onLineClick={handleColumnClick}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      ></ProblemTable>
    </div>
  )
}

export default ProfileCretion
