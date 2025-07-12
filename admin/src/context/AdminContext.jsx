import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [lastUpdated, setLastUpdated] = useState(new Date())

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
                setLastUpdated(new Date())
                console.log('Admin: Doctors list refreshed')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error fetching doctors:', error)
            toast.error('Failed to fetch doctors')
        }
    }

    // Enhanced refresh function for real-time sync
    const refreshDoctors = async () => {
        console.log('Admin: Manual refresh of doctors triggered')
        await getAllDoctors()
    }

    // Listen for doctor profile updates from doctor panel
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'doctorProfileUpdated') {
                console.log('Admin: Doctor profile update detected, refreshing doctors list')
                getAllDoctors()
                toast.info('Doctor profile updated - refreshing list')
            }
        }

        // Listen for localStorage changes (from doctor panel)
        window.addEventListener('storage', handleStorageChange)
        
        // Also check for updates periodically
        const checkForUpdates = () => {
            const lastUpdate = localStorage.getItem('doctorProfileUpdated')
            if (lastUpdate) {
                const updateTime = new Date(lastUpdate)
                const now = new Date()
                const timeDiff = now - updateTime
                
                // If update was within last 5 seconds, refresh
                if (timeDiff < 5000 && timeDiff > 0) {
                    console.log('Admin: Recent doctor profile update detected')
                    getAllDoctors()
                    localStorage.removeItem('doctorProfileUpdated') // Clear the signal
                }
            }
        }

        const updateCheckInterval = setInterval(checkForUpdates, 2000)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            clearInterval(updateCheckInterval)
        }
    }, [aToken])

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error changing availability:', error)
            toast.error('Failed to change availability')
        }
    }

    const addDoctor = async (doctorData) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', doctorData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.error('Error adding doctor:', error)
            toast.error('Failed to add doctor')
            return false
        }
    }

    const deleteDoctor = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/delete-doctor', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.error('Error deleting doctor:', error)
            toast.error('Failed to delete doctor')
            return false
        }
    }

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/appointments', {}, { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error fetching appointments:', error)
            toast.error('Failed to fetch appointments')
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error)
            toast.error('Failed to cancel appointment')
            return false
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/complete-appointment', { appointmentId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.error('Error completing appointment:', error)
            toast.error('Failed to complete appointment')
            return false
        }
    }

    const updateDoctor = async (docId, doctorData) => {
        try {
            const formData = new FormData()
            
            // Add docId
            formData.append('docId', docId)
            
            // Add other fields
            if (doctorData.name) formData.append('name', doctorData.name)
            if (doctorData.email) formData.append('email', doctorData.email)
            if (doctorData.phone) formData.append('phone', doctorData.phone)
            if (doctorData.speciality) formData.append('speciality', doctorData.speciality)
            if (doctorData.degree) formData.append('degree', doctorData.degree)
            if (doctorData.experience) formData.append('experience', doctorData.experience)
            if (doctorData.about) formData.append('about', doctorData.about)
            if (doctorData.fees) formData.append('fees', doctorData.fees)
            if (doctorData.address) formData.append('address', JSON.stringify(doctorData.address))
            if (typeof doctorData.available !== 'undefined') formData.append('available', doctorData.available)
            if (doctorData.image) formData.append('image', doctorData.image)

            const { data } = await axios.post(backendUrl + '/api/admin/update-doctor', formData, { 
                headers: { 
                    aToken,
                    'Content-Type': 'multipart/form-data'
                } 
            })
            
            if (data.success) {
                toast.success(data.message)
                console.log('Admin: Doctor updated successfully, refreshing doctor list')
                // Update the specific doctor in the doctors array
                if (data.doctor) {
                    setDoctors(prevDoctors => 
                        prevDoctors.map(doc => 
                            doc._id === docId ? data.doctor : doc
                        )
                    )
                    setLastUpdated(new Date())
                } else {
                    await getAllDoctors() // Fallback to refresh all doctors
                }
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.error('Error updating doctor:', error)
            toast.error('Failed to update doctor profile')
            return false
        }
    }

    const value = {
        aToken,
        setAToken,
        backendUrl,
        doctors,
        setDoctors,
        appointments,
        setAppointments,
        getAllDoctors,
        refreshDoctors,
        changeAvailability,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        getAllAppointments,
        cancelAppointment,
        completeAppointment,
        lastUpdated
    }
    
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider