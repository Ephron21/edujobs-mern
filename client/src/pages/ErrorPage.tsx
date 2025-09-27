import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong'
  const message = isRouteErrorResponse(error)
    ? (error.data as any)?.message || 'The page you requested was not found.'
    : (error as any)?.message || 'Please try again.'

  return (
    <div className="max-w-xl mx-auto text-center py-16">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 mb-6">{message}</p>
      <Link to="/" className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white">
        Go Home
      </Link>
    </div>
  )
}