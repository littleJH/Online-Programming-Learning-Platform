import React, { useEffect, useMemo, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { getComLabels, showCompetitionApi } from '@/api/competition'
import { cancelEnterApi, enterCompetitionApi, getEnterListApi } from '@/api/competitionMixture'
import { getEnterConditionApi } from '@/api/competitionMixture'
import dayjs from 'dayjs'
import { CompetitionType, IGroup } from '@/type'
import { Button, List, Menu, Modal, theme, Tooltip, Card, Space, Divider } from 'antd'
import Update from '../../component/Update/Update'
import { getUserInfoApi } from '@/api/user'
import UserCard from '@/components/User/UserCard'
import { User } from '@/type'
import CompetitionTypeLabel from '../../component/Label/CompetitionTypeLabel'
import EnterGroup from '../../component/Group/EnterGroup'
import GroupInfo from '@/components/group/GroupInfo'
import { getGroupApi, getMemberGroupListApi } from '@/api/group'
import utils from '@/tool/myUtils/utils'
import { useRecoilState, useRecoilValue } from 'recoil'
import { competitionStateAtom, currentCompetitionAtom, isEnterState } from '../../../competitionStore'
import CountDown from '@/components/countDown/CountDown'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import Loading from '@/components/Loading/Loading'
import { isMobileAtom, notificationApi, pathNameState } from '@/store/appStore'
import myHooks from '@/tool/myHooks/myHooks'
import style from '../../../style.module.scss'

type State = 'notStart' | 'underway' | 'finished'
const getState = (start: string, end: string): State => {
  if (dayjs(start).valueOf() > dayjs().valueOf()) {
    return 'notStart'
  } else if (dayjs(start).valueOf() < dayjs().valueOf() && dayjs(end).valueOf() > dayjs().valueOf()) {
    return 'underway'
  } else return 'finished'
}

const Detail: React.FC = () => {
  const isMobile = useRecoilValue(isMobileAtom)
  const { token } = theme.useToken()
  const nav = myHooks.useNavTo()
  const pathname = useRecoilValue(pathNameState)
  const { competition_id } = useParams()
  const [type, settype] = useState<CompetitionType>('')
  const [competitionState, setcompetitionState] = useRecoilState(competitionStateAtom)
  const [competition, setCompetition] = useRecoilState(currentCompetitionAtom)
  const [isEnter, setIsEnter] = useRecoilState(isEnterState)
  const [enterNum, setenterNum] = useState<number>(0)
  const [endTime, setEndTime] = useState<string>()
  const [openEnterModal, setopenEnterModal] = useState(false)
  const [openUpdateModal, setopenUpdateModal] = useState(false)
  const [openEnterListModal, setopenEnterListModal] = useState(false)
  const [enterUsers, setEnterUsers] = useState<User[]>([])
  const [enterGroups, setEnterGroups] = useState<IGroup[]>([])
  const [groupInfo, setgroupInfo] = useState<IGroup>()
  const notification = useRecoilValue(notificationApi)
  const selectedKey = useMemo(() => utils.getPathArray(pathname)[3], [pathname])

  useEffect(() => {
    competition_id && fetch()
  }, [competition_id])

  const fetch = async () => {
    if (!competition_id) return
    const res = await showCompetitionApi(competition_id)
    const res3 = await getComLabels(competition_id)
    const competition = res.data.data.competition
    competition.labels = (res3.data.data?.competitionLabels || []).map((item: any) => {
      return {
        id: item.id,
        label: item.label,
        competition_id: item.compeition_id,
      }
    })
    competition.type = competition.type !== 'OI' ? competition.type.toLowerCase() : competition.type
    const type = competition.type
    const res1 = await getEnterConditionApi(type, competition.id)
    const state = getState(competition.start_time, competition.end_time)
    if (type !== 'match') {
      state === 'notStart' && setEndTime(competition.start_time)
      state === 'underway' && setEndTime(competition.end_time)
    }
    type === 'group' && setIsEnter(res1.data.data ? true : false)
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
        members: users,
      })
    } else if (type === 'match') {
    } else {
    }
    const res2 = await getEnterListApi(type, competition.id)
    setenterNum(res2.data.data.total)
  }

  const enterCompetition = async () => {
    if (!competition) return
    const data = {
      password: '666666',
    }
    if (!isEnter) {
      const res = await enterCompetitionApi(type, competition?.id, JSON.stringify(data))
      if (res.data.code === 200) {
        setopenEnterModal(false)
        setIsEnter(true)
        setenterNum((value) => value + 1)
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
        res = await cancelEnterApi(type, competition?.id, groupInfo.id ? groupInfo.id : '')
      } else {
        res = await cancelEnterApi(type, competition?.id)
      }
      if (res.data.code === 200) {
        setopenEnterModal(false)
        setIsEnter(false)
        setenterNum((value) => value - 1)
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

  const getEnterList = async () => {
    setEnterUsers([])
    setEnterGroups([])
    setopenEnterListModal(true)
    if (competition?.id) {
      const result = await getEnterListApi(type, competition?.id)
      if (result.data.code === 200) {
        const list = []
        for (let item of result.data.data.competitionRanks) {
          if (type === 'Group' || type === 'group') {
            const groupInfo = await getGroupApi(item.member_id)
            list.push(groupInfo.data.data.group)
            setEnterGroups(list)
          } else {
            const userInfo = await getUserInfoApi(item.member_id)
            list.push(userInfo.data.data.user)
            setEnterUsers(list)
          }
        }
      }
    }
  }

  const navTo = (e: any) => {
    const key = e.key
    //任何状态均可浏览overview
    if (key === 'overview') {
      nav(`/competition/common/${competition_id}/${key}`)
    } else {
      switch (competitionState) {
        //比赛未开始
        case 'notStart':
          notification &&
            notification.warning({
              message: '比赛未开始',
            })
          break
        // 比赛已开始
        case 'underway':
          // 已报名
          isEnter && nav(`/competition/common/${competition_id}/${key}`)
          // 未报名
          !isEnter &&
            notification &&
            notification.warning({
              message: (
                <div>
                  <p>比赛进行中，您未报名此比赛</p>
                  <p
                    onClick={() => nav('/competition/common/set')}
                    className="hover:cursor-pointer"
                    style={{
                      color: token.colorLink,
                    }}
                  >
                    查看更多比赛
                  </p>
                </div>
              ),
            })
          break
        // 比赛已结束
        case 'finished':
          // 已报名
          isEnter && nav(`/competition/common/${competition_id}/${key}`)
          // 未报名
          !isEnter &&
            notification &&
            notification.warning({
              message: (
                <div>
                  <p>比赛已结束，您未报名此比赛</p>
                  <p
                    onClick={() => nav('/competition/common/set')}
                    className="hover:cursor-pointer"
                    style={{
                      color: token.colorLink,
                    }}
                  >
                    查看更多比赛
                  </p>
                </div>
              ),
            })
          break
        default:
          break
      }
    }
  }

  return (
    <div className={style.commondetail}>
      {/* header */}
      <div>
        {competition && (
          <div className={style.header}>
            <div className={style.info}>
              <div
                className="cursor-pointer"
                onClick={() => competitionState === 'notStart' && setopenEnterModal(true)}
              >
                {competitionState === 'notStart' && (
                  <>
                    {!isEnter && <MySvgIcon href="#icon-weibaoming" color={token.colorWarning} size={4}></MySvgIcon>}
                    {isEnter && <MySvgIcon href="#icon-yibaoming" color={token.colorInfo} size={4}></MySvgIcon>}
                  </>
                )}
                {competitionState === 'underway' && (
                  <MySvgIcon href="#icon-jinhangzhong" color={token.colorSuccess} size={4}></MySvgIcon>
                )}
                {competitionState === 'finished' && (
                  <MySvgIcon href="#icon-yijieshu" color={token.colorError} size={4}></MySvgIcon>
                )}
              </div>
              <div className="flex-grow">
                <div className=" flex justify-center items-center font-bold ">
                  {/* <CompetitionTypeLabel
                  size={2}
                  showLabel={false}
                  type={competition?.type as CompetitionType}
                ></CompetitionTypeLabel> */}
                  <div style={{ fontSize: '2rem' }}>{competition?.title}</div>
                </div>
              </div>
              {typeof enterNum === 'number' && (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex justify-center ">
                    <div>已参赛：</div>
                    <Tooltip title="查看报名列表">
                      <div
                        onClick={() => getEnterList()}
                        className="hover:cursor-pointer"
                        style={{
                          color: token.colorLink,
                        }}
                      >
                        {enterNum}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
            <div className={style.countdown}>
              {endTime && (
                <>
                  {competitionState !== 'finished' && (
                    <div>
                      <div className="flex justify-center items-center mb-4">
                        {competitionState === 'notStart' && (
                          <span>
                            距离比赛<span style={{ color: token.colorError }}>开始</span>还剩
                          </span>
                        )}
                        {competitionState === 'underway' && (
                          <span>
                            距离比赛<span style={{ color: token.colorError }}>结束</span>还剩
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <CountDown
                    endTime={endTime}
                    onCountZero={() => {
                      competitionState === 'notStart' && setEndTime(competition.end_time)
                      setcompetitionState(competitionState === 'notStart' ? 'underway' : 'finished')
                    }}
                  ></CountDown>
                </>
              )}
            </div>
          </div>
        )}
        {!competition && <Loading></Loading>}
      </div>

      <Divider></Divider>

      <div className={style.content}>
        <div className={style.contentCard}>
          <Menu
            className="mb-8"
            selectedKeys={[selectedKey]}
            onClick={(e) => navTo(e)}
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
            ]}
          ></Menu>
          <Outlet></Outlet>
        </div>
      </div>
      <Modal
        title={!isEnter ? '报名' : '取消报名'}
        open={openEnterModal}
        onCancel={() => setopenEnterModal(false)}
        footer={[]}
      >
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
              <EnterGroup
                competition={competition}
                type={type}
                onEnterSuccess={(groupInfo: IGroup) => {
                  setopenEnterModal(false)
                  setenterNum((value) => value + 1)
                  setIsEnter(true)
                  setgroupInfo(groupInfo)
                }}
              ></EnterGroup>
            )}
            {isEnter && groupInfo && (
              <>
                <GroupInfo group={groupInfo}></GroupInfo>
                <div className="absolute right-8 bottom-8">
                  <Button type="dashed" danger onClick={() => enterCompetition()}>
                    取消报名
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
      <Modal title="报名列表" open={openEnterListModal} onCancel={() => setopenEnterListModal(false)} footer={[]}>
        <>
          {enterUsers.length > 0 && (
            <List
              itemLayout="horizontal"
              dataSource={enterUsers}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta title={<UserCard user={item}></UserCard>}></List.Item.Meta>
                </List.Item>
              )}
            ></List>
          )}
          {enterGroups.length > 0 && (
            <List
              itemLayout="horizontal"
              dataSource={enterGroups}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta title={<GroupInfo group={item}></GroupInfo>}></List.Item.Meta>
                </List.Item>
              )}
            ></List>
          )}
        </>
      </Modal>

      {competition && (
        <Update
          competition={competition}
          setcompetition={setCompetition}
          openUpdateModal={openUpdateModal}
          setopenUpdateModal={setopenUpdateModal}
        ></Update>
      )}
    </div>
  )
}

export default Detail
