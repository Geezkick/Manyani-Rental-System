import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Eye, EyeOff, User, Mail, Phone, Lock, Home, Calendar, Car } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../context/authStore'

// Simplified schema without nationalIdPhoto requirement
const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  nationalId: yup.string().required('National ID is required'),
  dateOfBirth: yup.date().required('Date of birth is required'),
  gender: yup.string().oneOf(['male', 'female', 'other']).required('Gender is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
})

type RegisterFormData = yup.InferType<typeof schema>

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { register: registerUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      // Format date for backend
      const userData = {
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString().split('T')[0]
      }
      await registerUser(userData)
      toast.success('Registration successful!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-manyani-brown/10 via-manyani-green/10 to-manyani-maroon/10 p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-manyani-brown rounded-2xl flex items-center justify-center shadow-manyani-lg">
              <Home className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Join Manyani Rentals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create your account to manage properties, payments, and more
          </p>
        </div>

        {/* Registration card */}
        <div className="card animate-slide-up">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register('firstName')}
                      className="input-field pl-10"
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register('lastName')}
                      className="input-field pl-10"
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

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

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="input-field pl-10"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* National ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    National ID
                  </label>
                  <input
                    type="text"
                    {...register('nationalId')}
                    className="input-field"
                    placeholder="12345678"
                  />
                  {errors.nationalId && (
                    <p className="mt-1 text-sm text-red-600">{errors.nationalId.message}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      {...register('dateOfBirth')}
                      className="input-field pl-10"
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    {...register('gender')}
                    className="input-field"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="tenant"
                        defaultChecked
                        className="h-4 w-4 text-manyani-brown focus:ring-manyani-brown border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Tenant</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="landlord"
                        className="h-4 w-4 text-manyani-brown focus:ring-manyani-brown border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Landlord</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Security Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      className="input-field pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-manyani-brown focus:ring-manyani-brown border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <a href="#" className="text-manyani-brown hover:text-manyani-brown/80 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-manyani-brown hover:text-manyani-brown/80 font-medium">
                  Privacy Policy
                </a>
              </label>
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-manyani-brown hover:text-manyani-brown/80"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow-manyani">
            <div className="w-12 h-12 bg-manyani-brown rounded-full flex items-center justify-center mx-auto mb-3">
              <Home className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              Property Management
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              List, manage, and track your properties
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow-manyani">
            <div className="w-12 h-12 bg-manyani-green rounded-full flex items-center justify-center mx-auto mb-3">
              <Car className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              Vehicle Registration
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Register vehicles for parking allocation
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow-manyani">
            <div className="w-12 h-12 bg-manyani-maroon rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
              Secure Payments
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              M-Pesa integration for safe transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
