import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)
    const [refreshInterval, setRefreshInterval] = useState(null)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // Doctor Login
    const loginDoctor = async (email, password) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
            if (data.success) {
                localStorage.setItem('dToken', data.token)
                setDToken(data.token)
                return { success: true }
            } else {
                return { success: false, message: data.message }
            }
        } catch (error) {
            return { success: false, message: error.message }
        }
    }

    // Get Doctor Appointments
    const getAppointments = async () => {
        try {
            if (!dToken) {
                console.log('No doctor token available')
                return
            }
            
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { 
                headers: { dtoken: dToken } 
            })
            
            if (data.success) {
                console.log('Fetched appointments:', data.appointments?.length || 0)
                setAppointments(data.appointments ? data.appointments.reverse() : [])
            } else {
                console.error('Failed to fetch appointments:', data.message)
                // Skip showing "Not Authorized Login Again" popup
                if (data.message !== 'Not Authorized Login Again') {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.error('Error fetching appointments:', error)
            // Skip showing authorization related errors
            if (!error.message?.includes('Authorized') && !error.message?.includes('Login')) {
                toast.error('Failed to fetch appointments')
            }
        }
    }

    // Complete Appointment
    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dtoken: dToken } })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // Refresh dashboard data if available
                if (dashData) {
                    getDashData()
                }
            } else {
                // Skip showing "Not Authorized Login Again" popup
                if (data.message !== 'Not Authorized Login Again') {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.log(error)
            // Skip showing authorization related errors
            if (!error.message?.includes('Authorized') && !error.message?.includes('Login')) {
                toast.error(error.message)
            }
        }
    }

    // Cancel Appointment
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dtoken: dToken } })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // Refresh dashboard data if available
                if (dashData) {
                    getDashData()
                }
            } else {
                // Skip showing "Not Authorized Login Again" popup
                if (data.message !== 'Not Authorized Login Again') {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.log(error)
            // Skip showing authorization related errors
            if (!error.message?.includes('Authorized') && !error.message?.includes('Login')) {
                toast.error(error.message)
            }
        }
    }

    // Get Dashboard Data
    const getDashData = async () => {
        try {
            if (!dToken) {
                console.log('No doctor token available for dashboard')
                return
            }
            
            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { 
                headers: { dtoken: dToken } 
            })
            
            if (data.success) {
                console.log('Dashboard data fetched successfully')
                setDashData(data.dashData)
            } else {
                console.error('Failed to fetch dashboard data:', data.message)
                // Skip showing "Not Authorized Login Again" popup
                if (data.message !== 'Not Authorized Login Again') {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            // Skip showing authorization related errors
            if (!error.message?.includes('Authorized') && !error.message?.includes('Login')) {
                toast.error('Failed to fetch dashboard data')
            }
        }
    }

    // Start auto-refresh for appointments and dashboard
    const startAutoRefresh = () => {
        if (refreshInterval) {
            clearInterval(refreshInterval)
        }
        
        const interval = setInterval(() => {
            if (dToken) {
                getAppointments()
                getDashData()
            }
        }, 30000) // Refresh every 30 seconds
        
        setRefreshInterval(interval)
        console.log('Auto-refresh started')
    }

    // Stop auto-refresh
    const stopAutoRefresh = () => {
        if (refreshInterval) {
            clearInterval(refreshInterval)
            setRefreshInterval(null)
            console.log('Auto-refresh stopped')
        }
    }

    // Auto-refresh effect
    useEffect(() => {
        if (dToken) {
            // Initial data fetch
            getAppointments()
            getDashData()
            // Start auto-refresh
            startAutoRefresh()
        } else {
            stopAutoRefresh()
        }

        // Cleanup on unmount or token change
        return () => {
            stopAutoRefresh()
        }
    }, [dToken])

    // Get Profile Data
    const getProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dtoken: dToken } })
            if (data.success) {
                setProfileData(data.profileData)
            }
        } catch (error) {
            console.log(error)
            // Skip showing authorization related errors
            if (!error.message?.includes('Authorized') && !error.message?.includes('Login')) {
                toast.error(error.message)
            }
        }
    }

    // Update Profile with real-time synchronization
    const updateProfile = async (profileUpdate) => {
        try {
            console.log('Updating profile with backend connectivity...')
            
            // Use FormData for proper file upload handling
            const formData = new FormData()
            
            // Append all profile data
            Object.keys(profileUpdate).forEach(key => {
                if (profileUpdate[key] !== null && profileUpdate[key] !== undefined) {
                    if (key === 'address' && typeof profileUpdate[key] === 'object') {
                        formData.append(key, JSON.stringify(profileUpdate[key]))
                    } else {
                        formData.append(key, profileUpdate[key])
                    }
                }
            })

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', formData, { 
                headers: { 
                    dtoken: dToken,
                    'Content-Type': 'multipart/form-data'
                } 
            })
            
            if (data.success) {
                toast.success(data.message || 'Profile updated successfully!')
                // Refresh profile data to sync with backend
                await getProfileData()
                
                // Signal admin panel to refresh
                try {
                    const now = new Date().toISOString()
                    localStorage.setItem('doctorProfileUpdated', now)
                    console.log('Doctor profile update signal sent to admin panel')
                } catch (error) {
                    console.log('Could not send update signal to admin:', error)
                }
                
                return true
            } else {
                // Skip showing "Not Authorized Login Again" popup
                if (data.message !== 'Not Authorized Login Again') {
                    toast.error(data.message || 'Failed to update profile')
                }
                return false
            }
        } catch (error) {
            console.error('Profile update error:', error)
            // Skip showing authorization related errors
            if (!error.message?.includes('Authorized') && !error.message?.includes('Login')) {
                toast.error('Network error. Please check your connection and try again.')
            }
            return false
        }
    }

    const value = {
        dToken, 
        setDToken,
        backendUrl,
        appointments,
        setAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        dashData,
        getDashData,
        profileData,
        setProfileData,
        getProfileData,
        updateProfile,
        loginDoctor,
        startAutoRefresh,
        stopAutoRefresh
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider