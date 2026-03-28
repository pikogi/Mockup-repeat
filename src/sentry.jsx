import * as Sentry from '@sentry/react'

const dsn = import.meta.env.VITE_SENTRY_DSN

function deriveEnvironment() {
  const apiUrl = import.meta.env.VITE_API_URL || ''
  if (apiUrl.includes('-dev') || import.meta.env.DEV) return 'dev'
  if (apiUrl.includes('-stg')) return 'stg'
  return 'prod'
}

Sentry.init({
  dsn,
  environment: deriveEnvironment(),
  enabled: !!dsn,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

export function SentryErrorBoundary({ children }) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-950 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Algo salió mal</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            Ocurrió un error inesperado. Por favor, intenta recargar la página.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-colors"
            >
              Recargar página
            </button>
            <button
              onClick={resetError}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
          {import.meta.env.DEV && error && (
            <pre className="mt-6 p-4 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-lg text-left text-sm max-w-2xl overflow-auto">
              {error.toString()}
            </pre>
          )}
        </div>
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}
