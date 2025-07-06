import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"
import { useNavigate } from "react-router-dom"

const MyAppointments = () => {
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()
  
  // State for reschedule modal
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
    reason: ''
  })
  const [isRescheduling, setIsRescheduling] = useState(false)

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`
        slots.push({ value: time24, label: time12 })
      }
    }
    return slots
  }

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setMonth(maxDate.getMonth() + 3)
    return maxDate.toISOString().split('T')[0]
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Convert 24-hour to 12-hour format
  const formatTime = (time24) => {
    const [hour, minute] = time24.split(':')
    const hour12 = parseInt(hour) > 12 ? parseInt(hour) - 12 : parseInt(hour) === 0 ? 12 : parseInt(hour)
    const ampm = parseInt(hour) >= 12 ? 'PM' : 'AM'
    return `${hour12}:${minute} ${ampm}`
  }

  const handlePayOnline = (doctorName) => {
    alert(`Redirecting to payment gateway for Dr. ${doctorName}`)
  }

  const handleCancelAppointment = (doctorName) => {
    if (window.confirm(`Are you sure you want to cancel your appointment with Dr. ${doctorName}?`)) {
      alert(`Appointment with Dr. ${doctorName} has been cancelled successfully!`)
    }
  }

  // Handle reschedule button click
  const handleRescheduleClick = (doctor, index) => {
    setSelectedAppointment({ doctor, index })
    setShowRescheduleModal(true)
    setRescheduleData({ date: '', time: '', reason: '' })
  }

  // Handle reschedule form input changes
  const handleRescheduleInputChange = (e) => {
    const { name, value } = e.target
    setRescheduleData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle reschedule form submission
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!rescheduleData.date || !rescheduleData.time) {
      alert('Please select both date and time for rescheduling.')
      return
    }

    // Check if selected date is not in the past
    const selectedDate = new Date(rescheduleData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      alert('Please select a future date.')
      return
    }

    setIsRescheduling(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Show confirmation
      const confirmMessage = `
        Reschedule Confirmation:
        
        Doctor: Dr. ${selectedAppointment.doctor.name}
        New Date: ${formatDate(rescheduleData.date)}
        New Time: ${formatTime(rescheduleData.time)}
        ${rescheduleData.reason ? `Reason: ${rescheduleData.reason}` : ''}
        
        Are you sure you want to reschedule this appointment?
      `

      if (window.confirm(confirmMessage)) {
        // Success message
        alert(`
          ✅ Appointment Rescheduled Successfully!
          
          Your appointment with Dr. ${selectedAppointment.doctor.name} has been rescheduled to:
          📅 ${formatDate(rescheduleData.date)}
          🕐 ${formatTime(rescheduleData.time)}
          

          Please arrive 15 minutes before your appointment time.
        `)
        
        // Close modal
        setShowRescheduleModal(false)
        setSelectedAppointment(null)
        setRescheduleData({ date: '', time: '', reason: '' })
      }
    } catch (error) {
      alert('Failed to reschedule appointment. Please try again.')
    } finally {
      setIsRescheduling(false)
    }
  }

  // Close reschedule modal
  const closeRescheduleModal = () => {
    setShowRescheduleModal(false)
    setSelectedAppointment(null)
    setRescheduleData({ date: '', time: '', reason: '' })
  }

  const handleBookNewAppointment = () => {
    navigate('/doctors')
    window.scrollTo(0, 0)
  }

  const handleNeedHelp = () => {
    navigate('/contact')
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 px-3">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              My Appointments
            </h1>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-sm mt-4 max-w-xl mx-auto">
            Manage and track your upcoming medical appointments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 border border-blue-200 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  {doctors.slice(0, 2).length}
                </p>
                <p className="text-gray-600 text-xs font-medium mt-1">Total Appointments</p>
              </div>
              <div className="text-2xl p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full text-white shadow-md">📅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 border border-green-200 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                  {doctors.slice(0, 2).length}
                </p>
                <p className="text-gray-600 text-xs font-medium mt-1">Upcoming</p>
              </div>
              <div className="text-2xl p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full text-white shadow-md">🕐</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-4 hover:shadow-lg hover:scale-105 transition-all duration-300 border border-purple-200 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">0</p>
                <p className="text-gray-600 text-xs font-medium mt-1">Completed</p>
              </div>
              <div className="text-2xl p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full text-white shadow-md">✅</div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {doctors.slice(0, 2).map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-100 hover:border-primary/20 group cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Doctor Image Section */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-full object-cover border-3 border-primary/20 shadow-md group-hover:border-primary/40 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-green-400 to-green-500 w-7 h-7 rounded-full border-3 border-white shadow-md flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Info Section */}
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors duration-300">
                       {item.name}
                    </h3>
                    <p className="text-primary font-semibold mb-2 text-sm">{item.speciality}</p>

                    {/* Address Section */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200 mb-3">
                      <p className="text-xs text-gray-600 mb-1 font-semibold flex items-center">
                        <span className="mr-1 text-sm">📍</span>Address
                      </p>
                      <div className="text-gray-800 space-y-0.5">
                        <p className="font-medium text-xs">{item.address.line1}</p>
                        <p className="text-xs">{item.address.line2}</p>
                      </div>
                    </div>

                    {/* Date & Time Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-600 mb-1 font-semibold flex items-center">
                        <span className="mr-1 text-sm">📅</span>Date & Time
                      </p>
                      <p className="text-blue-800 font-bold text-sm">25 July, 2024 | 8:30 PM</p>
                      <p className="text-xs text-blue-600 mt-0.5">Appointment confirmed</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div className="flex flex-col gap-3 min-w-[180px]">
                  {/* Status Badge */}
                  <div className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center justify-center gap-1 border-2 border-green-300 hover:from-green-200 hover:to-green-300 transition-all duration-300">
                    <span className="text-sm">🕐</span>Upcoming
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handlePayOnline(item.name)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all duration-300 shadow-md flex items-center justify-center gap-1 text-xs"
                    >
                      <span className="text-sm">💳</span>Pay Online
                    </button>

                    <button
                      onClick={() => handleCancelAppointment(item.name)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg font-semibold hover:from-red-500 hover:to-red-600 hover:scale-105 transition-all duration-300 shadow-md flex items-center justify-center gap-1 text-xs"
                    >
                      <span className="text-sm">❌</span>Cancel

                    </button>

                    <button
                      onClick={() => handleRescheduleClick(item, index)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-blue-600 hover:scale-105 transition-all duration-300 shadow-md flex items-center justify-center gap-1 text-xs"
                    >
                      <span className="text-sm">🔄</span>Reschedule
                    </button>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-2 rounded-lg border border-yellow-200 text-center hover:from-yellow-100 hover:to-yellow-200 transition-all duration-300">
                    <p className="text-xs text-yellow-700 font-semibold">Reminder</p>
                    <p className="text-xs text-yellow-600 mt-0.5">2 days to go</p>
                  </div>
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 rounded-lg border border-indigo-200 text-center hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300">
                    <p className="text-indigo-600 font-semibold text-xs mb-0.5">Consultation Fee</p>
                    <p className="text-indigo-800 font-bold text-sm">₹500</p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-3 rounded-lg border border-pink-200 text-center hover:from-pink-100 hover:to-pink-200 transition-all duration-300">
                    <p className="text-pink-600 font-semibold text-xs mb-0.5">Duration</p>
                    <p className="text-pink-800 font-bold text-sm">30 mins</p>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-3 rounded-lg border border-teal-200 text-center hover:from-teal-100 hover:to-teal-200 transition-all duration-300">
                    <p className="text-teal-600 font-semibold text-xs mb-0.5">Appointment Type</p>
                    <p className="text-teal-800 font-bold text-sm">In-Person</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reschedule Modal */}
        {showRescheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Reschedule Appointment</h2>
                    <p className="text-blue-100 text-sm">
                      Dr. {selectedAppointment?.doctor.name} - {selectedAppointment?.doctor.speciality}
                    </p>
                  </div>
                  <button
                    onClick={closeRescheduleModal}
                    className="text-white hover:text-gray-200 text-2xl font-bold transition-colors duration-300"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Current Appointment Info */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="mr-2">📅</span>Current Appointment
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Date:</span> 25 July, 2024</p>
                    <p><span className="font-medium">Time:</span> 8:30 PM</p>
                    <p><span className="font-medium">Doctor:</span> Dr. {selectedAppointment?.doctor.name}</p>
                  </div>
                </div>

                {/* Reschedule Form */}
                <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                  {/* New Date Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <span className="mr-2">📅</span>Select New Date
                      </span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={rescheduleData.date}
                      onChange={handleRescheduleInputChange}
                      min={getMinDate()}
                      max={getMaxDate()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Available from tomorrow to {formatDate(getMaxDate())}
                    </p>
                  </div>

                  {/* New Time Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <span className="mr-2">🕐</span>Select New Time
                      </span>
                    </label>
                    <select
                      name="time"
                      value={rescheduleData.time}
                      onChange={handleRescheduleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    >
                      <option value="">Choose a time slot</option>
                      {generateTimeSlots().map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Available slots: 9:00 AM - 5:30 PM (30-minute intervals)
                    </p>
                  </div>

                  {/* Reason for Rescheduling */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <span className="flex items-center">
                        <span className="mr-2">📝</span>Reason for Rescheduling (Optional)
                      </span>
                    </label>
                    <textarea
                      name="reason"
                      value={rescheduleData.reason}
                      onChange={handleRescheduleInputChange}
                      placeholder="Please provide a reason for rescheduling..."
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Preview Section */}
                  {rescheduleData.date && rescheduleData.time && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                        <span className="mr-2">👁️</span>New Appointment Preview
                      </h3>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p><span className="font-medium">Date:</span> {formatDate(rescheduleData.date)}</p>
                        <p><span className="font-medium">Time:</span> {formatTime(rescheduleData.time)}</p>
                        <p><span className="font-medium">Doctor:</span> Dr. {selectedAppointment?.doctor.name}</p>
                        <p><span className="font-medium">Specialty:</span> {selectedAppointment?.doctor.speciality}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={closeRescheduleModal}
                      className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 hover:scale-105 transition-all duration-300 shadow-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isRescheduling || !rescheduleData.date || !rescheduleData.time}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isRescheduling ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Rescheduling...
                        </span>
                      ) : (
                        'Confirm Reschedule'
                      )}
                    </button>
                  </div>
                </form>

                {/* Important Notes */}
                <div className="mt-6 bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                    <span className="mr-2">⚠️</span>Important Notes
                  </h3>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• Rescheduling is free of charge</li>
                    <li>• Please arrive 15 minutes before your appointment</li>
                    <li>• Bring all necessary documents and medical records</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State (if no appointments) */}
        {doctors.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="text-6xl mb-6 animate-bounce">📅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Appointments Found</h3>
            <p className="text-gray-600 mb-6 text-sm max-w-md mx-auto">
              You haven't booked any appointments yet. Start your healthcare journey today!
            </p>
            <button
              onClick={handleBookNewAppointment}
              className="bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 rounded-full hover:from-primary/90 hover:to-blue-600/90 hover:scale-105 transition-all duration-300 font-semibold text-sm shadow-lg"
            >
              Book Your First Appointment
            </button>
          </div>
        )}

        {/* Quick Actions Footer */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={handleBookNewAppointment}
              className="group flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105 shadow-md border border-blue-200"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full mb-4 text-2xl group-hover:scale-110 transition-transform duration-300 shadow-md">
                🩺
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Book New Appointment</h4>
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                Find and book with qualified healthcare professionals
              </p>
            </button>

            <button
              onClick={handleNeedHelp}
              className="group flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:scale-105 shadow-md border border-purple-200"
            >
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-full mb-4 text-2xl group-hover:scale-110 transition-transform duration-300 shadow-md">
                💬
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Need Help?</h4>
                           <p className="text-xs text-gray-600 text-center leading-relaxed">
                Contact our support team for assistance
              </p>
            </button>
          </div>
        </div>

        {/* Emergency Contact Banner */}
        <div className="mt-6 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white rounded-2xl p-6 shadow-xl border border-red-300 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <span className="text-2xl">🚨</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Emergency Healthcare</h4>
                <p className="text-white/90 text-sm">Need immediate medical assistance?</p>
                <p className="text-white/80 text-xs">Available 24/7 for urgent healthcare needs</p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = 'tel:+917838203606'}
              className="bg-white text-red-500 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-md text-sm whitespace-nowrap"
            >
              📞 Call Now: +91 7838203606
            </button>
          </div>
        </div>

        {/* Appointment Tips Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Appointment Tips & Reminders
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 text-center hover:from-blue-100 hover:to-blue-200 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-2xl mb-3">⏰</div>
              <h4 className="font-bold text-gray-900 mb-1 text-sm">Arrive Early</h4>
              <p className="text-xs text-gray-600">Arrive 15 minutes before your appointment time</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 text-center hover:from-green-100 hover:to-green-200 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-2xl mb-3">📋</div>
              <h4 className="font-bold text-gray-900 mb-1 text-sm">Bring Documents</h4>
              <p className="text-xs text-gray-600">Carry your ID, insurance card, and medical records</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 text-center hover:from-purple-100 hover:to-purple-200 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-2xl mb-3">💊</div>
              <h4 className="font-bold text-gray-900 mb-1 text-sm">List Medications</h4>
              <p className="text-xs text-gray-600">Prepare a list of current medications and allergies</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200 text-center hover:from-yellow-100 hover:to-yellow-200 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-2xl mb-3">❓</div>
              <h4 className="font-bold text-gray-900 mb-1 text-sm">Prepare Questions</h4>
              <p className="text-xs text-gray-600">Write down questions you want to ask your doctor</p>
            </div>
          </div>
        </div>

       

        {/* Health Tips Section */}
        <div className="mt-8 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-lg p-6 border border-indigo-200 hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
          <h3 className="text-lg font-bold text-center mb-6 text-indigo-800">💡 Health Tips for You</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">💧</span>
                <h4 className="font-semibold text-gray-900 text-sm">Stay Hydrated</h4>
              </div>
              <p className="text-xs text-gray-600">Drink at least 8 glasses of water daily for optimal health</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">🏃‍♂️</span>
                <h4 className="font-semibold text-gray-900 text-sm">Regular Exercise</h4>
              </div>
              <p className="text-xs text-gray-600">30 minutes of daily exercise can improve your overall well-being</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">😴</span>
                <h4 className="font-semibold text-gray-900 text-sm">Quality Sleep</h4>
              </div>
              <p className="text-xs text-gray-600">Get 7-9 hours of quality sleep for better mental and physical health</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">🥗</span>
                <h4 className="font-semibold text-gray-900 text-sm">Balanced Diet</h4>
              </div>
              <p className="text-xs text-gray-600">Include fruits, vegetables, and whole grains in your daily meals</p>
            </div>
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MyPhysioFriend - Your Health Partner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-blue-200 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-2xl mb-2">🏥</div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Trusted Healthcare</h4>
                <p className="text-xs text-gray-600">Connect with verified and experienced doctors</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 hover:from-green-100 hover:to-green-200 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Quick Booking</h4>
                <p className="text-xs text-gray-600">Book appointments instantly with just a few clicks</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-purple-200 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="text-2xl mb-2">🔒</div>
                <h4 className="font-bold text-gray-900 mb-1 text-sm">Secure & Private</h4>
                <p className="text-xs text-gray-600">Your medical information is safe and confidential</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -20px, 0);
          }
          70% {
            transform: translate3d(0, -10px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        .hover-lift:hover {
          transform: translateY(-3px);
        }

        .glass-effect {
          backdrop-filter: blur(8px);
          background: rgba(255, 255, 255, 0.9);
        }

        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

              ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
        }

        /* Responsive grid adjustments */
        @media (max-width: 768px) {
          .grid-cols-auto {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }

        @media (max-width: 640px) {
          .grid-cols-auto {
            grid-template-columns: 1fr;
          }
        }

        /* Enhanced button animations */
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
        }

        .btn-secondary {
          background: linear-gradient(135deg, #6b7280, #9ca3af);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-secondary:hover {
          background: linear-gradient(135deg, #4b5563, #6b7280);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(107, 114, 128, 0.4);
        }

        /* Card hover effects */
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        /* Gradient text effects */
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Loading animation */
        .loading-dots {
          display: inline-block;
        }

        .loading-dots::after {
          content: '';
          animation: dots 1.5s steps(5, end) infinite;
        }

        @keyframes dots {
          0%, 20% {
            color: rgba(0,0,0,0);
            text-shadow:
              .25em 0 0 rgba(0,0,0,0),
              .5em 0 0 rgba(0,0,0,0);
          }
          40% {
            color: black;
            text-shadow:
              .25em 0 0 rgba(0,0,0,0),
              .5em 0 0 rgba(0,0,0,0);
          }
          60% {
            text-shadow:
              .25em 0 0 black,
              .5em 0 0 rgba(0,0,0,0);
          }
          80%, 100% {
            text-shadow:
              .25em 0 0 black,
              .5em 0 0 black;
          }
        }

        /* Modal animations */
        .modal-enter {
          opacity: 0;
          transform: scale(0.9);
        }

        .modal-enter-active {
          opacity: 1;
          transform: scale(1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .modal-exit {
          opacity: 1;
          transform: scale(1);
        }

        .modal-exit-active {
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Notification styles */
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          padding: 16px 24px;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .notification.show {
          transform: translateX(0);
        }

        .notification.success {
          background: linear-gradient(135deg, #10b981, #059669);
        }

        .notification.error {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .notification.warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .notification.info {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        /* Ripple effect */
        .ripple {
          position: relative;
          overflow: hidden;
        }

        .ripple::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .ripple:active::before {
          width: 300px;
          height: 300px;
        }

        /* Enhanced focus states */
        .focus-ring:focus {
          outline: none;
          ring: 2px;
          ring-color: #3b82f6;
          ring-offset: 2px;
        }

        /* Smooth transitions for all interactive elements */
        * {
          transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, 
                      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MyAppointments;
