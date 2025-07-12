import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {

  const { dToken, appointments, getDashData, dashData, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    if (dToken) {
      getDashData()
      setLastUpdated(new Date())
    }
  }, [dToken])

  return dToken && (
    <div className='m-5'>

      <div className='flex items-center justify-between mb-5'>
        <h1 className='text-xl font-semibold text-gray-800'>Dashboard</h1>
        <div className='text-sm text-gray-500'>
          Updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      <div className='flex flex-wrap gap-3'>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>${dashData?.earnings || 0}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointment_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData?.appointments || 0}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData?.patients || 0}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>

      </div>

      <div className='bg-white'>

        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {dashData?.latestAppointments && dashData.latestAppointments.length > 0 ? 
            dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-50' key={index}>
                <img className='rounded-full w-10' src={item.userData?.image || '/api/placeholder/40/40'} alt="" />
                <div className='flex-1 text-sm'>
                  <p className='text-gray-800 font-medium'>{item.userData?.name || 'Unknown Patient'}</p>
                  <p className='text-gray-600'>{item.slotDate}, {item.slotTime}</p>
                </div>
                {item.cancelled && <p className='text-red-400 text-xs font-medium'>Cancelled</p>}
                {item.isCompleted && <p className='text-green-500 text-xs font-medium'>Completed</p>}
                {!item.cancelled && !item.isCompleted && (
                  <div className='flex'>
                    <img 
                      onClick={() => cancelAppointment(item._id)} 
                      className='w-10 cursor-pointer' 
                      src={assets.cancel_icon} 
                      alt="Cancel" 
                    />
                    <img 
                      onClick={() => completeAppointment(item._id)} 
                      className='w-10 cursor-pointer' 
                      src={assets.tick_icon} 
                      alt="Complete" 
                    />
                  </div>
                )}
              </div>
            )) : (
              <div className='px-6 py-8 text-center text-gray-500'>
                <p>No recent appointments</p>
              </div>
            )
          }
        </div>

      </div>

    </div>
  )
}

export default DoctorDashboard
