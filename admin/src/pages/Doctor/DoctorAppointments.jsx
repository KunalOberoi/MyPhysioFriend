import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    if (dToken) {
      getAppointments()
      setLastUpdated(new Date())
    }
  }, [dToken])

  return (
    <div className='w-full max-w-6xl m-5'>

      <div className='flex items-center justify-between mb-3'>
        <p className='text-lg font-medium'>All Appointments</p>
        <div className='flex items-center gap-4'>
          <div className='text-sm text-gray-500'>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments && appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
              <p className='max-sm:hidden'>{index + 1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item.userData?.image || '/api/placeholder/32/32'} alt="" /> 
                <p>{item.userData?.name || 'Unknown Patient'}</p>
              </div>
              <p className='max-sm:hidden'>{item.userData?.age || 'N/A'}</p>
              <p>{item.slotDate}, {item.slotTime}</p>
              <p>${item.amount || 0}</p>
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                  : <div className='flex'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
              }
            </div>
          ))
        ) : (
          <div className='py-8 text-center text-gray-500'>
            <p>No appointments found</p>
          </div>
        )}

      </div>

    </div>
  )
}

export default DoctorAppointments
