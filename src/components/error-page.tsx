import { useRouteError } from 'react-router-dom'

import React from 'react'

export default function ErrorPage() {
  const error: any = useRouteError()
  console.log(error)
  return (
    <div
      id="error-page"
      className="h-full w-full flex flex-col justify-center items-center"
    >
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}
