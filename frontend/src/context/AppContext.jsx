import { createContext } from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider =(props) => {

    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors,setDoctors] = useState([])
    const [token,setToken] = useState('')
    const [userData,setUserData] = useState(null)
    const [userAppointments, setUserAppointments] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    const [rememberMe, setRememberMe] = useState(false)

    // Initialize app - check for existing token and load user data
    const initializeApp = async () => {
        try {
            // Check both localStorage and sessionStorage for tokens
            const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token')
            const savedRememberMe = localStorage.getItem('rememberMe') === 'true'
            
            setRememberMe(savedRememberMe)
            
            if (savedToken) {
                setToken(savedToken)
                // Validate token by fetching user profile
                const {data} = await axios.post(backendUrl + '/api/user/get-profile', {}, {headers: {token: savedToken}})
                if (data.success) {
                    setUserData(data.userData)
                } else {
                    // Token is invalid, clear it
                    clearAuthData()
                }
            }
        } catch (error) {
            console.log('Token validation failed:', error)
            clearAuthData()
        } finally {
            setIsLoading(false)
        }
    }

    // Clear all authentication data
    const clearAuthData = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('rememberMe')
        sessionStorage.removeItem('token')
        setToken('')
        setUserData(null)
        setRememberMe(false)
    }

    const getDoctorData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success){
                setDoctors(data.doctors)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error loading doctors:', error)
            toast.error(error.response?.data?.message || 'Failed to load doctors')
        }
    }

    // Register user function
    const registerUser = async (name, email, password, phone, remember = false) => {
        try {
            setIsLoading(true)
            const {data} = await axios.post(backendUrl + '/api/user/register', {name, email, password, phone})
            if (data.success) {
                setToken(data.token)
                setRememberMe(remember)
                
                // Store token based on remember me preference
                if (remember) {
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('rememberMe', 'true')
                } else {
                    sessionStorage.setItem('token', data.token)
                    localStorage.setItem('rememberMe', 'false')
                }
                
                // Immediately load user profile after registration
                await loadUserProfileData(data.token)
                toast.success('Account created successfully!')
                return { success: true }
            } else {
                toast.error(data.message)
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.error('Registration error:', error)
            toast.error(error.response?.data?.message || 'Registration failed')
            return { success: false, message: error.response?.data?.message || 'Registration failed' }
        } finally {
            setIsLoading(false)
        }
    }

    // Login user function
    const loginUser = async (email, password, remember = false) => {
        try {
            setIsLoading(true)
            const {data} = await axios.post(backendUrl + '/api/user/login', {email, password})
            if (data.success) {
                setToken(data.token)
                setRememberMe(remember)
                
                // Store token based on remember me preference
                if (remember) {
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('rememberMe', 'true')
                } else {
                    sessionStorage.setItem('token', data.token)
                    localStorage.setItem('rememberMe', 'false')
                }
                
                // Immediately load user profile after login
                await loadUserProfileData(data.token)
                toast.success('Login successful!')
                return { success: true }
            } else {
                toast.error(data.message)
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error(error.response?.data?.message || 'Login failed')
            return { success: false, message: error.response?.data?.message || 'Login failed' }
        } finally {
            setIsLoading(false)
        }
    }

    // Get user profile data
    const loadUserProfileData = async (userToken = null) => {
        try {
            const tokenToUse = userToken || token
            if (!tokenToUse) return
            
            const {data} = await axios.post(backendUrl + '/api/user/get-profile', {}, {headers: {token: tokenToUse}})
            if (data.success) {
                setUserData(data.userData)
                // Also load user appointments when profile is loaded
                if (tokenToUse === token) { // Only if using current token (not during login)
                    await getUserAppointments()
                }
                return data.userData
            } else {
                // Invalid token
                if (!userToken) { // Only clear if not passed explicitly (to avoid clearing during login/register)
                    clearAuthData()
                }
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Profile load error:', error)
            if (error.response?.status === 401 && !userToken) {
                // Unauthorized - token expired or invalid
                clearAuthData()
                toast.error('Session expired. Please login again.')
            } else {
                toast.error('Failed to load profile data')
            }
        }
    }

    // Update user profile
    const updateProfile = async (profileData) => {
        try {
            setIsLoading(true)
            const formData = new FormData()
            
            // Add text fields
            if (profileData.name) formData.append('name', profileData.name)
            if (profileData.phone) formData.append('phone', profileData.phone)
            if (profileData.dob) formData.append('dob', profileData.dob)
            if (profileData.gender) formData.append('gender', profileData.gender)
            if (profileData.address) formData.append('address', JSON.stringify(profileData.address))
            
            // Add image if provided
            if (profileData.image) {
                formData.append('image', profileData.image)
            }

            const {data} = await axios.post(backendUrl + '/api/user/update-profile', formData, {
                headers: {
                    token,
                    'Content-Type': 'multipart/form-data'
                }
            })
            
            if (data.success) {
                // Reload user profile to get updated data
                await loadUserProfileData()
                toast.success('Profile updated successfully!')
                return { success: true }
            } else {
                toast.error(data.message)
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.log('Profile update error:', error)
            toast.error(error.response?.data?.message || 'Failed to update profile')
            return { success: false, message: error.response?.data?.message || 'Failed to update profile' }
        } finally {
            setIsLoading(false)
        }
    }

    // Logout function
    const logout = () => {
        clearAuthData()
        toast.success('Logged out successfully!')
    }

    // Check if user is logged in
    const isLoggedIn = () => {
        return !!(token && userData)
    }

    // Refresh authentication token (if needed for long sessions)
    const refreshAuth = async () => {
        if (token) {
            try {
                await loadUserProfileData()
            } catch (error) {
                console.log('Auth refresh failed:', error)
                clearAuthData()
            }
        }
    }

    // Book appointment function
    const bookAppointment = async (docId, slotDate, slotTime) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', {
                docId,
                slotDate,
                slotTime
            }, {
                headers: { token }
            })

            if (data.success) {
                toast.success('Appointment booked successfully!')
                
                // Show WhatsApp notification status
                if (data.whatsappSent) {
                    toast.success('📱 WhatsApp notification sent to clinic!', { duration: 4000 });
                } else if (data.whatsappUrl) {
                    toast.info('📋 WhatsApp notification ready - check console', { duration: 3000 });
                }
                
                // Open WhatsApp with notification if URL is provided
                if (data.whatsappUrl) {
                    // Open WhatsApp in a new window/tab after a short delay
                    setTimeout(() => {
                        const confirmOpen = window.confirm(
                            '📱 Would you like to open WhatsApp to send the appointment confirmation to +919138136007?'
                        );
                        if (confirmOpen) {
                            window.open(data.whatsappUrl, '_blank');
                        }
                    }, 2000);
                }
                
                // Refresh user appointments
                await getUserAppointments()
                return { 
                    success: true, 
                    whatsappUrl: data.whatsappUrl,
                    whatsappSent: data.whatsappSent
                }
            } else {
                toast.error(data.message)
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.error('Booking error:', error)
            toast.error(error.response?.data?.message || 'Failed to book appointment')
            return { success: false, message: error.response?.data?.message || 'Failed to book appointment' }
        }
    }

    // Get user appointments
    const getUserAppointments = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/appointments', {}, {
                headers: { token }
            })

            if (data.success) {
                setUserAppointments(data.appointments)
                return data.appointments
            } else {
                toast.error(data.message)
                setUserAppointments([])
                return []
            }
        } catch (error) {
            console.error('Get appointments error:', error)
            toast.error('Failed to load appointments')
            setUserAppointments([])
            return []
        }
    }

    // Cancel appointment function
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', {
                appointmentId
            }, {
                headers: { token }
            })

            if (data.success) {
                toast.success('Appointment cancelled successfully!')
                // Refresh appointments after cancellation
                await getUserAppointments()
                return { success: true }
            } else {
                toast.error(data.message)
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.error('Cancel appointment error:', error)
            toast.error(error.response?.data?.message || 'Failed to cancel appointment')
            return { success: false, message: error.response?.data?.message || 'Failed to cancel appointment' }
        }
    }

    // Reschedule appointment function
    const rescheduleAppointment = async (appointmentId, slotDate, slotTime) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/reschedule-appointment', {
                appointmentId,
                slotDate,
                slotTime
            }, {
                headers: { token }
            })

            if (data.success) {
                toast.success(data.message)
                // Refresh appointments after rescheduling
                await getUserAppointments()
                return { success: true, message: data.message }
            } else {
                toast.error(data.message)
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.error('Reschedule appointment error:', error)
            toast.error(error.response?.data?.message || 'Failed to reschedule appointment')
            return { success: false, message: error.response?.data?.message || 'Failed to reschedule appointment' }
        }
    }

    // Razorpay payment function
    const paymentRazorpay = async (appointmentId) => {
        try {
            console.log('AppContext: Initiating payment for appointment ID:', appointmentId)
            console.log('Backend URL:', backendUrl)
            console.log('Token:', token ? 'Present' : 'Missing')
            
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', {
                appointmentId
            }, {
                headers: { token }
            })

            console.log('AppContext: Payment response:', data)

            if (data.success) {
                return { success: true, order: data.order }
            } else {
                console.error('AppContext: Payment failed:', data.message)
                toast.error(data.message)
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.error('AppContext: Payment error:', error)
            console.error('AppContext: Error response:', error.response?.data)
            toast.error(error.response?.data?.message || 'Payment failed')
            return { success: false, message: error.response?.data?.message || 'Payment failed' }
        }
    }

    // Verify Razorpay payment
    const verifyRazorpay = async (razorpay_order_id) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/verify-razorpay', {
                razorpay_order_id
            }, {
                headers: { token }
            })

            if (data.success) {
                toast.success('Payment successful!')
                // Refresh appointments after payment
                await getUserAppointments()
                return { success: true }
            } else {
                toast.error(data.message)
                return { success: false, message: data.message }
            }
        } catch (error) {
            console.error('Payment verification error:', error)
            toast.error(error.response?.data?.message || 'Payment verification failed')
            return { success: false, message: error.response?.data?.message || 'Payment verification failed' }
        }
    }

    const value = {
        doctors,
        currencySymbol,
        backendUrl,
        getDoctorData,
        token,
        setToken,
        userData,
        setUserData,
        userAppointments,
        registerUser,
        loginUser,
        loadUserProfileData,
        updateProfile,
        logout,
        isLoggedIn,
        isLoading,
        rememberMe,
        refreshAuth,
        bookAppointment,
        getUserAppointments,
        cancelAppointment,
        rescheduleAppointment,
        paymentRazorpay,
        verifyRazorpay
    }

    // Initialize app on mount
    useEffect(() => {
        initializeApp()
    }, [])

    // Load doctors data once
    useEffect(() => {
        getDoctorData()
    }, [])

    // Auto-refresh user profile every 5 minutes if logged in
    useEffect(() => {
        if (token && userData) {
            const interval = setInterval(() => {
                loadUserProfileData()
            }, 5 * 60 * 1000) // 5 minutes

            return () => clearInterval(interval)
        }
    }, [token, userData])

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider