import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Eye, EyeOff, Lock, Mail, Home } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../context/authStore'

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

type LoginFormData = yup.InferType<typeof schema>

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      await login(data.email, data.password)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-manyani-brown/10 via-manyani-green/10 to-manyani-maroon/10 p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-manyani-brown rounded-2xl flex items-center justify-center shadow-manyani-lg">
              <Home className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Manyani
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Premium Rental Management System
          </p>
        </div>

        {/* Login card */}
        <div className="card animate-slide-up">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sign In
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-manyani-brown focus:ring-manyani-brown border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-manyani-brown hover:text-manyani-brown/80 font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base font-medium"
            >
              {isLoading ? (
                <>
                  <div className="loader h-5 w-5 border-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Social login */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Google
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Microsoft
            </button>
          </div>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-manyani-brown hover:text-manyani-brown/80"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>

        {/* Features preview */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-manyani-brown/5">
            <div className="w-8 h-8 bg-manyani-brown rounded-full flex items-center justify-center mx-auto mb-2">
              <Home className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Property Management
            </p>
          </div>
          <div className="p-3 rounded-lg bg-manyani-green/5">
            <div className="w-8 h-8 bg-manyani-green rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Secure Payments
            </p>
          </div>
          <div className="p-3 rounded-lg bg-manyani-maroon/5">
            <div className="w-8 h-8 bg-manyani-maroon rounded-full flex items-center justify-center mx-auto mb-2">
              <Eye className="h-4 w-4 text-white" />
            </div>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Real-time Alerts
            </p>
          </div>
        </div>

        {/* Language selector */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2">
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              English
            </button>
            <span className="text-gray-400">|</span>
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Kiswahili
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
