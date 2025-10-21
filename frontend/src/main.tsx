import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize MSW if mock API is enabled
const useMockAPI = import.meta.env.VITE_USE_MOCK_API === 'true'

async function enableMocking() {
  if (!useMockAPI) {
    return
  }

  const { worker } = await import('./mocks/browser')

  // Start MSW in development
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
  })
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )

  // Log mock API status
  if (useMockAPI) {
    console.log('🎭 Mock API enabled - using MSW for API calls')
    console.log('💡 To use real API, set VITE_USE_MOCK_API=false in .env')
  }
})
