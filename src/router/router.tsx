import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '@/components/error-page'
import { Suspense, lazy } from 'react'
import Loading from '@/components/Loading/Loading'
import Root from '@/views/Root'

const Home = lazy(() => import('@/views/Home/HomeRoot'))
const ProblemRoot = lazy(() => import('@/views/Problem/ProblemRoot'))
const ProblemSetRoot = lazy(
  () => import('@/views/Problem/ProblemSet/ProblemSetRoot')
)
const PorblemAll = lazy(() => import('@/views/Problem/ProblemSet/Set/All'))
const ProblemId = lazy(() => import('@/views/Problem/Detail/Detail'))
const ProblemDescription = lazy(
  () => import('@/views/Problem/Detail/Description')
)
const ProblemSubmitrecord = lazy(
  () => import('@/views/Problem/Detail/Record/Records')
)
const ProblemCreate = lazy(
  () => import('@/views/Creation/CreateProblem/Create')
)
const Competition = lazy(() => import('@/views/Competition/CompetitionRoot'))
const CompetitionList = lazy(() => import('@/views/Competition/List/List'))
const CompetitionId = lazy(
  () => import('@/views/Competition/Detail//Detail/Detail')
)
const CompetitionOverview = lazy(
  () => import('@/views/Competition/Detail/Content/Overview')
)
const CompetitionProblem = lazy(
  () => import('@/views/Competition/Detail/Content/Problem/Problem')
)
const CompetitionProblemList = lazy(
  () => import('@/views/Competition/Detail/Content/Problem/List/List')
)
const CompetitionProblemId = lazy(
  () => import('@/views/Competition/Detail/Content/Problem/Answer/Answer')
)
const CompetitionRank = lazy(
  () => import('@/views/Competition/Detail/Content/Rank/Rank')
)
const CompetitionRecord = lazy(
  () => import('@/views/Competition/Detail/Content/Record/Record')
)
const CompetitionCreate = lazy(
  () => import('@/views/Creation/CreateCompetition/Create')
)
const CompetitionCreateDeclare = lazy(
  () => import('@/views/Creation/CreateCompetition/Declare')
)
const CompetitionCreateCompetition = lazy(
  () => import('@/views/Creation/CreateCompetition/Competition')
)
const CompetitionCreateProblem = lazy(
  () => import('@/views/Creation/CreateCompetition/Problem')
)
const CompetitionRandom = lazy(
  () => import('@/views/Competition/CompetitionRandom/CompetitionRandom')
)
const Community = lazy(() => import('@/views/Community/CommunityRoot'))
const CommunityOverview = lazy(
  () => import('@/views/Community/Overview/CommunityOverview')
)
const ArticleSet = lazy(
  () => import('@/views/Community/Overview/RecommendSet/ArticleSet')
)
const CreationRoot = lazy(() => import('@/views/Creation/CreationRoot'))
const CreationNavgation = lazy(
  () => import('@/views/Creation/CreationNavgation')
)
const CreateArticle = lazy(() => import('@/views/Creation/CreateArticle'))
const CreateComment = lazy(() => import('@/views/Creation/CreateComment'))
const CreatePost = lazy(() => import('@/views/Creation/CreatePost'))
const CreateTopic = lazy(() => import('@/views/Creation/CreateTopic'))
const CreateForm = lazy(() => import('@/views/Creation/CreateForm'))
const ArticleDetail = lazy(() => import('@/views/Community/Article/Detail'))

export const lazyload = (Result: any) => {
  return (
    <Suspense fallback={<Loading></Loading>}>
      <Result></Result>
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      // home
      {
        path: 'home',
        element: lazyload(Home),
        errorElement: <ErrorPage />
      },
      // problem
      {
        path: 'problem',
        element: lazyload(ProblemRoot),
        children: [
          {
            path: 'set',
            element: lazyload(ProblemSetRoot),
            children: [
              {
                path: 'all',
                element: lazyload(PorblemAll)
              }
            ]
          },
          {
            path: ':id',
            element: lazyload(ProblemId),
            children: [
              {
                path: '',
                element: lazyload(ProblemDescription)
              },
              {
                path: 'records',
                element: lazyload(ProblemSubmitrecord)
              }
            ]
          }
        ]
      },
      // competition
      {
        path: 'competition',
        element: lazyload(Competition),
        children: [
          {
            path: 'list',
            element: lazyload(CompetitionList)
          },
          {
            path: ':competition_id',
            element: lazyload(CompetitionId),
            children: [
              {
                path: '',
                element: lazyload(CompetitionOverview)
              },
              {
                path: 'problem',
                element: lazyload(CompetitionProblem),
                children: [
                  {
                    path: '',
                    element: lazyload(CompetitionProblemList)
                  },
                  {
                    path: ':problem_id',
                    element: lazyload(CompetitionProblemId)
                  }
                ]
              },
              {
                path: 'rank',
                element: lazyload(CompetitionRank)
              },
              {
                path: 'record',
                element: lazyload(CompetitionRecord)
              }
            ]
          },

          {
            path: 'random/:competition_type',
            element: lazyload(CompetitionRandom)
          }
        ]
      },
      // community
      {
        path: 'community',
        element: lazyload(Community),
        children: [
          {
            path: 'overview',
            element: lazyload(CommunityOverview),
            children: [
              {
                path: 'articleset',
                element: lazyload(ArticleSet)
              }
            ]
          },
          {
            path: 'article',
            children: [
              {
                path: ':article_id',
                element: lazyload(ArticleDetail)
              }
            ]
          }
        ]
      },
      {
        path: 'creation',
        element: lazyload(CreationRoot),
        children: [
          {
            path: '',
            element: lazyload(CreationNavgation)
          },
          {
            path: 'article',
            element: lazyload(CreateArticle)
          },
          {
            path: 'comment',
            element: lazyload(CreateComment)
          },
          {
            path: 'post',
            element: lazyload(CreatePost)
          },
          {
            path: 'problem',
            element: lazyload(ProblemCreate)
          },
          {
            path: 'competition',
            element: lazyload(CompetitionCreate),
            children: [
              {
                path: '',
                element: lazyload(CompetitionCreateDeclare)
              },

              {
                path: 'competition',
                element: lazyload(CompetitionCreateCompetition)
              },
              {
                path: 'problem',
                element: lazyload(CompetitionCreateProblem)
              }
            ]
          },
          {
            path: 'topic',
            element: lazyload(CreateTopic)
          },
          {
            path: 'form',
            element: lazyload(CreateForm)
          }
        ]
      }
    ]
  }
])

export default router
