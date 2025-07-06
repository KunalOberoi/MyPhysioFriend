import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const About = () => {
  const navigate = useNavigate()

  const handleBookAppointment = () => {
    navigate('/doctors')
    scrollTo(0, 0)
  }

  return (
    <div>
      {/* About Us Header */}
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>ABOUT <span className="text-gray-700 font-medium">US</span></p>
      </div>

      {/* About Us Content */}
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[360px]" src={assets.about_image} alt="About Us" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>Welcome to MyPhysioFriend, your trusted partner in managing your healthcare needs conveniently and efficiently. At MyPhysioFriend, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
          <p>MyPhysioFriend is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, MyPhysioFriend is here to support you every step of the way.</p>
          <b className="text-gray-800">Our Vision</b>
          <p>Our vision at MyPhysioFriend is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="text-xl my-4">
        <p>WHY <span className="text-gray-700 font-semibold">CHOOSE US</span></p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-20">
        <div className="flex-1 border border-gray-300 rounded-lg p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary text-xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">EFFICIENCY</h3>
          </div>
          <p className="text-gray-600 text-sm">Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>

        <div className="flex-1 border border-gray-300 rounded-lg p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary text-xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">CONVENIENCE</h3>
          </div>
          <p className="text-gray-600 text-sm">Access to a network of trusted healthcare professionals in your area.</p>
        </div>

        <div className="flex-1 border border-gray-300 rounded-lg p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary text-xl">👤</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">PERSONALIZATION</h3>
          </div>
          <p className="text-gray-600 text-sm">Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="text-xl my-4">
        <p>OUR <span className="text-gray-700 font-semibold">SERVICES</span></p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-20">
        <div className="flex-1 border border-gray-300 rounded-lg p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary text-xl">🏥</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Easy Appointment Booking</h3>
          </div>
          <p className="text-gray-600 text-sm">Book appointments with top-rated doctors in your area with just a few clicks. Our intuitive platform makes scheduling hassle-free.</p>
        </div>

        <div className="flex-1 border border-gray-300 rounded-lg p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary text-xl">👨‍⚕️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Verified Doctors</h3>
          </div>
          <p className="text-gray-600 text-sm">All our healthcare professionals are thoroughly verified and certified. You can trust that you're receiving care from qualified experts.</p>
        </div>

        <div className="flex-1 border border-gray-300 rounded-lg p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary text-xl">📱</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">24/7 Support</h3>
          </div>
          <p className="text-gray-600 text-sm">Our dedicated support team is available round the clock to assist you with any queries or concerns you may have.</p>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-primary/5 py-16 px-4 mb-20 rounded-lg">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">MyPhysioFriend by the Numbers</h2>
          <p className="text-gray-600">Trusted by thousands of patients nationwide</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-primary mb-2">10,000+</h3>
            <p className="text-gray-600">Happy Patients</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-primary mb-2">500+</h3>
            <p className="text-gray-600">Verified Doctors</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-primary mb-2">50+</h3>
            <p className="text-gray-600">Specialties</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-primary mb-2">24/7</h3>
            <p className="text-gray-600">Support Available</p>
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="text-center bg-gray-50 py-12 px-4 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6">Join thousands of satisfied patients who trust MyPhysioFriend for their healthcare needs.</p>
        <button 
          onClick={handleBookAppointment}
          className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300"
        >
          Book Your First Appointment
        </button>
      </div>
    </div>
  )
}

export default About
