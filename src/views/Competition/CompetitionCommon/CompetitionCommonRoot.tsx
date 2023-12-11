import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { showCompetitionApi } from '@/api/competition'
import {
  cancelEnterApi,
  enterCompetitionApi,
  getEnterListApi,
} from '@/api/competitionMixture'
import { getEnterConditionApi } from '@/api/competitionMixture'
import dayjs from 'dayjs'
import { CompetitionType, IGroup } from '@/type'
import { Button, List, Menu, Modal, theme, Tooltip, Card, Space } from 'antd'
import Update from './component/Update/Update'
import { getUserInfoApi } from '@/api/user'
import UserCard from '@/components/User/UserCard'
import { User } from '@/type'
import CompetitionTypeLabel from './component/Label/CompetitionTypeLabel'
import EnterGroup from './component/Group/EnterGroup'
import GroupInfo from './component/Group/GroupInfo'
import { getMemberGroupListApi } from '@/api/group'
import useNavTo from '@/tool/myHooks/useNavTo'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  competitionStateAtom,
  currentCompetitionAtom,
  isEnterState,
} from '../competitionStore'
import CountDown from '@/components/countDown/CountDown'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import Loading from '@/components/Loading/Loading'
import { notificationApi, pathNameState } from '@/store/appStore'
import { getPathArray } from '@/tool/MyUtils/Utils'

type State = 'notStart' | 'underway' | 'finished'
const getState = (start: string, end: string): State => {
  if (dayjs(start).valueOf() > dayjs().valueOf()) {
    return 'notStart'
  } else if (
    dayjs(start).valueOf() < dayjs().valueOf() &&
    dayjs(end).valueOf() > dayjs().valueOf()
  ) {
    return 'underway'
  } else return 'finished'
}

const Detail: React.FC = () => {
  const nav = useNavTo()
  const pathname = useRecoilValue(pathNameState)
  const { competition_id } = useParams()
  const [type, settype] = useState<CompetitionType>('')
  const [competitionState, setcompetitionState] =
    useRecoilState(competitionStateAtom)
  const [competition, setCompetition] = useRecoilState(currentCompetitionAtom)
  const [isEnter, setIsEnter] = useRecoilState(isEnterState)
  const [enterNum, setenterNum] = useState()
  const [endTime, setEndTime] = useState<string>()
  const [openEnterModal, setopenEnterModal] = useState(false)
  const [openUpdateModal, setopenUpdateModal] = useState(false)
  const [openEnterListModal, setopenEnterListModal] = useState(false)
  const [enterList, setenterList] = useState<User[]>([])
  const [groupInfo, setgroupInfo] = useState<IGroup>()
  const { token } = theme.useToken()
  const notification = useRecoilValue(notificationApi)
  const selectedKey = useMemo(() => getPathArray(pathname)[2], [pathname])

  useEffect(() => {
    competition_id && fetch()
  }, [competition_id])

  const fetch = async () => {
    if (!competition_id) return
    const res = await showCompetitionApi(competition_id)
    const competition = res.data.data.competition
    competition.type =
      competition.type !== 'OI'
        ? competition.type.toLowerCase()
        : competition.type
    const type = competition.type

    const res1 = await getEnterConditionApi(type, competition.id)
    const state = getState(competition.start_time, competition.end_time)
    if (type !== 'match') {
      state === 'notStart' && setEndTime(competition.start_time)
      state === 'underway' && setEndTime(competition.end_time)
    }
    type === 'group' && setIsEnter(res.data.data.group ? true : false)
    type !== 'group' && setIsEnter(res1.data.data?.enter)
    setCompetition(competition)
    settype(type)
    setcompetitionState(state)

    if (type === 'group') {
      const group = res1.data.data.group
      const res2 = await getMemberGroupListApi(group.id)
      const members = res2.data.data.userList
      const users: User[] = []
      for (let item of members) {
        const res3 = await getUserInfoApi(item.user_id)
        users.push(res3.data.data.user)
      }
      setgroupInfo({
        ...group,
        ...{
          members: users,
        },
      })
    } else if (type === 'match') {
    } else {
      const res2 = await getEnterListApi(type, competition.id)
      setenterNum(res2.data.data.total)
    }
  }

  const enterCompetition = async () => {
    if (!competition) return
    const data = {
      password: '666666',
    }
    if (!isEnter) {
      const res = await enterCompetitionApi(
        type,
        competition?.id,
        JSON.stringify(data),
      )
      if (res.data.code === 200) {
        setopenEnterModal(false)
        setIsEnter(true)
        notification &&
          notification.success({
            message: '报名成功',
          })
      } else {
        notification &&
          notification.warning({
            message: res.data.msg,
          })
      }
    } else if (isEnter) {
      let res
      if (groupInfo) {
        res = await cancelEnterApi(
          type,
          competition?.id,
          groupInfo.id ? groupInfo.id : '',
        )
      } else {
        res = await cancelEnterApi(type, competition?.id)
      }
      if (res.data.code === 200) {
        setopenEnterModal(false)
        setIsEnter(false)
        notification &&
          notification.success({
            message: '取消报名成功',
          })
      } else if (res) {
        notification &&
          notification.warning({
            message: res.data.msg,
          })
      }
    }
  }

  const getEnterList = () => {
    setenterList([])
    setopenEnterListModal(true)
    getEnterListApi(type, competition?.id as string).then(res => {
      console.log('enterlist', res.data.data)
      res.data.data.competitionRanks.forEach((item: any) => {
        getUserInfoApi(item.member_id).then(result => {
          setenterList(value => [...value, result.data.data.user])
        })
      })
    })
  }

  const navTo = (e: any) => {
    const key = e.key
    //任何状态均可浏览overview
    if (key === 'overview') {
      nav(`/competition/${competition_id}/${key}`)
    } else {
      //比赛未开始
      if (competitionState === 'notStart') {
        notification &&
          notification.warning({
            message: '比赛未开始',
          })
      }
      // 比赛已开始或已结束
      else {
        // 已报名
        isEnter && nav(`/competition/${competition_id}/${key}`)
        // 未报名
        !isEnter &&
          notification &&
          notification.warning({
            message: '比赛已开始，您未报名此比赛',
          })
      }
    }
  }

  return (
    <div className="max-w-screen-xl">
      {/* header */}
      <Card>
        {competition && (
          <div className="flex">
            <div className="flex flex-col items-center justify-center">
              <span
                className="cursor-pointer"
                onClick={() =>
                  competitionState === 'notStart' && setopenEnterModal(true)
                }>
                {competitionState === 'notStart' && (
                  <>
                    {!isEnter && (
                      <MySvgIcon
                        href="#icon-weibaoming"
                        color={token.colorWarning}
                        size={4}></MySvgIcon>
                    )}
                    {isEnter && (
                      <MySvgIcon
                        href="#icon-yibaoming"
                        color={token.colorInfo}
                        size={4}></MySvgIcon>
                    )}
                  </>
                )}
                {competitionState === 'underway' && (
                  <MySvgIcon
                    href="#icon-jinhangzhong"
                    color={token.colorSuccess}
                    size={4}></MySvgIcon>
                )}
                {competitionState === 'finished' && (
                  <MySvgIcon
                    href="#icon-yijieshu"
                    color={token.colorError}
                    size={4}></MySvgIcon>
                )}
              </span>
            </div>
            <div className="flex-grow">
              <div className=" flex justify-center items-center font-bold ">
                <CompetitionTypeLabel
                  size={2}
                  showLabel={false}
                  type={
                    competition?.type as CompetitionType
                  }></CompetitionTypeLabel>
                <div className="ml-4" style={{ fontSize: '2rem' }}>
                  {competition?.title}
                </div>
              </div>
              {competitionState !== 'finished' && endTime && (
                <div>
                  <div className="flex justify-center items-center">
                    {competitionState === 'notStart' && (
                      <span>距离比赛开始还剩</span>
                    )}
                  </div>
                  <CountDown
                    endTime={endTime}
                    onCountZero={() => {
                      setcompetitionState('finished')
                    }}></CountDown>
                </div>
              )}
            </div>
            {typeof enterNum === 'number' && (
              <div className="flex flex-col items-center justify-center">
                <Tooltip title="查看报名列表">
                  <div
                    className=" font-bold hover:cursor-pointer"
                    onClick={() => getEnterList()}>
                    <div className="flex justify-center ">{enterNum}名</div>
                    <div>参赛者</div>
                  </div>
                </Tooltip>
              </div>
            )}
          </div>
        )}
        {!competition && <Loading></Loading>}
      </Card>

      <div className="w-full mt-4">
        <Card
          className="flex-grow"
          style={{
            minWidth: '1000px',
          }}>
          <Menu
            className="mb-8"
            selectedKeys={[selectedKey]}
            onClick={e => navTo(e)}
            mode="horizontal"
            items={[
              {
                key: 'overview',
                label: '总览',
              },
              {
                key: 'problem',
                label: '题目',
              },
              {
                key: 'rank',
                label: '排名',
              },
              {
                key: 'record',
                label: '提交',
              },
            ]}></Menu>
          <Outlet></Outlet>
        </Card>
      </div>
      <Modal
        title={!isEnter ? '报名' : '取消报名'}
        open={openEnterModal}
        onCancel={() => setopenEnterModal(false)}
        footer={[]}>
        {(type === 'single' || type === 'OI' || type === 'match') && (
          <>
            <div className="mb-16 flex justify-center">
              {!isEnter && <div>报名本比赛？</div>}
              {isEnter && <div>取消报名本比赛？</div>}
            </div>
            <Space className="flex justify-center mt-8">
              <Button onClick={() => setopenEnterModal(false)}>取消</Button>
              <Button type="primary" onClick={enterCompetition}>
                确定
              </Button>
            </Space>
          </>
        )}
        {type === 'group' && competition && (
          <div>
            {!isEnter && (
              <EnterGroup competition={competition} type={type}></EnterGroup>
            )}
            {isEnter && groupInfo && (
              <>
                <GroupInfo group={groupInfo}></GroupInfo>
                <div className="absolute right-8 bottom-8">
                  <Button
                    type="dashed"
                    danger
                    onClick={() => enterCompetition()}>
                    取消报名
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
      <Modal
        title="报名列表"
        open={openEnterListModal}
        onCancel={() => setopenEnterListModal(false)}
        footer={[]}>
        <List
          itemLayout="horizontal"
          dataSource={enterList}
          renderItem={(item, index) => (
            <>
              <List.Item>
                <List.Item.Meta
                  title={<UserCard user={item}></UserCard>}></List.Item.Meta>
              </List.Item>
            </>
          )}></List>
      </Modal>

      {competition && (
        <Update
          competition={competition}
          setcompetition={setCompetition}
          openUpdateModal={openUpdateModal}
          setopenUpdateModal={setopenUpdateModal}></Update>
      )}
    </div>
  )
}

export default Detail
