import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext'

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false)
    const { token, userData, logout } = useContext(AppContext)

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMenu && !event.target.closest('.mobile-menu-container') && !event.target.closest('.menu-toggle-btn')) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showMenu]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (showMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showMenu]);

    // Handle navigation with menu close
    const handleNavigation = (path) => {
        navigate(path);
        setShowMenu(false);
    };

    // Handle logout
    const handleLogout = () => {
        logout()
        navigate('/')
        setShowMenu(false)
    };

    // Get user initials for fallback avatar
    const getUserInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 px-4 sm:px-6 relative z-50'>
                {/* Logo */}
                <img 
                    onClick={() => handleNavigation('/')} 
                    className='w-32 sm:w-36 md:w-44 cursor-pointer' 
                    src={assets.logo} 
                    alt="MyPhysioFriend" 
                />
                
                {/* Desktop Navigation */}
                <ul className='hidden md:flex items-start gap-5 font-medium'>
                    <NavLink to='/' className={({ isActive }) => isActive ? 'text-primary' : ''}>
                        <li className='py-1'>Home</li>
                        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
                    </NavLink>
                    <NavLink to='/doctors' className={({ isActive }) => isActive ? 'text-primary' : ''}>
                        <li className='py-1'>All Doctors</li>
                        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
                    </NavLink>
                    <NavLink to='/about' className={({ isActive }) => isActive ? 'text-primary' : ''}>
                        <li className='py-1'>About</li>
                        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
                    </NavLink>
                    <NavLink to='/contact' className={({ isActive }) => isActive ? 'text-primary' : ''}>
                        <li className='py-1'>Contact Us</li>
                        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
                    </NavLink>
                </ul>

                {/* Desktop Right Side */}
                <div className='hidden md:flex items-center gap-4'>
                    {/* Admin Panel Button - Always visible on desktop */}
                    <button 
                        onClick={() => window.open('http://localhost:5174', '_blank')}
                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700 hover:scale-105 transition-all duration-300"
                    >
                        <span>⚙️</span>
                        Admin Panel
                    </button>
                    
                    {token ? (
                        <div className='flex items-center gap-2 cursor-pointer group relative'>
                            {/* Dynamic Desktop Profile Image */}
                            <img 
                                className='w-8 h-8 rounded-full object-cover' 
                                src={userData && userData.image ? userData.image : assets.profile_pic} 
                                alt="Profile" 
                            />
                            <img className='w-2.5' src={assets.dropdown_icon} alt="Dropdown" />
                            <div className='absolute top-10 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg'>
                                    <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>
                                        My Profile
                                    </p>
                                    <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>
                                        My Appointments
                                    </p>
                                    <p onClick={handleLogout} className='hover:text-black cursor-pointer'>
                                        Logout
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate('/login')}
                            className='bg-primary text-white px-8 py-3 rounded-full font-light hover:bg-primary/90 transition-colors'
                        >
                            Create Account
                        </button>
                    )}
                </div>

                {/* Mobile Right Side - Only Menu Button */}
                <div className='md:hidden flex items-center'>
                    {/* Menu Toggle Button */}
                    <button
                        className='menu-toggle-btn w-6 h-6 flex items-center justify-center cursor-pointer p-1 rounded hover:bg-gray-100 active:bg-gray-200 transition-colors'
                        onClick={() => setShowMenu(!showMenu)}
                        aria-label={showMenu ? 'Close menu' : 'Open menu'}
                    >
                        {showMenu ? (
                            // Cross/Close Icon
                            assets.cross_icon ? (
                                <img src={assets.cross_icon} alt="Close" className='w-5 h-5' />
                            ) : (
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )
                        ) : (
                            // Menu/Hamburger Icon
                            assets.menu_icon ? (
                                <img src={assets.menu_icon} alt="Menu" className='w-5 h-5' />
                            ) : (
                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`mobile-menu-container md:hidden fixed top-0 left-0 right-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
                showMenu ? 'translate-y-0' : '-translate-y-full'
            }`}>
                {/* Mobile Menu Content */}
                <div className='px-4 py-6 pt-20 max-h-screen overflow-y-auto'>
                    
                    {/* Navigation Links First */}
                    <ul className='space-y-2 mb-6'>
                        <li>
                            <NavLink 
                                to='/' 
                                onClick={() => setShowMenu(false)}
                                className={({ isActive }) => 
                                    `flex items-center py-4 px-4 rounded-lg text-lg font-medium transition-all duration-200 ${
                                        isActive 
                                            ? 'text-primary bg-blue-50 border-l-4 border-primary' 
                                            : 'text-gray-700 hover:text-primary hover:bg-gray-50 active:bg-gray-100'
                                    }`
                                }
                            >
                                <span className='ml-2'>🏠</span>
                                <span className='ml-4'>Home</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to='/doctors' 
                                onClick={() => setShowMenu(false)}
                                className={({ isActive }) => 
                                    `flex items-center py-4 px-4 rounded-lg text-lg font-medium transition-all duration-200 ${
                                        isActive 
                                            ? 'text-primary bg-blue-50 border-l-4 border-primary' 
                                            : 'text-gray-700 hover:text-primary hover:bg-gray-50 active:bg-gray-100'
                                    }`
                                }
                            >
                                <span className='ml-2'>👨‍⚕️</span>
                                <span className='ml-4'>All Doctors</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to='/about' 
                                onClick={() => setShowMenu(false)}
                                className={({ isActive }) => 
                                    `flex items-center py-4 px-4 rounded-lg text-lg font-medium transition-all duration-200 ${
                                        isActive 
                                            ? 'text-primary bg-blue-50 border-l-4 border-primary' 
                                            : 'text-gray-700 hover:text-primary hover:bg-gray-50 active:bg-gray-100'
                                    }`
                                }
                            >
                                <span className='ml-2'>ℹ️</span>
                                <span className='ml-4'>About</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to='/contact' 
                                onClick={() => setShowMenu(false)}
                                className={({ isActive }) => 
                                    `flex items-center py-4 px-4 rounded-lg text-lg font-medium transition-all duration-200 ${
                                        isActive 
                                            ? 'text-primary bg-blue-50 border-l-4 border-primary' 
                                            : 'text-gray-700 hover:text-primary hover:bg-gray-50 active:bg-gray-100'
                                    }`
                                }
                            >
                                <span className='ml-2'>📞</span>
                                <span className='ml-4'>Contact Us</span>
                            </NavLink>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    window.open('http://localhost:5174', '_blank');
                                    setShowMenu(false);
                                }}
                                className="flex items-center w-full py-4 px-4 rounded-lg text-lg font-medium transition-all duration-200 text-gray-700 hover:text-primary hover:bg-gray-50 active:bg-gray-100"
                            >
                                <span className='ml-2'>⚙️</span>
                                <span className='ml-4'>Admin Panel</span>
                            </button>
                        </li>
                    </ul>

                    {/* Simplified Profile Section (if logged in) - No User Info Display */}
                    {token ? (
                        <div className='pt-6 border-t border-gray-200'>
                            {/* Profile Actions Only */}
                            <div className='space-y-2'>
                                <button
                                    onClick={() => handleNavigation('/my-profile')}
                                    className='flex items-center w-full py-3 px-4 text-left text-gray-700 hover:text-primary hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-all duration-200'
                                >
                                    <span className='mr-3 text-lg'>👤</span>
                                    <span className='font-medium'>My Profile</span>
                                    <span className='ml-auto text-gray-400'>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </button>
                                <button
                                    onClick={() => handleNavigation('/my-appointments')}
                                    className='flex items-center w-full py-3 px-4 text-left text-gray-700 hover:text-primary hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-all duration-200'
                                >
                                    <span className='mr-3 text-lg'>📅</span>
                                    <span className='font-medium'>My Appointments</span>
                                    <span className='ml-auto text-gray-400'>
                                                                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </button>
                                <hr className='my-3 border-gray-200' />
                                <button
                                    onClick={handleLogout}
                                    className='flex items-center w-full py-3 px-4 text-left text-red-600 hover:text-red-700 hover:bg-red-50 active:bg-red-100 rounded-lg transition-all duration-200'
                                >
                                    <span className='mr-3 text-lg'>🚪</span>
                                    <span className='font-medium'>Logout</span>
                                    <span className='ml-auto text-red-400'>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Login Section for Non-Authenticated Users */
                        <div className='pt-6 border-t border-gray-200'>
                            <div className='text-center mb-4'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-2'>Welcome!</h3>
                                <p className='text-sm text-gray-600'>Sign in to access your profile and appointments</p>
                            </div>
                            <button 
                                onClick={() => handleNavigation('/login')}
                                className='w-full bg-primary text-white py-4 px-6 rounded-full font-medium text-base hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 shadow-lg mb-3'
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => handleNavigation('/register')}
                                className='w-full bg-transparent text-primary border-2 border-primary py-3 px-6 rounded-full font-medium text-base hover:bg-primary hover:text-white active:bg-primary/80 transition-all duration-200'
                            >
                                Create Account
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {showMenu && (
                <div 
                    className='md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300'
                    onClick={() => setShowMenu(false)}
                />
            )}
        </>
    )
}

export default Navbar
