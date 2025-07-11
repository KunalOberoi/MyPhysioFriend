import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

/**
 * User profile page – view and edit user information from backend API.
 * Updated to use AppContext and backend connectivity for real user data.
 */

const MyProfile = () => {
  const { userData, updateProfile, isLoggedIn, token, backendUrl, logout } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: ''
    },
    gender: '',
    dob: '',
    image: null
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  /* ────────────────────────────────────────────────────────────────────────
   * Load user data from AppContext when the component mounts
   * ──────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isLoggedIn() || !token) {
      navigate('/login');
      return;
    }

    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || { line1: '', line2: '' },
        gender: userData.gender || '',
        dob: userData.dob || '',
        image: null // This will be for new image uploads
      });
    }
  }, [userData, isLoggedIn, token, navigate]);

  /* ────────────────────────────────────────────────────────────────────────
   * Helpers
   * ──────────────────────────────────────────────────────────────────────── */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'line1' || name === 'line2') {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!formData.name.trim()) {
        toast.error('Name is required');
        return;
      }

      if (!formData.email.trim()) {
        toast.error('Email is required');
        return;
      }

      // Use the updateProfile function from AppContext
      const result = await updateProfile(formData);
      
      if (result.success) {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || { line1: '', line2: '' },
        gender: userData.gender || '',
        dob: userData.dob || '',
        image: null
      });
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  // Navigation handlers with scroll to top
  const handleMyAppointments = () => {
    navigate('/my-appointments');
    window.scrollTo(0, 0);
  };

  const handleFindDoctors = () => {
    navigate('/doctors');
    window.scrollTo(0, 0);
  };

  /* ────────────────────────────────────────────────────────────────────────
   * Render
   * ──────────────────────────────────────────────────────────────────────── */
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative cursor-pointer hover:scale-105 transition-transform duration-300" onClick={handleImageClick}>
            <img
              src={
                formData.image 
                  ? URL.createObjectURL(formData.image)
                  : userData?.image 
                    ? (userData.image.startsWith('http') || userData.image.startsWith('data:') 
                        ? userData.image 
                        : `${backendUrl}/${userData.image}`)
                    : assets.profile_pic || 'https://via.placeholder.com/120'
              }
              alt="Profile"
              className={`w-24 h-24 rounded-full object-cover border-4 border-primary/20 ${isEditing ? 'ring-2 ring-primary' : ''}`}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/120';
              }}
            />
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                <span className="text-white text-sm">Change</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{userData?.name || 'Loading...'}</h1>
            <p className="text-gray-600 mb-3">{userData?.email || 'Loading...'}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              {userData?.verified && (
                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  ✓ Verified Account
                </span>
              )}
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                📧 Email Account
              </span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">👤</span>
            Personal Information
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary/50 transition-colors duration-300"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary/50 transition-colors duration-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary/50 transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary/50 transition-colors duration-300"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </form>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">📞</span>
            Contact Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary/50 transition-colors duration-300"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <div className="space-y-3">
                <input
                  name="line1"
                  value={formData.address.line1}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary/50 transition-colors duration-300"
                  placeholder="Address Line 1"
                />
                <input
                  name="line2"
                  value={formData.address.line2}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600 hover:border-primary/50 transition-colors duration-300"
                  placeholder="Address Line 2 (Optional)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">⚙️</span>
          Account
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleMyAppointments}
            className="flex items-center justify-center px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 hover:scale-105 hover:shadow-md transition-all duration-300"
          >
            <span className="mr-2">📅</span>
            My Appointments
          </button>
          <button
            onClick={handleFindDoctors}
            className="flex items-center justify-center px-6 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 hover:scale-105 hover:shadow-md transition-all duration-300"
          >
            <span className="mr-2">🩺</span>
            Find Doctors
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

