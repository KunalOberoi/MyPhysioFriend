import { Link } from "react-router-dom"
import { specialityData } from "../assets/assets"

const SpecialityMenu = () => {
  return (
    <div className="flex flex-col items-center gap-6 py-12 md:py-20 px-4 text-gray-800 bg-gradient-to-b from-gray-50 to-white" id="speciality">
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-primary-light bg-clip-text text-transparent text-center">My Physio Friend</h1>
      <p className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 text-center text-gray-600 leading-relaxed text-sm md:text-base">
        My Physio Friend offers expert physiotherapy treatments for a wide range of conditions with professional care.
      </p>
      
      {/* Mobile View - Horizontal Scroll */}
      <div className="md:hidden flex gap-4 pt-6 w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pl-2">
          {specialityData.map((item, index) => (
            <Link 
              onClick={() => window.scrollTo(0, 0)} 
              className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-8px] hover:scale-105 transition-all duration-300 group bg-white p-4 rounded-lg shadow-md hover:shadow-lg min-w-[100px]" 
              key={index} 
              to={`/doctors/${item.speciality}`}
            >
              <img className="w-12 h-12 mb-3 group-hover:scale-110 transition-transform duration-300 object-contain" src={item.image} alt={item.speciality} />
              <p className="font-medium text-gray-700 group-hover:text-primary transition-colors duration-300 text-center leading-tight">{item.speciality}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Tablet View - 2-3 columns */}
      <div className="hidden md:flex lg:hidden justify-center gap-6 pt-8 w-full max-w-4xl">
        <div className="grid grid-cols-3 gap-6 w-full">
          {specialityData.map((item, index) => (
            <Link 
              onClick={() => window.scrollTo(0, 0)} 
              className="flex flex-col items-center text-sm cursor-pointer hover:translate-y-[-10px] hover:scale-105 transition-all duration-400 group bg-white p-5 rounded-xl shadow-md hover:shadow-xl" 
              key={index} 
              to={`/doctors/${item.speciality}`}
            >
              <img className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300 object-contain" src={item.image} alt={item.speciality} />
              <p className="font-medium text-gray-700 group-hover:text-primary transition-colors duration-300 text-center">{item.speciality}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop/Laptop View - Horizontal Layout */}
      <div className="hidden lg:flex justify-center gap-8 pt-8 w-full overflow-x-auto">
        <div className="flex gap-8 px-4">
          {specialityData.map((item, index) => (
            <Link 
              onClick={() => window.scrollTo(0, 0)} 
              className="flex flex-col items-center text-sm cursor-pointer flex-shrink-0 hover:translate-y-[-12px] hover:scale-105 transition-all duration-500 group bg-white p-6 rounded-xl shadow-md hover:shadow-xl min-w-[140px]" 
              key={index} 
              to={`/doctors/${item.speciality}`}
            >
              <img className="w-20 h-20 mb-4 group-hover:scale-110 transition-transform duration-300 object-contain" src={item.image} alt={item.speciality} />
              <p className="font-medium text-gray-700 group-hover:text-primary transition-colors duration-300 text-center">{item.speciality}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SpecialityMenu
