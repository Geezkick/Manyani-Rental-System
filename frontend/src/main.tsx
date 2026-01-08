import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-hot-toast'
import { IntlProvider } from 'react-intl'
import App from './App'
import './styles/globals.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Messages for localization
const messages = {
  en: {
    welcome: 'Welcome',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    properties: 'Properties',
    bookings: 'Bookings',
    payments: 'Payments',
    alerts: 'Alerts',
    profile: 'Profile',
    logout: 'Logout',
    // Add more translations as needed
  },
  sw: {
    welcome: 'Karibu',
    login: 'Ingia',
    register: 'Jisajili',
    dashboard: 'Dashibodi',
    properties: 'Mali',
    bookings: 'Hifadhi',
    payments: 'Malipo',
    alerts: 'Tahadhari',
    profile: 'Wasifu',
    logout: 'Toka',
    // Add more translations as needed
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="en" messages={messages.en}>
          <BrowserRouter>
            <App />
            <ToastContainer 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#8B4513',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#2E8B57',
                  },
                },
                error: {
                  style: {
                    background: '#8B0000',
                  },
                },
              }}
            />
          </BrowserRouter>
        </IntlProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
