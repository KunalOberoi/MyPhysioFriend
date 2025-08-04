import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppContext } from "../context/AppContext"

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false) // for mobile filter toggle
  const navigate = useNavigate()

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  const specialities = [
    "Cardio Respiratory Physiotherapist",
    "Ortho Physiotherapist",
    "Neuro Physiotherapist",
    "Geriatric Physiotherapist",
    "Pre And Post Surgery Rehabilitation",
    "Pediatric Physiotherapist"
  ]

  return (
    <div>
      <p className="text-gray-600">Browse Through Our Trusted Doctors.</p>

      {/* Filter Toggle Button - Mobile Only */}
      <button
        onClick={() => setShowFilter(prev => !prev)}
        className="sm:hidden bg-indigo-500 text-white px-4 py-2 rounded mt-4"
      >
        {showFilter ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Filters */}
        <div className={`${showFilter ? "flex" : "hidden"} sm:flex flex-col gap-4 text-sm text-gray-600`}>
          {specialities.map((spec, index) => (
            <p
              key={index}
              onClick={() =>
                speciality === spec
                  ? navigate("/doctors")
                  : navigate(`/doctors/${encodeURIComponent(spec)}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === spec ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* Doctors List */}
        <div className="w-full grid grid-cols-auto gap-6 gap-y-8">
          {filterDoc && filterDoc.length > 0 ? filterDoc.map((item, index) => (
            <div
              onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0,0)}}
              className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-12px] hover:shadow-xl transition-all duration-500 bg-white group"
              key={index}
            >
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
                  <p className="w-2 h-2 bg-accent rounded-full animate-pulse-gentle"></p>
                  <p className="font-medium">Available</p>
                </div>
                <p className="text-gray-900 text-lg font-bold group-hover:text-primary transition-colors duration-300">{item.name}</p>
                <p className="text-gray-600 text-sm font-medium">{item.speciality}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No doctors found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors
