import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AppContext } from "../context/AppContext"
import { assets } from "../assets/assets"
import RelatedDoctors from "../components/RelatedDoctors"

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { doctors, currencySymbol, bookAppointment, isLoggedIn, getUserAppointments, userData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [isBooking, setIsBooking] = useState(false)

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }

  const getAvailableSlots = async () => {
    setDocSlots([])

    // getting current date 
    let today = new Date()

    for (let i = 0; i < 7; i++) {
      // getting the date of the day by index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      // setting end time of the date by index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        // Format time in 12-hour format with AM/PM
        let formattedTime = currentDate.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })

        // add slots to array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        // incrementing the time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  const handleBookAppointment = async () => {
    if (!isLoggedIn()) {
      alert('Please login to book an appointment')
      navigate('/login')
      return
    }

    if (!slotTime) {
      alert('Please select a time slot before booking!')
      return
    }

    const selectedSlot = docSlots[slotIndex]?.find(slot => slot.time === slotTime)
    if (!selectedSlot) {
      alert('Invalid time slot selected!')
      return
    }

    setIsBooking(true)
    
    try {
      // Format the date and time for the backend
      const slotDate = selectedSlot.datetime.toISOString().split('T')[0] // YYYY-MM-DD format
      
      const result = await bookAppointment(docId, slotDate, slotTime)
      
      if (result.success) {
        const selectedDay = daysOfWeek[selectedSlot.datetime.getDay()]
        const selectedDate = selectedSlot.datetime.getDate()
        
        // Show success message
        let message = `✅ Appointment booked successfully!\n\nDoctor: ${docInfo.name}\nDay: ${selectedDay}\nDate: ${selectedDate}\nTime: ${slotTime}\nFee: ${currencySymbol}${docInfo.fees}`;
        
        if (result.whatsappSent) {
          message += `\n\n📱 WhatsApp notification sent automatically to +919138136007!`;
        } else if (result.whatsappUrl) {
          message += `\n\n📋 WhatsApp notification prepared for +919138136007.\nYou'll be prompted to send it.`;
        }
        
        alert(message)
        
        // Navigate to appointments page
        navigate('/my-appointments')
        
        // Reset form
        setSlotTime('')
        setSlotIndex(0)
      } else {
        alert(result.message || 'Failed to book appointment. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to book appointment. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  useEffect(() => {
    console.log(docSlots)
  }, [docSlots])

  return docInfo && (
    <div>
      {/* doctor details */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
        </div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          {/* doctor info */}
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name} 
            <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
          </div>

          {/* doctor about */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
              About <img src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
          </div>
          <p className="text-gray-500 font-medium mt-4">
            Appointment Fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* BOOKING SLOTS */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking Slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {
            docSlots.length && docSlots.map((item, index) => (
              <div 
                onClick={() => setSlotIndex(index)} 
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all duration-300 transform ${
                  slotIndex === index 
                    ? 'bg-primary text-white scale-105 shadow-lg' 
                    : 'border border-gray-200 hover:border-primary hover:bg-primary/10 hover:scale-105 hover:shadow-md'
                }`} 
                key={index}
              >
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots.length && docSlots[slotIndex].map((item, index) => (
            <p 
              onClick={() => setSlotTime(item.time)} 
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 transform ${
                item.time === slotTime 
                  ? 'bg-primary text-white scale-105 shadow-lg' 
                  : 'text-gray-400 border border-gray-300 hover:border-primary hover:bg-primary/10 hover:text-primary hover:scale-105 hover:shadow-md'
              }`} 
              key={index}
            >
              {item.time}
            </p>
          ))}
        </div>

        <button 
          onClick={handleBookAppointment}
          disabled={isBooking || !slotTime}
          className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isBooking ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Booking...
            </span>
          ) : (
            'Book an appointment'
          )}
        </button>
      </div>

      {/* listing Related doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>    

    </div>
  )
}

export default Appointment
