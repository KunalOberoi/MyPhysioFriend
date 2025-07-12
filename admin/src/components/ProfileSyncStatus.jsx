import React, { useState, useEffect } from 'react'

const ProfileSyncStatus = () => {
  const [syncStatus, setSyncStatus] = useState('idle')
  const [lastSync, setLastSync] = useState(null)

  useEffect(() => {
    const checkSyncStatus = () => {
      const lastUpdate = localStorage.getItem('doctorProfileUpdated')
      if (lastUpdate) {
        setLastSync(new Date(lastUpdate))
        setSyncStatus('synced')
        
        // Clear status after 10 seconds
        setTimeout(() => {
          setSyncStatus('idle')
        }, 10000)
      }
    }

    const handleStorageChange = (e) => {
      if (e.key === 'doctorProfileUpdated') {
        checkSyncStatus()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    checkSyncStatus() // Check on mount

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  if (syncStatus === 'idle') return null

  return (
    <div className='fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg shadow-lg z-50'>
      <div className='flex items-center gap-2'>
        <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
        <span className='text-sm font-medium'>
          Doctor profile synced {lastSync && `at ${lastSync.toLocaleTimeString()}`}
        </span>
      </div>
    </div>
  )
}

export default ProfileSyncStatus
