import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields (Name, Email, and Message)')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address')
      return
    }

    // Create email content
    const emailSubject = encodeURIComponent(`Contact Form: ${formData.subject || 'General Inquiry'}`)
    const emailBody = encodeURIComponent(`New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Subject: ${formData.subject || 'General Inquiry'}

Message:
${formData.message}

Sent from MyPhysioFriend Contact Form`)

    // Open email client
    const emailURL = `mailto:myphysiofrend@gmail.com?subject=${emailSubject}&body=${emailBody}`
    window.location.href = emailURL

    // Success message
    alert(`Thank you ${formData.name}! Your email client will open to send your message. We'll get back to you within 24 hours.`)
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  // WhatsApp chat function
  const handleWhatsAppChat = () => {
    const phoneNumber = '919138136007' // Indian number format for WhatsApp
    const message = encodeURIComponent('Hello! I need assistance with MyPhysioFriend services.')
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappURL, '_blank')
  }

  // Phone call function
  const handlePhoneCall = () => {
    const phoneNumber = '919138136007'
    window.location.href = `tel:+${phoneNumber}`
  }

  return (
    <div>
      {/* Contact Us Header */}
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>CONTACT <span className="text-gray-700 font-medium">US</span></p>
      </div>

      {/* Contact Content */}
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        
        {/* Contact Information */}
        <div className="flex flex-col justify-center items-start gap-6">
          <img className="w-full md:max-w-[360px] rounded-lg" src={assets.contact_image} alt="Contact Us" />
          
          <div className="flex flex-col gap-6 mt-6">
            <div>
              <p className="font-semibold text-lg text-gray-600">OUR OFFICE</p>
              <div className="flex items-start gap-3 mt-2">
                <span className="text-primary text-xl">📍</span>
                <div>
                  <p className="text-gray-500">Near Poonam Sweets,</p>
                  <p className="text-gray-500">Chawla Colony, Janta Colony,</p>
                  <p className="text-gray-500">Rohtak, Haryana 124001</p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold text-lg text-gray-600">CONTACT INFO</p>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-3">
                  <span className="text-primary text-xl">📞</span>
                  <p className="text-gray-500">Tel: +91 9138136007</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary text-xl">📱</span>
                  <p className="text-gray-500">Mobile: +91 9138136007</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary text-xl">✉️</span>
                  <p className="text-gray-500">Email: myphysiofrend@gmail.com</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500 text-xl">💬</span>
                  <p className="text-gray-500">WhatsApp: +91 9138136007</p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold text-lg text-gray-600">BUSINESS HOURS</p>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Monday - Friday:</span>
                  <span className="text-gray-600 font-medium">8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Saturday:</span>
                  <span className="text-gray-600 font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sunday:</span>
                  <span className="text-gray-600 font-medium">10:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold text-lg text-gray-600">EMERGENCY</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-red-500 text-xl">🚨</span>
                <div>
                  <p className="text-red-600 font-medium">24/7 Emergency Line</p>
                  <p className="text-red-500">+91 9138136007</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex flex-col gap-6 md:w-2/4">
          <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="appointment">Appointment Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Enter your message here..."
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-vertical"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center gap-2"
              >
                <span>✉️</span>
                Send Email
              </button>
            </form>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-md transition-all duration-300 cursor-pointer" onClick={handleWhatsAppChat}>
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-semibold text-gray-800 mb-2">WhatsApp Chat</h3>
              <p className="text-sm text-gray-600 mb-3">Get instant help via WhatsApp</p>
              <p className="text-xs text-gray-500 mb-3">+91 9138136007</p>
              <button className="text-green-600 font-medium hover:underline">Start WhatsApp Chat</button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center hover:shadow-md transition-all duration-300 cursor-pointer" onClick={handlePhoneCall}>
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-semibold text-gray-800 mb-2">Call Us</h3>
              <p className="text-sm text-gray-600 mb-3">Speak directly with our team</p>
              <p className="text-xs text-gray-500 mb-3">+91 9138136007</p>
              <button className="text-blue-600 font-medium hover:underline">Call Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16 px-4 rounded-lg mb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">Quick answers to common questions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">How do I book an appointment?</h3>
            <p className="text-gray-600 text-sm">Simply browse our doctors, select your preferred time slot, and confirm your booking. It's that easy!</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Can I cancel or reschedule?</h3>
            <p className="text-gray-600 text-sm">Yes, you can cancel or reschedule your appointment up to 24 hours before your scheduled time.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">What are your payment options?</h3>
            <p className="text-gray-600 text-sm">We accept all major credit cards, insurance plans, and offer flexible payment options.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Is my information secure?</h3>
            <p className="text-gray-600 text-sm">Absolutely! We use industry-standard encryption to protect all your personal and medical information.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
