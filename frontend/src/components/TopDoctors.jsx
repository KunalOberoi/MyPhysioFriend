import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AppContext } from "../context/AppContext"

const TopDoctors = () => {

const navigate = useNavigate()
const {doctors} = useContext(AppContext)

  return (
    <div className="flex flex-col items-center gap-6 my-20 text-gray-900 md:mx-10">
      <h1 className="text-4xl font-bold text-primary">Our Top Doctors To Book</h1>
      <p className="sm:w-1/3 text-center text-gray-600 leading-relaxed">Simply browse through our extensive list of trusted and experienced doctors.</p>
      <div className="w-full grid grid-cols-auto gap-6 pt-8 gap-y-8 px-3 sm:px-0">
        {doctors && doctors.length > 0 ? doctors.slice(0,10).map((item,index)=>(
            <div onClick={()=>{navigate(`/appointment/${item._id}`); scrollTo(0,0)}} className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-12px] hover:shadow-xl transition-all duration-500 bg-white group" key={index}>
                <img 
                  className="bg-gray-50 w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"  
                  src={item.image} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200?text=Doctor'
                  }}
                />
                <div className="p-5">
                    <div className="flex items-center gap-2 text-sm text-center text-accent mb-2">
                        <p className="w-2 h-2 bg-accent rounded-full animate-pulse-gentle"></p><p className="font-medium">Available</p>
                    </div>
                    <p className="text-gray-900 text-lg font-bold group-hover:text-primary transition-colors duration-300">{item.name}</p>
                    <p className="text-gray-600 text-sm font-medium">{item.speciality}</p>
                </div>
            </div>
        )) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">Loading doctors...</p>
          </div>
        )}
      </div>
      <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)}} className="bg-primary text-white px-12 py-4 rounded-full mt-10 font-semibold hover:bg-primary-light hover:shadow-lg transition-all duration-300">View All Doctors</button>
    </div>
  )
}

export default TopDoctors
