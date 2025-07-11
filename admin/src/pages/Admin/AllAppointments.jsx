import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'

const AllAppointments = () => {

  const { aToken, appointments, doctors, getAllAppointments, getAllDoctors, cancelAppointment, completeAppointment } = useContext(AdminContext)

  // Handle cancelling appointment
  const handleCancelAppointment = async (appointmentId) => {
    await cancelAppointment(appointmentId)
  }

  // Handle marking appointment as complete
  const handleCompleteAppointment = async (appointmentId) => {
    await completeAppointment(appointmentId)
  }

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
      getAllDoctors()
    }
  }, [aToken])

  return aToken && (
    <div className='w-full max-w-6xl m-5'>
      
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1.5fr_2.5fr_3fr_1fr_1.5fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Contact</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {appointments && appointments.length > 0 ? (
          appointments.map((appointment, index) => {
            // Find doctor info
            const doctor = doctors.find(doc => doc._id === appointment.docId)
            
            return (
              <div key={appointment._id || index} className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1.5fr_2.5fr_3fr_1fr_1.5fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'>
                <p className='max-sm:hidden'>{index + 1}</p>
                
                <div className='flex items-center gap-2'>
                  <img 
                    className='w-8 rounded-full' 
                    src={appointment.userData?.image || assets.patient_icon} 
                    alt="" 
                  />
                  <div>
                    <p className='font-medium text-gray-800'>
                      {appointment.userData?.name || appointment.userId?.name || 'Unknown Patient'}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {appointment.userData?.email || appointment.userId?.email || 'No email'}
                    </p>
                  </div>
                </div>
                
                <div className='max-sm:hidden'>
                  <p className='text-sm font-medium'>{appointment.userData?.phone || appointment.userId?.phone || 'No phone'}</p>
                  <p className='text-xs text-gray-500'>Age: {appointment.userData?.age || appointment.userId?.age || 'N/A'}</p>
                </div>
                
                <div>
                  <p className='font-medium text-gray-800'>
                    {new Date(appointment.slotDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  <p className='text-xs text-gray-500'>{appointment.slotTime}</p>
                </div>
                
                <div className='flex items-center gap-2'>
                  <img 
                    className='w-8 rounded-full bg-gray-200' 
                    src={appointment.docData?.image || doctor?.image || assets.doctor_icon} 
                    alt="" 
                  />
                  <div>
                    <p className='font-medium text-gray-800'>
                      {appointment.docData?.name || doctor?.name || 'Unknown Doctor'}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {appointment.docData?.speciality || doctor?.speciality || 'General'}
                    </p>
                  </div>
                </div>
                
                <div className='flex flex-col items-start gap-1'>
                  <p className='font-medium text-gray-800'>₹{appointment.amount || doctor?.fees || 0}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.payment ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {appointment.payment ? 'Paid' : 'Pending'}
                  </span>
                </div>
                
                <div className='flex flex-col items-start gap-2'>
                  {appointment.cancelled ? (
                    <span className='px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600'>
                      Cancelled
                    </span>
                  ) : appointment.isCompleted ? (
                    <span className='px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600'>
                      Completed
                    </span>
                  ) : (
                    <div className='flex flex-col gap-2'>
                      <span className='px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600'>
                        Active
                      </span>
                      <div className='flex gap-1'>
                        <button
                          onClick={() => handleCompleteAppointment(appointment._id)}
                          className='text-green-600 hover:text-green-800 transition-colors p-1 rounded'
                          title="Mark as completed"
                        >
                          <img className='w-4 h-4' src={assets.tick_icon} alt="Complete" />
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          className='text-red-600 hover:text-red-800 transition-colors p-1 rounded'
                          title="Cancel appointment"
                        >
                          <img className='w-4 h-4' src={assets.cancel_icon} alt="Cancel" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <img className='w-16 h-16 mx-auto mb-4 opacity-50' src={assets.appointments_icon} alt="" />
              <p className='text-gray-500 text-lg'>No appointments found</p>
              <p className='text-gray-400 text-sm'>Appointments will appear here once patients book them</p>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default AllAppointments
