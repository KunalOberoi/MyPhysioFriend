import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import EditDoctor from '../../components/EditDoctor'

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors, refreshDoctors, changeAvailability, deleteDoctor, lastUpdated } = useContext(AdminContext)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  const handleDeleteDoctor = async (doctorId, doctorName) => {
    if (window.confirm(`Are you sure you want to delete Dr. ${doctorName}? This action cannot be undone.`)) {
      await deleteDoctor(doctorId)
    }
  }

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor)
    setShowEditModal(true)
  }

  const handleCloseEdit = () => {
    setShowEditModal(false)
    setSelectedDoctor(null)
  }

  const handleEditSuccess = () => {
    getAllDoctors() // Refresh the doctors list
    setShowEditModal(false)
    setSelectedDoctor(null)
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    await refreshDoctors()
    setIsLoading(false)
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <div className='flex items-center justify-between mb-5'>
        <h1 className='text-lg font-medium'>All Doctors</h1>
        <div className='flex items-center gap-4'>
          <div className='text-sm text-gray-500'>
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Loading...'}
          </div>
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLoading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isLoading && (
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
            )}
            {isLoading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
            <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
            <div className='p-4'>
              <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
              <p className='text-zinc-600 text-sm'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input 
                  onChange={() => changeAvailability(item._id)} 
                  type="checkbox" 
                  checked={item.available} 
                />
                <p>Available</p>
              </div>
              <div className='mt-3 flex gap-2'>
                <button 
                  onClick={() => handleEditDoctor(item)}
                  className='bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded transition-colors'
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteDoctor(item._id, item.name)}
                  className='bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded transition-colors'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Doctor Modal */}
      {showEditModal && selectedDoctor && (
        <EditDoctor 
          doctor={selectedDoctor}
          onClose={handleCloseEdit}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}

export default DoctorsList
