import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {

  const { aToken, doctors, appointments, getAllDoctors, getAllAppointments, completeAppointment } = useContext(AdminContext)

  // Calculate unique patients
  const getUniquePatients = () => {
    if (!appointments || appointments.length === 0) return 0
    const uniqueUserIds = new Set(
      appointments
        .map(appointment => appointment.userData?._id || appointment.userId?._id || appointment.userId)
        .filter(Boolean)
    )
    return uniqueUserIds.size
  }

  // Get latest appointments (limit to 5)
  const getLatestAppointments = () => {
    if (!appointments || appointments.length === 0) return []
    return appointments
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  }

  // Handle marking appointment as complete
  const handleCompleteAppointment = async (appointmentId) => {
    await completeAppointment(appointmentId)
  }

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
      getAllAppointments()
    }
  }, [aToken])

  return aToken && (
    <div className='m-5'>

      <div className='flex flex-wrap gap-3'>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{doctors.length}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{appointments ? appointments.length : 0}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{getUniquePatients()}</p>
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
          {getLatestAppointments().length > 0 ? (
            getLatestAppointments().map((appointment, index) => {
              // Find doctor info
              const doctor = doctors.find(doc => doc._id === appointment.docId)
              
              return (
                <div key={appointment._id || index} className='flex items-center px-6 py-3 gap-3 hover:bg-gray-50'>
                  <img 
                    className='rounded-full w-10 h-10 object-cover' 
                    src={appointment.docData?.image || appointment.docId?.image || doctor?.image || assets.doctor_icon} 
                    alt="" 
                  />
                  <div className='flex-1 text-sm'>
                    <p className='text-gray-800 font-medium'>{appointment.userData?.name || appointment.userId?.name || 'Patient'}</p>
                    <p className='text-gray-600'>Booking with Dr. {appointment.docData?.name || appointment.docId?.name || doctor?.name || 'Doctor'}</p>
                  </div>
                  <div className='text-sm'>
                    <p className='text-gray-800 font-medium'>
                      {new Date(appointment.slotDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className='text-gray-600'>{appointment.slotTime}</p>
                  </div>
                  <div className='text-sm'>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.cancelled 
                        ? 'bg-red-100 text-red-600' 
                        : appointment.isCompleted
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {appointment.cancelled ? 'Cancelled' : appointment.isCompleted ? 'Completed' : 'Confirmed'}
                    </span>
                  </div>
                  <div className='text-sm'>
                    {!appointment.cancelled && !appointment.isCompleted && (
                      <input
                        type="checkbox"
                        onChange={() => handleCompleteAppointment(appointment._id)}
                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer'
                        title="Mark as completed"
                      />
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className='flex items-center justify-center py-8'>
              <div className='text-center'>
                <img className='w-16 h-16 mx-auto mb-3 opacity-50' src={assets.appointments_icon} alt="" />
                <p className='text-gray-500 text-sm'>No appointments found</p>
                <p className='text-gray-400 text-xs'>Latest bookings will appear here</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  )
}

export default Dashboard
