import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"

const Banner = () => {

    const navigate = useNavigate()
  return (
    <div className="flex bg-gradient-to-r from-primary to-primary-light rounded-xl px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10 shadow-xl overflow-hidden">
      {/* left side */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5 flex flex-col justify-center">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-white">
          <p className="mb-4">Book Appointment</p>
          <p className="mb-8">With Our <span className="text-accent">Trusted</span> Doctors</p>
        </div>
        <button onClick={()=>{navigate('/login'); scrollTo(0,0)}} className="bg-white text-sm sm:text-base text-primary font-semibold px-10 py-4 rounded-full mt-6 hover:scale-105 hover:shadow-lg transition-all duration-300 w-fit">
          Create Account
        </button>
      </div>
      
      {/* right side */}
      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
        <img 
          className="w-full absolute bottom-0 h-auto max-h-60 lg:max-h-72 drop-shadow-2xl" 
          src={assets.appointment_img} 
          alt="Doctor appointment" 
        />
      </div>
    </div>
  )
}

export default Banner
