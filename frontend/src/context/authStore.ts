import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'tenant' | 'landlord' | 'admin' | 'manager'
  profilePicture?: string
  language: 'en' | 'sw'
  currentProperty?: any
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  checkAuth: () => Promise<void>
  setLanguage: (language: 'en' | 'sw') => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await api.post('/auth/login', { email, password })
          const { token, user } = response.data
          
          localStorage.setItem('token', token)
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          set({ user, token, isAuthenticated: true })
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Login failed')
        }
      },

      register: async (userData) => {
        try {
          const response = await api.post('/auth/register', userData)
          const { token, user } = response.data
          
          localStorage.setItem('token', token)
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          set({ user, token, isAuthenticated: true })
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Registration failed')
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateProfile: async (userData) => {
        try {
          const response = await api.put('/auth/profile', userData)
          set({ user: response.data.user })
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Update failed')
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        try {
          await api.put('/auth/change-password', { currentPassword, newPassword })
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Password change failed')
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token')
        
        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await api.get('/auth/me')
          set({ 
            user: response.data.user, 
            token, 
            isAuthenticated: true,
            isLoading: false 
          })
        } catch (error) {
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
          set({ 
            user: null, 
            token: null, 
            isAuthenticated: false,
            isLoading: false 
          })
        }
      },

      setLanguage: (language) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, language } })
          // Save to backend
          api.put('/auth/profile', { language }).catch(console.error)
        }
      },
    }),
    {
      name: 'manyani-auth',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
