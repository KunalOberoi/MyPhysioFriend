import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {

    const { aToken } = useContext(AdminContext)
    const { dToken } = useContext(DoctorContext)

    return (
        <div className='min-h-screen bg-white border-r'>
            {
                aToken && <ul className='text-gray-600 mt-5'>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-gray-50 transition-all duration-300 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : ''}`} to={'/admin-dashboard'}>
                        <img src={assets.home_icon} alt="" className="w-5 h-5" />
                        <p className="font-medium">Dashboard</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-gray-50 transition-all duration-300 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : ''}`} to={'/all-appointments'}>
                        <img src={assets.appointment_icon} alt="" className="w-5 h-5" />
                        <p className="font-medium">Appointments</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-gray-50 transition-all duration-300 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : ''}`} to={'/add-doctor'}>
                        <img src={assets.add_icon} alt="" className="w-5 h-5" />
                        <p className="font-medium">Add Doctor</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-gray-50 transition-all duration-300 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : ''}`} to={'/doctor-list'}>
                        <img src={assets.people_icon} alt="" className="w-5 h-5" />
                        <p className="font-medium">Doctors List</p>
                    </NavLink>

                </ul>
            }

            {
                dToken && <ul className='text-gray-600 mt-5'>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-gray-50 transition-all duration-300 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : ''}`} to={'/doctor-dashboard'}>
                        <img src={assets.home_icon} alt="" className="w-5 h-5" />
                        <p className="font-medium">Dashboard</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-gray-50 transition-all duration-300 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : ''}`} to={'/doctor-appointments'}>
                        <img src={assets.appointment_icon} alt="" className="w-5 h-5" />
                        <p className="font-medium">Appointments</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer hover:bg-gray-50 transition-all duration-300 ${isActive ? 'bg-blue-50 border-r-4 border-blue-500 text-blue-600' : ''}`} to={'/doctor-profile'}>
                        <img src={assets.people_icon} alt="" className="w-5 h-5" />
                        <p className="font-medium">Profile</p>
                    </NavLink>

                </ul>
            }
        </div>
    )
}

export default Sidebar
