import  { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Login = () => {
  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const navigate = useNavigate()

  // Validation function
  const validateForm = () => {
    const newErrors = {}

    // Name validation (only for Sign Up)
    if (state === 'Sign Up' && !name.trim()) {
      newErrors.name = 'Name is required'
    } else if (state === 'Sign Up' && name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (state === 'Sign Up') {
        // Handle sign up
        alert(`Welcome ${name}! Your account has been created successfully.`)
        // Store user data in localStorage (in real app, you'd get this from API)
        localStorage.setItem('user', JSON.stringify({
          name: name,
          email: email,
          isLoggedIn: true
        }))
      } else {
        // Handle login
        alert('Login successful! Welcome back.')
        // Store user data in localStorage (in real app, you'd get this from API)
        localStorage.setItem('user', JSON.stringify({
          email: email,
          isLoggedIn: true
        }))
      }
      
      // Navigate to home page
      navigate('/')
      
    } catch (error) {
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    alert('Google login integration coming soon!')
  }

  const handleForgotPassword = () => {
    if (!email.trim()) {
      alert('Please enter your email address first')
      return
    }
    alert(`Password reset link has been sent to ${email}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img 
            className="mx-auto h-16 w-auto" 
            src={assets.logo} 
            alt="MyPhysioFriend" 
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {state === 'Sign Up' ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {state === 'Sign Up' 
              ? 'Join MyPhysioFriend for better healthcare' 
              : 'Welcome back to MyPhysioFriend'
            }
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={onSubmitHandler}>
          <div className="space-y-4">
            {/* Name Field (only for Sign Up) */}
            {state === 'Sign Up' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`appearance-none relative block w-full px-4 py-3 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none relative block w-full px-4 py-3 pr-12 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-600 text-sm">
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          {state === 'Login' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-medium text-primary hover:text-primary/80 transition-colors duration-300"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          )}

          {/* Terms & Conditions (for Sign Up) */}
          {state === 'Sign Up' && (
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="text-primary hover:text-primary/80 font-medium">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:text-primary/80 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary/90 hover:scale-105'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {state === 'Sign Up' ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                state === 'Sign Up' ? 'Create Account' : 'Sign In'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
            >
              <span className="mr-2">🔍</span>
              Continue with Google
            </button>
          </div>

          {/* Toggle between Login/Sign Up */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {state === 'Sign Up' 
                ? 'Already have an account?' 
                : "Don't have an account?"
              }{' '}
              <button
                type="button"
                onClick={() => {
                  setState(state === 'Sign Up' ? 'Login' : 'Sign Up')
                  setErrors({})
                  setName('')
                  setEmail('')
                  setPassword('')
                }}
                className="font-medium text-primary hover:text-primary/80 transition-colors duration-300"
              >
                {state === 'Sign Up' ? 'Sign in here' : 'Create account here'}
              </button>
            </p>
          </div>
        </form>

        {/* Features */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="text-sm font-medium text-gray-900">Secure</h3>
              <p className="text-xs text-gray-600">Your data is protected</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-sm font-medium text-gray-900">Fast</h3>
              <p className="text-xs text-gray-600">Quick appointment booking</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🏥</div>
              <h3 className="text-sm font-medium text-gray-900">Trusted</h3>
              <p className="text-xs text-gray-600">Verified healthcare providers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
