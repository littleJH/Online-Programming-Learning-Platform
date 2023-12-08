import React, {Fragment, useEffect, useLayoutEffect, useState} from 'react'
import {Outlet, useLocation, useNavigate, useParams} from 'react-router-dom'
import {showCompetitionApi} from '@/api/competition'
import {
  cancelEnterApi,
  enterCompetitionApi,
  getEnterListApi
} from '@/api/competitionMixture'
import {getEnterConditionApi} from '@/api/competitionMixture'
import dayjs from 'dayjs'
import Sidebar from './component/SideBar/Sidebar'
import {CompetitionType, ICompetition, IGroup} from '@/type'
import {
  Button,
  List,
  Menu,
  Modal,
  theme,
  Tooltip,
  notification,
  Card
} from 'antd'
import Update from './component/Update/Update'
import {getUserInfoApi} from '@/api/user'
import UserCard from '@/components/User/UserCard'
import {User} from '@/type'
import CompetitionTypeLabel from './component/Label/CompetitionTypeLabel'
import EnterGroup from './component/Group/EnterGroup'
import GroupInfo from './component/Group/GroupInfo'
import {getMemberGroupListApi} from '@/api/group'
import useNavTo from '@/tool/myHooks/useNavTo'
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {competitionStateAtom, currentCompetitionAtom} from '../competitionStore'
import CountDown from '@/components/countDown/CountDown'
import MySvgIcon from '@/components/Icon/MySvgIcon'
import {pathNameState} from '@/store/appStore'

type CompetitionState = 'notEnter' | 'underway' | 'enter' | 'finished'

const getState = (
  start: string,
  end: string,
  enter: boolean
): CompetitionState => {
  if (dayjs(start).valueOf() > dayjs().valueOf()) {
    return enter ? 'enter' : 'notEnter'
  } else if (
    dayjs(start).valueOf() < dayjs().valueOf() &&
    dayjs(end).valueOf() > dayjs().valueOf()
  ) {
    return 'underway'
  } else return 'finished'
}

const Detail: React.FC = () => {
  const nav = useNavTo()
  const location = useLocation()
  const {competition_id} = useParams()
  const [type, settype] = useState<CompetitionType>('')
  const [current, setcurrent] = useState('')
  const [competitionState, setcompetitionState] =
    useRecoilState(competitionStateAtom)
  const [competition, setCompetition] = useRecoilState(currentCompetitionAtom)
  const [enterNum, setenterNum] = useState()
  const [endTime, setEndTime] = useState<string>()
  const [openEnterModal, setopenEnterModal] = useState(false)
  const [openUpdateModal, setopenUpdateModal] = useState(false)
  const [openEnterListModal, setopenEnterListModal] = useState(false)
  const [enterList, setenterList] = useState<User[]>([])
  const [answering, setanswering] = useState(false)
  const [groupInfo, setgroupInfo] = useState<IGroup>()
  const pathname = useRecoilValue(pathNameState)

  const {token} = theme.useToken()

  useLayoutEffect(() => {
    if (location.pathname.indexOf('problem') >= 0) {
      setanswering(
        location.pathname.slice(location.pathname.indexOf('problem') + 8)
          .length === 0
          ? false
          : true
      )
    } else setanswering(false)
  }, [])

  useEffect(() => {
    competition_id &&
      showCompetitionApi(competition_id).then((res) => {
        const competition = res.data.data.competition
        const type: CompetitionType =
          competition.type.toLowerCase() as CompetitionType
        competition.type = type
        setCompetition(res.data.data.competition)
        settype(type)
        switch (type) {
          case 'single':
            fetchSingle(competition)
            break
          case 'group':
            fetchGroup(competition)
            break
          case 'match':
            fetchMatch(competition)
            break
          default:
            break
        }
      })
  }, [])

  const fetchSingle = async (competition: ICompetition) => {
    const type = 'single'
    const result = await getEnterConditionApi(type, competition.id)
    console.log(result)
    const state = getState(
      competition.start_time,
      competition.end_time,
      result.data.data.enter
    )
    setcompetitionState(state)
    if (state === 'enter' || state === 'notEnter')
      setEndTime(competition.start_time)
    else if (state === 'underway') setEndTime(competition.end_time)
    getEnterListApi(type, competition.id).then((res) => {
      setenterNum(res.data.data.total)
    })
  }

  const fetchGroup = async (competition: ICompetition) => {
    const type = 'group'
    const result = await getEnterConditionApi(type, competition.id)
    if (result.data.data) {
      const group = result.data.data.group as IGroup
      getMemberGroupListApi(group.id).then(async (res) => {
        const members = res.data.data.userList
        const users: User[] = []
        for (let item of members) {
          await getUserInfoApi(item.user_id).then((res) => {
            users.push(res.data.data.user)
          })
        }
        Object.assign(group, {
          members: users
        })
        setgroupInfo(group)
      })
    }
    const state = getState(
      competition.start_time,
      competition.end_time,
      result.data.data ? true : false
    )
    setcompetitionState(state)
    if (state === 'enter' || state === 'notEnter')
      setEndTime(competition.start_time)
    else if (state === 'underway') setEndTime(competition.end_time)
    // getEnterListApi(type, competition.id).then(res => {
    //   setenterNum(res.data.data.total)
    // })
  }

  const fetchMatch = async (competition: ICompetition) => {
    const type = 'match'
    const result = await getEnterConditionApi(type, competition.id)
    console.log(result)
    const state = getState(
      competition.start_time,
      competition.end_time,
      result.data.data ? true : false
    )
    setcompetitionState(state)
  }

  const enterCompetition = () => {
    const data = {
      password: '666666'
    }
    if (competitionState === 'notEnter') {
      enterCompetitionApi(
        type,
        competition?.id as string,
        JSON.stringify(data)
      ).then((res) => {
        if (res.data.code === 200) {
          setopenEnterModal(false)
          setcompetitionState('enter')
          notification.success({
            message: '报名成功'
          })
        } else {
          notification.warning({
            message: res.data.msg
          })
        }
      })
    } else if (competitionState === 'enter') {
      groupInfo &&
        cancelEnterApi(
          type,
          competition?.id as string,
          groupInfo.id ? groupInfo.id : ''
        ).then((res) => {
          if (res.data.code === 200) {
            setopenEnterModal(false)
            setcompetitionState('notEnter')
            notification.success({
              message: '取消报名成功'
            })
          } else {
            notification.warning({
              message: res.data.msg
            })
          }
        })
    }
  }

  const getEnterList = () => {
    setenterList([])
    setopenEnterListModal(true)
    getEnterListApi(type, competition?.id as string).then((res) => {
      console.log('enterlist', res.data.data)
      res.data.data.competitionRanks.forEach((item: any) => {
        getUserInfoApi(item.member_id).then((result) => {
          setenterList((value) => [...value, result.data.data.user])
        })
      })
    })
  }

  const navTo = (e: any) => {
    setanswering(false)
    setcurrent(e.key)
    nav(`/competition/${competition_id}/${e.key}`)
  }

  return (
    <div className='max-w-screen-xl'>
      {/* header */}
      <Card>
        <div className='flex'>
          <div className='flex flex-col items-center justify-center'>
            <span
              className='cursor-pointer'
              onClick={() =>
                ['notEnter', 'enter'].includes(competitionState as string)
                  ? setopenEnterModal(true)
                  : null
              }>
              {competitionState === 'notEnter' && (
                <MySvgIcon
                  href='#icon-weibaoming'
                  color={token.colorWarning}
                  size={4}></MySvgIcon>
              )}
              {competitionState === 'enter' && (
                <MySvgIcon
                  href='#icon-yibaoming'
                  color={token.colorInfo}
                  size={4}></MySvgIcon>
              )}
              {competitionState === 'underway' && (
                <MySvgIcon
                  href='#icon-jinhangzhong'
                  color={token.colorSuccess}
                  size={4}></MySvgIcon>
              )}
              {competitionState === 'finished' && (
                <MySvgIcon
                  href='#icon-yijieshu'
                  color={token.colorError}
                  size={4}></MySvgIcon>
              )}
            </span>
          </div>
          <div className='flex-grow'>
            <div className=' flex justify-center items-center font-bold '>
              <CompetitionTypeLabel
                size={2}
                showLabel={false}
                type={
                  competition?.type as CompetitionType
                }></CompetitionTypeLabel>
              <div className='ml-4' style={{fontSize: '2rem'}}>
                {competition?.title}
              </div>
            </div>
            {competitionState !== 'finished' && endTime && (
              <div>
                <CountDown
                  endTime={endTime}
                  onCountZero={() => {
                    setcompetitionState('finished')
                  }}></CountDown>
              </div>
            )}
          </div>
          {typeof enterNum === 'number' && (
            <div className='flex flex-col items-center justify-center'>
              <Tooltip title='查看报名列表'>
                <div
                  className=' font-bold hover:cursor-pointer'
                  onClick={() => getEnterList()}>
                  <div className='flex justify-center '>{enterNum}名</div>
                  <div>参赛者</div>
                </div>
              </Tooltip>
            </div>
          )}
        </div>
      </Card>
      <Menu
        className='my-4'
        selectedKeys={[current]}
        onClick={(e) => navTo(e)}
        mode='horizontal'
        items={[
          {
            key: 'overview',
            label: '总览'
          },
          {
            key: 'problem',
            label: '题目'
          },
          {
            key: 'rank',
            label: '排名'
          },
          {
            key: 'record',
            label: '提交'
          }
        ]}></Menu>
      <div className='flex w-full'>
        {/* content */}
        <Card
          className='flex-grow'
          style={{
            minWidth: '1000px'
          }}>
          <Outlet></Outlet>
        </Card>
        {/* sidebar */}
        {!answering && competition && (
          <>
            <div className='w-8'></div>
            <Card size='small' className='w-96 h-min'>
              <Sidebar
                type={type}
                competition={competition}
                setopenUpdateModal={setopenUpdateModal}></Sidebar>
            </Card>
          </>
        )}
      </div>
      <Modal
        title={competitionState === 'notEnter' ? '报名' : '取消报名'}
        open={openEnterModal}
        onCancel={() => setopenEnterModal(false)}
        footer={[]}>
        {type === 'single' && (
          <Fragment>
            <div>
              {competitionState === 'notEnter' && <div>报名本个人赛？</div>}
              {competitionState === 'enter' && <div>取消报名本个人赛？</div>}
            </div>
            <div className='flex justify-center mt-8'>
              <Button onClick={() => setopenEnterModal(false)}>取消</Button>
              <Button type='primary' onClick={enterCompetition}>
                确定
              </Button>
            </div>
          </Fragment>
        )}
        {type === 'group' && competition && (
          <div>
            {competitionState === 'notEnter' && (
              <EnterGroup competition={competition} type={type}></EnterGroup>
            )}
            {competitionState === 'enter' && groupInfo && (
              <Fragment>
                <GroupInfo group={groupInfo}></GroupInfo>
                <div className='absolute right-8 bottom-8'>
                  <Button
                    type='dashed'
                    danger
                    onClick={() => enterCompetition()}>
                    取消报名
                  </Button>
                </div>
              </Fragment>
            )}
          </div>
        )}
      </Modal>
      <Modal
        title='报名列表'
        open={openEnterListModal}
        onCancel={() => setopenEnterListModal(false)}
        footer={[]}>
        <List
          itemLayout='horizontal'
          dataSource={enterList}
          renderItem={(item, index) => (
            <Fragment>
              <List.Item>
                <List.Item.Meta
                  title={<UserCard user={item}></UserCard>}></List.Item.Meta>
              </List.Item>
            </Fragment>
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
