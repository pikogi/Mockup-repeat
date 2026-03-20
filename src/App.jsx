import './App.css'
import Pages from '@/pages/index.jsx'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'

// Crear una instancia de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      staleTime: 5 * 60 * 1000,
    },
  },
})

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" storageKey="repeat-theme">
      <QueryClientProvider client={queryClient}>
        <Pages />
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
