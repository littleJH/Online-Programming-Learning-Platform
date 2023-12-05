import { Navigate, RouteObject, useLocation, useRoutes } from 'react-router-dom'
import React, { ReactNode, Suspense, lazy } from 'react'
import Loading from '@/components/Loading/Loading'
import { useSetRecoilState } from 'recoil'
import { pathNameState } from '@/store/appStore'
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
  }
}

const Root = lazy(() => import('@/views/Root'))
const ErrorPage = lazy(() => import('@/components/error-page'))
const Homepage = lazy(() => import('@/views/Home/HomeRoot'))
const LoginRoot = lazy(() => import('@/views/Login/LoginRoot'))

// 个人中心
const ProfileRoot = lazy(() => import('@/views/Profile/ProfileRoot'))
const ProfileFriend = lazy(() => import('@/views/Profile/pages/Friend/Friend'))
const ProfileMessage = lazy(() => import('@/views/Profile/pages/Message/Message'))
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
const ProblemCreate = lazy(() => import('@/views/Creation/pages/CreateProblem/Create'))

// 比赛
const CompetitionSetRoot = lazy(() => import('@/views/CompetitionSet/CompetitionSetRoot'))
const CompetitionRoot = lazy(() => import('@/views/Competition/CompetitionRoot'))
const CompetitionAll = lazy(() => import('@/views/CompetitionSet/set/All'))
const CompetitionId = lazy(() => import('@/views/Competition/CompetitionCommon/CompetitionCommonRoot'))
const CompetitionOverview = lazy(() => import('@/views/Competition/CompetitionCommon/pages/OverView/Overview'))
const CompetitionProblem = lazy(() => import('@/views/Competition/CompetitionCommon/pages/Problem/Problem'))
const CompetitionProblemList = lazy(() => import('@/views/Competition/CompetitionCommon/pages/Problem/List/List'))
const CompetitionProblemId = lazy(() => import('@/views/Competition/CompetitionCommon/pages/Problem/Answer/Answer'))
const CompetitionRank = lazy(() => import('@/views/Competition/CompetitionCommon/pages/Rank/Rank'))
const CompetitionRecord = lazy(() => import('@/views/Competition/CompetitionCommon/pages/Record/Record'))
const CompetitionCreate = lazy(() => import('@/views/Creation/pages/CreateCompetition/Create'))
const CompetitionCreateDeclare = lazy(() => import('@/views/Creation/pages/CreateCompetition/Declare'))
const CompetitionCreateCompetition = lazy(() => import('@/views/Creation/pages/CreateCompetition/Competition'))
const CompetitionCreateProblem = lazy(() => import('@/views/Creation/pages/CreateCompetition/Problem'))
const CompetitionRandom = lazy(() => import('@/views/Competition/CompetitionRandom/CompetitionRandom'))

// 社区
const CommunityRoot = lazy(() => import('@/views/Community/CommunityRoot'))
const ArticleSet = lazy(() => import('@/views/Community/Overview/RecommendSet/ArticleSet'))

// 创作中心
const CreationRoot = lazy(() => import('@/views/Creation/root/CreationRoot'))
const CreationNavgation = lazy(() => import('@/views/Creation/root/CreationNavgation'))
const CreateArticle = lazy(() => import('@/views/Creation/pages/CreateArticle'))
const CreateComment = lazy(() => import('@/views/Creation/pages/CreateComment'))
const CreatePost = lazy(() => import('@/views/Creation/pages/CreatePost'))
const CreateTopic = lazy(() => import('@/views/Creation/pages/CreateTopic'))
const CreateForm = lazy(() => import('@/views/Creation/pages/CreateForm'))

// 文章详情
const ArticleDetail = lazy(() => import('@/views/Community/Article/Detail'))

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
        element: Homepage
      },
      {
        path: 'login',
        element: LoginRoot
      },
      //profile
      {
        path: 'profile',
        element: ProfileRoot,
        children: [
          {
            path: 'friend',
            element: ProfileFriend
          },
          {
            path: 'message',
            element: ProfileMessage
          },
          {
            path: 'group',
            element: ProfileGroup
          },
          {
            path: 'info',
            element: ProfileInfo
          },
          {
            path: 'setting',
            element: ProfileSetting
          },
          {
            path: 'account',
            element: ProfileAccount
          },
          {
            path: 'creation',
            element: ProfileCretion,
            children: [
              {
                path: 'article',
                element: ProfileCreationArticle
              },
              {
                path: 'problem',
                element: ProfileCreationProblem
              },
              {
                path: 'group',
                element: ProfileCreationGroup
              },
              {
                path: 'topic',
                element: ProfileCreationTopic
              }
            ]
          }
        ]
      },
      // problemset
      {
        path: 'problemset',
        element: ProblemSetRoot,
        children: [
          {
            path: 'all',
            element: PorblemAll
          },
          {
            path: 'topic',
            element: ProblemTopic
          },
          {
            path: 'form',
            element: ProblemForm
          }
        ]
      },
      //problemDetail
      {
        path: 'problemdetail/:id',
        element: ProblemDetailRoot,
        children: [
          {
            path: 'description',
            element: ProblemDescription
          },
          {
            path: 'records',
            element: ProblemSubmitrecord
          }
        ]
      },
      {
        path: 'competitionset',
        element: CompetitionSetRoot,
        children: [
          {
            path: 'all',
            element: CompetitionAll
          }
        ]
      },
      // competition
      {
        path: 'competition',
        element: CompetitionRoot,
        children: [
          {
            path: ':competition_id',
            element: CompetitionId,
            children: [
              {
                path: 'overview',
                element: CompetitionOverview
              },
              {
                path: 'problem',
                element: CompetitionProblem,
                children: [
                  {
                    path: 'set',
                    element: CompetitionProblemList
                  },
                  {
                    path: ':problem_id',
                    element: CompetitionProblemId
                  }
                ]
              },
              {
                path: 'rank',
                element: CompetitionRank
              },
              {
                path: 'record',
                element: CompetitionRecord
              }
            ]
          },

          {
            path: 'random/:competition_type',
            element: CompetitionRandom
          }
        ]
      },
      // community
      {
        path: 'community',
        element: CommunityRoot,
        children: [
          {
            path: 'articleset',
            element: ArticleSet
          },
          {
            path: 'article/:article_id',
            element: ArticleDetail
          }
        ]
      },
      {
        path: 'creation',
        element: CreationRoot,
        children: [
          {
            path: '',
            element: CreationNavgation,
            meta: {
              title: '创作中心',
              needLogin: false
            }
          },
          {
            path: 'article',
            element: CreateArticle
          },
          {
            path: 'comment',
            element: CreateComment
          },
          {
            path: 'post',
            element: CreatePost
          },
          {
            path: 'problem',
            element: ProblemCreate
          },
          {
            path: 'competition',
            element: CompetitionCreate,
            children: [
              {
                path: 'declare',
                element: CompetitionCreateDeclare
              },

              {
                path: 'competition',
                element: CompetitionCreateCompetition
              },
              {
                path: 'problem',
                element: CompetitionCreateProblem
              }
            ]
          },
          {
            path: 'topic',
            element: CreateTopic
          },
          {
            path: 'form',
            element: CreateForm
          }
        ]
      },
      {
        path: 'file',
        element: FileRoot
      }
    ]
  }
]

const Guard: React.FC<{
  element: ReactNode
  meta: { title: string; needLogin: boolean; redirect: string }
}> = (props) => {
  let { element, meta } = props
  const { pathname } = useLocation()
  if (meta && meta.needLogin && pathname !== '/login') {
    if (!localStorage.getItem('token'))
      element = (
        <Navigate
          to={'/login'}
          replace={true}
        ></Navigate>
      )
  }

  return element
}

const load = (Result: any, meta: any) => {
  const element = (
    <Suspense fallback={<Loading></Loading>}>
      <Result></Result>
    </Suspense>
  )
  return (
    <Guard
      element={element}
      meta={meta}
    ></Guard>
  )
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

  onpopstate = () => setPathName(location.pathname)
  return useRoutes(transformRoutes(routes))
}

export default RouterWaiter
