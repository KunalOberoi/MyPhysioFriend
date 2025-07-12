import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const DoctorProfile = () => {

  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Speciality options
  const specialityOptions = [
    'Cardio Respiratory Physiotherapist',
    'Ortho Physiotherapist', 
    'Neuro Physiotherapist',
    'Geriatric Physiotherapist',
    'Pre And Post Surgery Rehabilitation',
    'Pediatric Physiotherapist'
  ]

  // Experience options
  const experienceOptions = [
    '1 Year', '2 Years', '3 Years', '4 Years', '5 Years',
    '6 Years', '7 Years', '8 Years', '9 Years', '10 Years'
  ]

  // Initialize form data when profileData is loaded
  useEffect(() => {
    if (profileData) {
      setConnectionStatus('connected')
      setLastUpdated(new Date())
    }
  }, [profileData])

  // Check backend connection
  const checkConnection = async () => {
    try {
      setConnectionStatus('checking')
      const response = await fetch(backendUrl + '/api/doctor/profile', {
        headers: { dtoken: dToken }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setConnectionStatus('connected')
          toast.success('Successfully connected to server')
        } else {
          setConnectionStatus('error')
          // Skip showing "Not Authorized Login Again" popup
          if (data.message !== 'Not Authorized Login Again') {
            toast.error('Failed to connect to server')
          }
        }
      } else {
        setConnectionStatus('error')
        toast.error('Failed to connect to server')
      }
    } catch (error) {
      setConnectionStatus('error')
      // Skip showing authorization related errors
      if (!error.message?.includes('Authorized') && !error.message?.includes('Login')) {
        toast.error('Network connection error')
      }
    }
  }

  // Load profile data on component mount
  useEffect(() => {
    if (dToken) {
      setIsLoading(true)
      getProfileData().finally(() => {
        setIsLoading(false)
        setLastUpdated(new Date())
      })
    }
  }, [dToken])

  return profileData && (
    <div className='m-5'>
      <div className='flex items-center justify-between mb-3'>
        <p className='text-lg font-medium'>Doctor Profile</p>
        <div className='flex items-center gap-4'>
          {/* Last Updated Info */}
          <div className='text-sm text-gray-500'>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          
          {/* Connection Status */}
          <div className='flex items-center gap-2'>
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' : 
              connectionStatus === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className={`text-sm font-medium ${
              connectionStatus === 'connected' ? 'text-green-600' : 
              connectionStatus === 'checking' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {connectionStatus === 'connected' ? 'Connected' : 
               connectionStatus === 'checking' ? 'Connecting...' : 'Connection Error'}
            </span>
            {connectionStatus === 'error' && (
              <button 
                onClick={checkConnection}
                className='text-blue-600 hover:text-blue-800 text-sm underline'
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
      
      {isLoading && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4'>
          <div className='flex items-center gap-3'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600'></div>
            <span className='text-blue-700'>Loading profile data...</span>
          </div>
        </div>
      )}
      
      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        
        {/* Profile Image Section */}
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <img className='w-16 bg-gray-100 rounded-full' src={profileData.image} alt="" />
          <div>
            <p className='text-xl font-medium text-gray-700'>{profileData.name}</p>
            <p className='text-sm text-gray-500'>{profileData.speciality}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            {/* Name */}
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor name</p>
              <p className='border rounded px-3 py-2 bg-gray-50'>{profileData.name}</p>
            </div>

            {/* Email */}
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <p className='border rounded px-3 py-2 bg-gray-50'>{profileData.email}</p>
            </div>

            {/* Phone */}
            <div className='flex-1 flex flex-col gap-1'>
              <p>Phone Number</p>
              <p className='border rounded px-3 py-2 bg-gray-50'>{profileData.phone || 'Not provided'}</p>
            </div>

            {/* Experience */}
            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <p className='border rounded px-3 py-2 bg-gray-50'>{profileData.experience}</p>
            </div>

            {/* Fees */}
            <div className='flex-1 flex flex-col gap-1'>
              <p>Fees</p>
              <p className='border rounded px-3 py-2 bg-gray-50'>${profileData.fees}</p>
            </div>

          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            {/* Speciality */}
            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <p className='border rounded px-3 py-2 bg-gray-50'>{profileData.speciality}</p>
            </div>

            {/* Education */}
            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <p className='border rounded px-3 py-2 bg-gray-50'>{profileData.degree}</p>
            </div>

            {/* Address */}
            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <div className='border rounded px-3 py-2 bg-gray-50'>
                <p>{profileData.address?.line1}</p>
                <p>{profileData.address?.line2}</p>
              </div>
            </div>

            {/* Availability */}
            <div className='flex-1 flex flex-col gap-1'>
              <p>Availability Status</p>
              <div className='flex items-center gap-2'>
                <input 
                  checked={profileData.available} 
                  type="checkbox" 
                  className='w-4 h-4' 
                  disabled
                />
                <label className={`${profileData.available ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {profileData.available ? 'Available for appointments' : 'Currently unavailable'}
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* About Section */}
        <div className='mt-6 w-full'>
          <p className='text-gray-600 mb-2'>About Doctor</p>
          <div className='w-full px-4 py-2 border rounded bg-gray-50 min-h-[120px]'>
            <p className='text-gray-700'>{profileData.about}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DoctorProfile
