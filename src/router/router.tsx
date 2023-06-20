import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '@/components/error-page'
import { Suspense, lazy } from 'react'
import Loading from '@/components/Loading/Loading'
import Root from '@/views/Root'

const Home = lazy(() => import('@/views/Home/Root'))
const Problem = lazy(() => import('@/views/Problem/Root'))
const ProblemList = lazy(() => import('@/views/Problem/List/List'))
const ProblemId = lazy(() => import('@/views/Problem/Detail/Detail'))
const ProblemDescription = lazy(
  () => import('@/views/Problem/Detail/Description')
)
const ProblemSubmitrecord = lazy(
  () => import('@/views/Problem/Detail/Record/SubmitRecords')
)
const ProblemCreate = lazy(() => import('@/views/Problem/Create/Create'))
const Competition = lazy(() => import('@/views/Competition/Root'))
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
  () => import('@/views/Competition/Create/Create')
)
const CompetitionCreateDeclare = lazy(
  () => import('@/views/Competition/Create/Declare')
)
const CompetitionCreateCompetition = lazy(
  () => import('@/views/Competition/Create/Competition')
)
const CompetitionCreateProblem = lazy(
  () => import('@/views/Competition/Create/Problem')
)
const CompetitionRandom = lazy(
  () => import('@/views/Competition/CompetitionRandom/CompetitionRandom')
)

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
      {
        path: 'home',
        element: lazyload(Home),
        errorElement: <ErrorPage />
      },
      {
        path: 'problem',
        element: lazyload(Problem),
        children: [
          {
            path: 'list',
            element: lazyload(ProblemList)
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
                path: 'submit-records',
                element: lazyload(ProblemSubmitrecord)
              }
            ]
          },
          {
            path: 'create',
            element: lazyload(ProblemCreate)
          }
        ]
      },
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
            path: 'create',
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
            path: 'random/:competition_type',
            element: lazyload(CompetitionRandom)
          }
        ]
      }
    ]
  }
])

export default router
