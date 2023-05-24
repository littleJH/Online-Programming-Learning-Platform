import { createBrowserRouter, Link, Navigate, NavLink } from 'react-router-dom'
import ErrorPage from '../components/error-page'
import { Suspense, lazy } from 'react'
import Loading from '@/components/Loading/Loading'
import Answer from '@/components/Competition/Detail/Content/Problem/Answer/Answer'
import App from '../App'

export const lazyload = (path: string, to: string) => {
  // const token: string = localStorage.getItem('token') as string
  // if (!token && to !== '/login' && to !== '/register') {
  //   return <Navigate to={'/login'}></Navigate>
  // } else {
  const Result = lazy(() => import(path))
  return (
    <Suspense fallback={<Loading></Loading>}>
      <Result></Result>
    </Suspense>
  )
  // }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'home',
        element: lazyload('../components/Homepage/Homepage.tsx', ''),
        errorElement: <ErrorPage />
      },
      {
        path: 'problem',
        element: lazyload('../components/Problem/Root.tsx', ''),
        children: [
          {
            path: 'list',
            element: lazyload('../components/Problem/List/List.tsx', '')
          },
          {
            path: ':id',
            element: lazyload('../components/Problem/Detail/Detail.tsx', ''),
            children: [
              {
                path: '',
                element: lazyload(
                  '../components/Problem/Detail/Description.tsx',
                  ''
                )
              },
              {
                path: 'submit-records',
                element: lazyload(
                  '../components/Problem/Detail/Record/SubmitRecords.tsx',
                  ''
                )
              }
            ]
          },
          {
            path: 'create',
            element: lazyload(
              '../components/Problem/Create/Create.tsx',
              '/problem'
            )
          }
        ]
      },
      {
        path: 'competition',
        element: lazyload('../components/Competition/Competition.tsx', ''),
        children: [
          {
            path: 'list',
            element: lazyload('../components/Competition/List/List.tsx', '')
          },
          {
            path: ':competition_id',
            element: lazyload(
              '../components/Competition/Detail//Detail/Detail.tsx',
              ''
            ),
            children: [
              {
                path: '',
                element: lazyload(
                  '../components/Competition/Detail/Content/Overview.tsx',
                  ''
                )
              },
              {
                path: 'problem',
                element: lazyload(
                  '../components/Competition/Detail/Content/Problem/Problem.tsx',
                  ''
                ),
                children: [
                  {
                    path: '',
                    element: lazyload(
                      '../components/Competition/Detail/Content/Problem/List/List.tsx',
                      ''
                    )
                  },
                  {
                    path: ':problem_id',
                    element: lazyload(
                      '../components/Competition/Detail/Content/Problem/Answer/Answer.tsx',
                      ''
                    )
                  }
                ]
              },
              {
                path: 'rank',
                element: lazyload(
                  '../components/Competition/Detail/Content/Rank/Rank.tsx',
                  ''
                )
              },
              {
                path: 'record',
                element: lazyload(
                  '../components/Competition/Detail/Content/Record/Record.tsx',
                  ''
                )
              }
            ]
          },
          {
            path: 'create',
            element: lazyload(
              '../components/Competition/Create/Create.tsx',
              ''
            ),
            children: [
              {
                path: '',
                element: lazyload(
                  '../components/Competition/Create/Declare.tsx',
                  ''
                )
              },

              {
                path: 'competition',
                element: lazyload(
                  '../components/Competition/Create/Competition.tsx',
                  ''
                )
              },
              {
                path: 'problem',
                element: lazyload(
                  '../components/Competition/Create/Problem.tsx',
                  ''
                )
              }
            ]
          },
          {
            path: 'random/:competition_type',
            element: lazyload(
              '../components/Competition/CompetitionRandom/CompetitionRandom.tsx',
              ''
            )
          }
        ]
      }
    ]
  }
])

export default router
