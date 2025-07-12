import React, { useState, useContext, useEffect } from 'react'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const EditDoctor = ({ doctor, onClose, onSuccess }) => {
  const { updateDoctor } = useContext(AdminContext)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    speciality: 'Cardio Respiratory Physiotherapist',
    degree: '',
    experience: '1 Year',
    about: '',
    fees: '',
    address1: '',
    address2: '',
    available: true
  })
  const [docImg, setDocImg] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Speciality options
  const specialityOptions = [
    'Cardio Respiratory Physiotherapist',
    'Ortho Physiotherapist', 
    'Neuro Physiotherapist',
    'Geriatric Physiotherapist',
    'Pre And Post Surgery Rehabilitation',
    'Pediatric Physiotherapist'
  ]

  // Experience options
  const experienceOptions = [
    '1 Year', '2 Years', '3 Years', '4 Years', '5 Years',
    '6 Years', '7 Years', '8 Years', '9 Years', '10 Years'
  ]

  // Initialize form with doctor data
  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        speciality: doctor.speciality || 'Cardio Respiratory Physiotherapist',
        degree: doctor.degree || '',
        experience: doctor.experience || '1 Year',
        about: doctor.about || '',
        fees: doctor.fees || '',
        address1: doctor.address?.line1 || '',
        address2: doctor.address?.line2 || '',
        available: doctor.available !== undefined ? doctor.available : true
      })
      // Reset image state when doctor changes
      setDocImg(false)
    }
  }, [doctor])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isLoading) return
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return
    }
    if (!formData.fees || formData.fees <= 0) {
      toast.error('Valid fees amount is required')
      return
    }

    setIsLoading(true)

    try {
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        speciality: formData.speciality,
        degree: formData.degree.trim(),
        experience: formData.experience,
        about: formData.about.trim(),
        fees: Number(formData.fees),
        address: {
          line1: formData.address1.trim(),
          line2: formData.address2.trim()
        },
        available: formData.available
      }

      if (docImg) {
        updateData.image = docImg
      }

      const success = await updateDoctor(doctor._id, updateData)
      
      if (success) {
        onSuccess?.()
        onClose()
      }
    } catch (error) {
      console.error('Error updating doctor:', error)
      toast.error('Failed to update doctor profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          {/* Header */}
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-800'>Edit Doctor Profile</h2>
            <button 
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700 text-2xl font-bold'
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Profile Image Section */}
            <div className='flex items-center gap-4 mb-8 text-gray-500'>
              <label htmlFor="doc-img" className='cursor-pointer'>
                <img 
                  className='w-20 h-20 bg-gray-100 rounded-full object-cover border-2 border-gray-200' 
                  src={docImg ? URL.createObjectURL(docImg) : doctor?.image || '/api/placeholder/80/80'} 
                  alt="Doctor profile" 
                />
              </label>
              <input 
                onChange={(e) => setDocImg(e.target.files[0])} 
                type="file" 
                id="doc-img" 
                hidden 
                accept="image/*"
              />
              <div>
                <p className='font-medium text-gray-700'>Profile Picture</p>
                <p className='text-sm text-gray-500'>Click to update image</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              
              {/* Left Column */}
              <div className='space-y-4'>
                {/* Name */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Doctor Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    placeholder='Enter doctor name'
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    placeholder='Enter email address'
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    placeholder='Enter phone number'
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Experience *</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  >
                    {experienceOptions.map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>

                {/* Fees */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Consultation Fees *</label>
                  <input
                    type="number"
                    value={formData.fees}
                    onChange={(e) => handleInputChange('fees', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    placeholder='Enter fees in $'
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className='space-y-4'>
                {/* Speciality */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Speciality *</label>
                  <select
                    value={formData.speciality}
                    onChange={(e) => handleInputChange('speciality', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                  >
                    {specialityOptions.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Degree */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Education *</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => handleInputChange('degree', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    placeholder='Enter education qualification'
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Address *</label>
                  <input
                    type="text"
                    value={formData.address1}
                    onChange={(e) => handleInputChange('address1', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent mb-2'
                    placeholder='Address Line 1'
                    required
                  />
                  <input
                    type="text"
                    value={formData.address2}
                    onChange={(e) => handleInputChange('address2', e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                    placeholder='Address Line 2'
                    required
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Availability Status</label>
                  <div className='flex items-center gap-2'>
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) => handleInputChange('available', e.target.checked)}
                      className='w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded'
                    />
                    <span className={`font-medium ${formData.available ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.available ? 'Available for appointments' : 'Currently unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className='mt-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>About Doctor *</label>
              <textarea
                value={formData.about}
                onChange={(e) => handleInputChange('about', e.target.value)}
                rows={4}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
                placeholder='Write about the doctor...'
                required
              />
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4 mt-8 pt-6 border-t'>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className='flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50'
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 px-6 py-3 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isLoading && (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                )}
                {isLoading ? 'Updating...' : 'Update Doctor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditDoctor
