import { Navigate, RouteObject, useLocation, useRoutes } from 'react-router-dom'
import React, { ComponentType, ReactNode, Suspense, lazy } from 'react'
import Loading from '@/components/Loading/Loading'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isMobileAtom, pathNameState, searchQueryState, sideBarTypeState } from '@/store/appStore'
import Root from '@/views/Root'
import utils from '@/tool/myUtils/utils'
import {
  UserOutlined,
  MenuOutlined,
  StarOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  MessageOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  TrophyOutlined,
  GlobalOutlined,
  CodeOutlined,
  MailOutlined,
  HomeOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'
import myHooks from '@/tool/myHooks/myHooks'
// import Article from '@/views/Profile/Creation/Article/Article'

interface MyRoute {
  path?: string
  element: any
  errorElement?: any
  redirect?: string
  children?: MyRoute[]
  meta?: {
    title?: string
    needLogin?: boolean
    redirect?: string
    level?: number
  }
}

// const Root = lazy(() => import('@/views/Root'))
// const Root = await import('@/views/Root')
// const Root = import.meta.glob('@/views/Root')
const ErrorPage = lazy(() => import('@/components/error-page'))
const StayTuned = lazy(() => import('@/components/Empty/StayTuned'))
const Homepage = lazy(() => import('@/views/Home/HomeRoot'))
const LoginRoot = lazy(() => import('@/views/Login/LoginRoot'))

// 个人中心
const ProfileRoot = lazy(() => import('@/views/Profile/ProfileRoot'))
const ProfileFriend = lazy(() => import('@/views/Profile/pages/Friend/Friend'))
const ProfileMessage = lazy(() => import('@/views/Profile/pages/Message/Message'))
const ProfileEmail = lazy(() => import('@/views/Profile/pages/Email/Email'))
const ProfileGroup = lazy(() => import('@/views/Profile/pages/Group/Group'))
const ProfileInfo = lazy(() => import('@/views/Profile/pages/Info/Info'))
const ProfileSetting = lazy(() => import('@/views/Profile/pages/Setting/Setting'))
const ProfileAccount = lazy(() => import('@/views/Profile/pages/Account/Account'))
const ProfileCretion = lazy(() => import('@/views/Profile/pages/Creation/CreationRoot'))
const ProfileCreationArticle = lazy(() => import('@/views/Profile/pages/Creation/Article'))
const ProfileCreationProblem = lazy(() => import('@/views/Profile/pages/Creation/Problem'))
const ProfileCreationGroup = lazy(() => import('@/views/Profile/pages/Creation/Group'))
const ProfileCreationTopic = lazy(() => import('@/views/Profile/pages/Creation/Topic'))

// 题目
const ProblemDetailRoot = lazy(() => import('@/views/Problem/DetailRoot'))
const ProblemSetRoot = lazy(() => import('@/views/ProblemSet/ProblemSetRoot'))
const PorblemAll = lazy(() => import('@/views/ProblemSet/set/All'))
const ProblemTopic = lazy(() => import('@/views/ProblemSet/topic/Topic'))
const ProblemForm = lazy(() => import('@/views/ProblemSet/form/Form'))
const ProblemDescription = lazy(() => import('@/views/Problem/pages/Description'))
const ProblemSubmitrecord = lazy(() => import('@/views/Problem/pages/Records'))
const ProblemComment = lazy(() => import('@/views/Problem/pages/Comment'))
const ProblemPost = lazy(() => import('@/views/Problem/pages/Post'))
const ProblemCreate = lazy(() => import('@/views/Creation/pages/CreateProblem/Create'))

// 比赛
const CompetitionRoot = lazy(() => import('@/views/Competition/CompetitionRoot'))
const CompetitionCommonRoot = lazy(() => import('@/views/Competition/CompetitionCommon/CompetitionCommonRoot'))
const CompetitionSet = lazy(() => import('@/views/Competition/CompetitionCommon/pages/CompetitionSet/Index'))
const CompetitionId = lazy(
  () => import('@/views/Competition/CompetitionCommon/pages/CompetitionDetail/CompetitionDetailRoot')
)
const CompetitionOverview = lazy(
  () => import('@/views/Competition/CompetitionCommon/pages/CompetitionDetail/pages/OverView/Index')
)
const CompetitionProblem = lazy(
  () => import('@/views/Competition/CompetitionCommon/pages/CompetitionDetail/pages/Problem/Index')
)
const CompetitionProblemId = lazy(
  () => import('@/views/Competition/CompetitionCommon/pages/CompetitionDetail/pages/Problem/component/Answer')
)
const CompetitionRank = lazy(
  () => import('@/views/Competition/CompetitionCommon/pages/CompetitionDetail/pages/Rank/Index')
)
const CompetitionRecord = lazy(
  () => import('@/views/Competition/CompetitionCommon/pages/CompetitionDetail/pages/Record/Index')
)
const CompetitionCreate = lazy(() => import('@/views/Creation/pages/CreateCompetition/Create'))
const CompetitionCreateDeclare = lazy(() => import('@/views/Creation/pages/createCompetition/pages/Declare'))
const CompetitionCreateCompetition = lazy(() => import('@/views/Creation/pages/createCompetition/pages/Competition'))
const CompetitionCreateProblem = lazy(() => import('@/views/Creation/pages/createCompetition/pages/Problem'))
// const CompetitionRandomRoot = lazy(() => import('@/views/Competition/CompetitionRandom/CompetitionRandomRoot'))
const CompetitionRandomRoot = lazy(() => import('@/views/Competition/CompetitionRandom/CompetitionRandomRoot'))
const CompetitionStandardRoot = lazy(() => import('@/views/Competition/CompetitionStandard/CompetitionStandardRoot'))

// 社区
const CommunityRoot = lazy(() => import('@/views/Community/CommunityRoot'))
const ArticleSet = lazy(() => import('@/views/Community/page/RecommendSet/ArticleSet'))

// 创作中心
const CreationRoot = lazy(() => import('@/views/Creation/root/CreationRoot'))
const CreationNavgation = lazy(() => import('@/views/Creation/root/CreationNavgation'))
const CreateArticle = lazy(() => import('@/views/Creation/pages/CreateArticle'))
const CreateComment = lazy(() => import('@/views/Creation/pages/CreateComment'))
const CreatePost = lazy(() => import('@/views/Creation/pages/CreatePost'))
const CreateTopic = lazy(() => import('@/views/Creation/pages/CreateTopic'))
const CreateForm = lazy(() => import('@/views/Creation/pages/CreateForm'))
const CreateNotice = lazy(() => import('@/views/Creation/pages/CreateNotice'))

// 详情
const ArticleDetail = lazy(() => import('@/views/Community/page/Article/Detail'))
const NoticeDetail = lazy(() => import('@/views/Community/page/Notice/NoticeDetail'))
const PostDetail = lazy(() => import('@/views/Community/page/Post/PostDetail'))

// 学习中心
const LearnRoot = lazy(() => import('@/views/Learn/LearnRoot'))

// 文件中心
const FileRoot = lazy(() => import('@/views/File/FileRoot'))

const routes: MyRoute[] = [
  {
    path: '/',
    element: Root,
    errorElement: ErrorPage,
    children: [
      // home
      {
        path: 'home',
        element: Homepage,
      },
      {
        path: 'login',
        element: LoginRoot,
      },
      //profile
      {
        path: 'profile',
        element: ProfileRoot,
        children: [
          {
            path: 'friend',
            // element: ProfileFriend,
            element: StayTuned,
          },
          {
            path: 'message',
            element: ProfileMessage,
          },
          {
            path: 'email',
            // element: ProfileEmail,
            element: StayTuned,
          },
          {
            path: 'group',
            element: ProfileGroup,
          },
          {
            path: 'info',
            element: ProfileInfo,
          },
          {
            path: 'setting',
            element: ProfileSetting,
          },
          {
            path: 'account',
            element: ProfileAccount,
          },
          {
            path: 'creation',
            element: ProfileCretion,
            children: [
              {
                path: 'article',
                element: ProfileCreationArticle,
              },
              {
                path: 'problem',
                element: ProfileCreationProblem,
              },
              {
                path: 'group',
                element: ProfileCreationGroup,
              },
              {
                path: 'topic',
                element: ProfileCreationTopic,
              },
            ],
          },
        ],
      },
      // problemset
      {
        path: 'problemset',
        element: ProblemSetRoot,
        children: [
          {
            path: 'all',
            element: PorblemAll,
          },
          {
            path: 'topic',
            element: ProblemTopic,
          },
          {
            path: 'form',
            element: ProblemForm,
          },
        ],
      },
      //problemDetail
      {
        path: 'problemdetail/:id',
        element: ProblemDetailRoot,
        children: [
          {
            path: 'description',
            element: ProblemDescription,
          },
          {
            path: 'records',
            element: ProblemSubmitrecord,
          },
          {
            path: 'comment',
            element: ProblemComment,
          },
          {
            path: 'post',
            element: ProblemPost,
          },
        ],
      },
      // competition
      {
        path: 'competition',
        element: CompetitionRoot,
        children: [
          {
            path: 'common',
            element: CompetitionCommonRoot,
            children: [
              {
                path: 'set',
                element: CompetitionSet,
              },
              {
                path: ':competition_id',
                element: CompetitionId,
                children: [
                  {
                    path: 'overview',
                    element: CompetitionOverview,
                  },
                  {
                    path: 'problem',
                    element: CompetitionProblem,
                  },
                  {
                    path: 'rank',
                    element: CompetitionRank,
                  },
                  {
                    path: 'record',
                    element: CompetitionRecord,
                  },
                ],
              },
            ],
          },
          {
            path: 'random',
            element: CompetitionRandomRoot,
            // children: [
            //   {
            //     path: ':competition_type',
            //     element: CompetitionRandom,
            //   },
            // ],
          },
          {
            path: 'standard',
            element: CompetitionStandardRoot,
          },
        ],
      },
      // community
      {
        path: 'community',
        element: CommunityRoot,
        children: [
          {
            path: 'articleset',
            element: ArticleSet,
          },
          {
            path: 'article/:article_id',
            element: ArticleDetail,
          },
          {
            path: 'notice/:notice_id',
            element: NoticeDetail,
          },
          {
            path: 'post/:post_id',
            element: PostDetail,
          },
        ],
      },
      // creation
      {
        path: 'creation',
        element: CreationRoot,
        children: [
          {
            path: '',
            element: CreationNavgation,
            meta: {
              title: '创作中心',
              needLogin: false,
            },
          },
          {
            path: 'article',
            element: CreateArticle,
          },
          {
            path: 'comment',
            element: CreateComment,
          },
          {
            path: 'post',
            element: CreatePost,
          },
          {
            path: 'problem',
            element: ProblemCreate,
          },
          {
            path: 'competition',
            element: CompetitionCreate,
            children: [
              {
                path: 'declare',
                element: CompetitionCreateDeclare,
              },

              {
                path: 'competition',
                element: CompetitionCreateCompetition,
              },
              {
                path: 'problem',
                element: CompetitionCreateProblem,
              },
            ],
          },
          {
            path: 'topic',
            element: CreateTopic,
          },
          {
            path: 'form',
            element: CreateForm,
          },
          {
            path: 'notice',
            element: CreateNotice,
          },
        ],
      },
      // learn
      {
        path: 'learn',
        element: LearnRoot,
      },
      {
        path: 'file',
        element: FileRoot,
      },
    ],
  },
]

const Guard: React.FC<{
  element: any
  meta: { title: string; level?: number; needLogin: boolean; redirect: string }
}> = (props) => {
  let { element, meta } = props
  const { pathname } = useLocation()
  if (meta && meta.needLogin && pathname !== '/login') {
    if (!localStorage.getItem('token')) element = <Navigate to={'/login'} replace={true}></Navigate>
    if (!meta.level || Number(localStorage.getItem('level')) < meta?.level)
      element = <Navigate to={meta.redirect} replace={true}></Navigate>
  }
  return element
}

const load = (Result: any, meta: any) => {
  const element = (
    <Suspense fallback={<Loading></Loading>}>
      <Result></Result>
    </Suspense>
  )
  return <Guard element={element} meta={meta}></Guard>
}

const transformRoutes = (routes: MyRoute[]) => {
  const list: RouteObject[] = []
  routes.forEach((item) => {
    const obj = { ...item }
    if (!obj.path) return
    obj.element = load(obj.element, obj.meta)
    if (obj.children) obj.children = transformRoutes(obj.children) as any
    list.push(obj)
  })
  return list
}

const RouterWaiter = () => {
  const setPathName = useSetRecoilState(pathNameState)
  const setSearchQuery = useSetRecoilState(searchQueryState)
  const setSideBarType = useSetRecoilState(sideBarTypeState)
  const isMobile = useRecoilValue(isMobileAtom)

  window.onpopstate = (e: any) => {
    const path = e.target?.location?.pathname
    console.log('onpopstate...', path)
    if (path) {
      setSideBarType(isMobile ? 'none' : utils.getSideBarType(path))
      setPathName(location.pathname)
      setSearchQuery(location.search)
    }
  }
  return useRoutes(transformRoutes(routes))
}

export default RouterWaiter

export const siderMenuItemsObj: any = {
  problemsetMenuItem: [
    {
      label: '全部',
      key: 'problemset/all',
    },
    {
      label: '题单',
      key: 'problemset/topic',
    },
    {
      label: '表单',
      key: 'problemset/form',
    },
  ],
  problemdetailMenuItem: [
    {
      label: '题目描述',
      key: 'description',
    },
    {
      label: '提交记录',
      key: 'records',
    },
    {
      label: '讨论',
      key: 'comment',
    },
    {
      label: '题解',
      key: 'post',
    },
  ],
  competitionMenuItem: [
    {
      label: '普通赛',
      key: 'competition/common/set',
    },
    {
      label: '及时赛',
      key: 'competition/random/set',
    },
    {
      label: '标准赛',
      key: 'competition/standard/set',
    },
  ],
  communityMenuItem: [
    {
      label: '文章',
      key: 'community/articleset',
    },
    {
      label: '讨论',
      key: 'community/commentset',
    },
    {
      label: '题解',
      key: 'community/postset',
    },
  ],
  // creationMenuItem: [
  //   {
  //     key: 'sub1',
  //     label: '题目相关',
  //     icon: <CodeOutlined />,
  //     children: [
  //       {
  //         label: '题目',
  //         key: 'problem',
  //       },
  //       {
  //         label: '题单',
  //         key: 'topic',
  //       },
  //       {
  //         label: '表单',
  //         key: 'form',
  //       },
  //       {
  //         label: '题解',
  //         key: 'post',
  //       },
  //     ],
  //   },
  //   {
  //     key: 'sub2',
  //     label: '社区相关',
  //     icon: <GlobalOutlined />,
  //     children: [
  //       {
  //         label: '公告',
  //         key: 'notice',
  //       },
  //       {
  //         label: '文章',
  //         key: 'article',
  //       },
  //       {
  //         label: '讨论',
  //         key: 'comment',
  //       },
  //     ],
  //   },
  //   {
  //     key: 'sub3',
  //     label: '比赛相关',
  //     icon: <TrophyOutlined />,
  //     children: [
  //       {
  //         label: '比赛',
  //         key: 'competition/declare',
  //       },
  //     ],
  //   },
  // ],
  profileMenuItem: [
    {
      key: 'profile/group',
      label: '群组',
      icon: <TeamOutlined />,
    },
    // {
    //   key: 'friend',
    //   label: '好友',
    //   icon: <UserOutlined />,
    // },

    {
      key: 'profile/message',
      label: '留言板',
      icon: <MessageOutlined />,
    },
    // {
    //   key: 'email',
    //   label: '邮箱',
    //   icon: <MailOutlined />,
    // },

    {
      key: 'divider3',
      type: 'divider',
    },
    {
      key: 'profile/info',
      label: '个人信息',
      icon: <InfoCircleOutlined />,
    },
    {
      key: 'profile/setting',
      label: '偏好设置',
      icon: <SettingOutlined />,
    },
    {
      key: 'profile/account',
      label: '账号安全',
      icon: <SafetyCertificateOutlined />,
    },
    {
      type: 'divider',
      key: 'divider1',
    },
    {
      key: 'profile/creation',
      label: '我创建的',
      icon: <MenuOutlined />,
      children: [
        {
          key: 'profile/creation/problem',
          label: '题目',
          // icon: (
          //   <svg className='icon-small'>
          //     <use href='#icon-problem'></use>
          //   </svg>
          // )
        },
        {
          key: 'profile/creation/topic',
          label: '题单',
          // icon: (
          //   <svg className='icon-small'>
          //     <use href='#icon-topic'></use>
          //   </svg>
          // )
        },
        {
          key: 'profile/creation/form',
          label: '表单',
          // icon: (
          //   <svg className='icon-small'>
          //     <use href='#icon-liebiaoqingdan'></use>
          //   </svg>
          // )
        },
        {
          key: 'profile/creation/article',
          label: '文章',
          // icon: (
          //   <svg className='icon-small'>
          //     <use href='#icon-article'></use>
          //   </svg>
          // )
        },
        {
          key: 'profile/creation/group',
          label: '用户组',
        },
      ],
    },
    {
      key: 'star',
      label: '收藏夹',
      icon: <StarOutlined />,
      children: [
        {
          key: 'profile/star/problem',
          label: '题目',
          // icon: (
          //   <svg className='icon-small'>
          //     <use href='#icon-problem'></use>
          //   </svg>
          // )
        },
        {
          key: 'profile/star/topic',
          label: '题单',
          // icon: (
          //   <svg className='icon-small'>
          //     <use href='#icon-topic'></use>
          //   </svg>
          // )
        },
        {
          key: 'profile/star/form',
          label: '表单',
          // icon: (
          //   <svg className='icon-small'>
          //     <use href='#icon-liebiaoqingdan'></use>
          //   </svg>
          // )
        },
        {
          key: 'profile/star/article',
          label: '文章',
          // icon: (
          //   <svg className='icon-small'>
          //     <use href='#icon-article'></use>
          //   </svg>
          // )
        },
      ],
    },
    // {
    //   type: 'divider',
    //   key: 'divider2',
    // },
  ],
}

export const headerMenuItems = [
  {
    label: '首页',
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: '题库',
    key: 'problemset/all',
    icon: <CodeOutlined />,
  },
  {
    label: '比赛',
    key: 'competition/common/set',
    icon: <TrophyOutlined />,
  },
  {
    label: '社区',
    key: 'community/articleset',
    icon: <GlobalOutlined />,
  },

  {
    label: '发布中心',
    key: 'creation',
    icon: <BulbOutlined />,
  },
  // {
  //   label: '个人中心',
  //   key: 'profile',
  //   icon: <UserOutlined />,
  // },
]

// export const headerMenuItems = (() => {
//   const items: any[] = [
//     {
//       label: '首页',
//       key: 'home',
//       icon: <HomeOutlined />,
//     },
//     {
//       label: '题库',
//       key: 'problemset',
//       icon: <CodeOutlined />,
//     },
//     {
//       label: '比赛',
//       key: 'competition',
//       icon: <TrophyOutlined />,
//     },
//     {
//       label: '社区',
//       key: 'community',
//       icon: <GlobalOutlined />,
//     },

//     {
//       label: '发布中心',
//       key: 'creation',
//       icon: <BulbOutlined />,
//     },
//     // {
//     //   label: '个人中心',
//     //   key: 'profile',
//     //   icon: <UserOutlined />,
//     // },
//   ]

//   console.log(
//     'headerMenuItems ==> ',
//     items.map((item) => ({ ...item, children: siderMenuItemsObj[`${item.key}MenuItem`] }))
//   )

//   return items.map((item) => ({ ...item, children: siderMenuItemsObj[`${item.key}MenuItem`] }))
// })()

export const footerMenuItems = [
  {
    label: '首页',
    key: 'home',
    // icon: <HomeOutlined />,
  },
  {
    label: '题库',
    key: 'problemset/all',
    // icon: <CodeOutlined />,
  },
  {
    label: '比赛',
    key: 'competition/common/set',
    // icon: <TrophyOutlined />,
  },
  {
    label: '社区',
    key: 'community/articleset',
    // icon: <GlobalOutlined />,
  },
  {
    label: '创作',
    key: 'creation',
    // icon: <BulbOutlined />,
  },
  {
    label: '我的',
    key: 'profile/info',
    // icon: <UserOutlined />,
  },
]
