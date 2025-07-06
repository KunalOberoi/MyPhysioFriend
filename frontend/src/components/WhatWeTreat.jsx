import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const WhatWeTreat = () => {
  const [activeTab, setActiveTab] = useState('conditions')
  const navigate = useNavigate()

  const handleBookAppointment = () => {
    navigate('/doctors')
    scrollTo(0, 0)
  }

  const handleLearnMore = () => {
    navigate('/about')
    scrollTo(0, 0)
  }

  const conditions = [
    {
      title: "Back Pain",
      description: "Chronic and acute back pain treatment",
      icon: "🦴"
    },
    {
      title: "Neck Pain",
      description: "Cervical spine and neck muscle issues",
      icon: "🦴"
    },
    {
      title: "Joint Pain",
      description: "Arthritis, joint stiffness and mobility issues",
      icon: "🦵"
    },
    {
      title: "Sports Injuries",
      description: "Athletic injuries and performance recovery",
      icon: "⚽"
    },
    {
      title: "Post-Surgery Recovery",
      description: "Rehabilitation after surgical procedures",
      icon: "🏥"
    },
    {
      title: "Neurological Conditions",
      description: "Stroke, Parkinson's, and nerve disorders",
      icon: "🧠"
    }
  ]

  const symptoms = [
    {
      title: "Chronic Pain",
      description: "Persistent pain lasting more than 3 months",
      icon: "😣"
    },
    {
      title: "Limited Mobility",
      description: "Difficulty in movement and daily activities",
      icon: "🚶‍♂️"
    },
    {
      title: "Muscle Weakness",
      description: "Reduced strength and muscle function",
      icon: "💪"
    },
    {
      title: "Balance Issues",
      description: "Difficulty maintaining stability and coordination",
      icon: "⚖️"
    },
    {
      title: "Stiffness",
      description: "Joint and muscle rigidity",
      icon: "🔒"
    },
    {
      title: "Swelling",
      description: "Inflammation and tissue swelling",
      icon: "🔴"
    }
  ]

  const therapies = [
    {
      title: "Manual Therapy",
      description: "Hands-on techniques for pain relief and mobility",
      icon: "👐"
    },
    {
      title: "Exercise Therapy",
      description: "Customized exercise programs for recovery",
      icon: "🏋️‍♂️"
    },
    {
      title: "Electrotherapy",
      description: "Electrical stimulation for pain and healing",
      icon: "⚡"
    },
    {
      title: "Hydrotherapy",
      description: "Water-based treatment and exercises",
      icon: "🏊‍♂️"
    },
    {
      title: "Dry Needling",
      description: "Trigger point therapy for muscle relief",
      icon: "📍"
    },
    {
      title: "Massage Therapy",
      description: "Therapeutic massage for relaxation and healing",
      icon: "💆‍♂️"
    }
  ]

  const services = [
    {
      title: "Initial Assessment",
      description: "Comprehensive evaluation and diagnosis",
      icon: "📋"
    },
    {
      title: "Treatment Planning",
      description: "Personalized treatment strategies",
      icon: "📝"
    },
    {
      title: "Home Exercise Programs",
      description: "Customized exercises for home practice",
      icon: "🏠"
    },
    {
      title: "Progress Monitoring",
      description: "Regular assessment and plan adjustments",
      icon: "📊"
    },
    {
      title: "Education & Prevention",
      description: "Patient education and injury prevention",
      icon: "🎓"
    },
    {
      title: "Follow-up Care",
      description: "Ongoing support and maintenance programs",
      icon: "🔄"
    }
  ]

  const getActiveData = () => {
    switch(activeTab) {
      case 'conditions': return conditions
      case 'symptoms': return symptoms
      case 'therapies': return therapies
      case 'services': return services
      default: return conditions
    }
  }

  const getTabTitle = () => {
    switch(activeTab) {
      case 'conditions': return 'Conditions We Treat'
      case 'symptoms': return 'Symptoms We Address'
      case 'therapies': return 'Therapies We Offer'
      case 'services': return 'Services We Provide'
      default: return 'Conditions We Treat'
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      {/* Header */}
      <h1 className="text-3xl font-medium">What We Treat</h1>
      <p className="sm:w-1/2 text-center text-sm text-gray-600">
        Comprehensive physiotherapy care for a wide range of conditions, symptoms, and rehabilitation needs
      </p>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mt-8 mb-8">
        <button
          onClick={() => setActiveTab('conditions')}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            activeTab === 'conditions'
              ? 'bg-primary text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Conditions
        </button>
        <button
          onClick={() => setActiveTab('symptoms')}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            activeTab === 'symptoms'
              ? 'bg-primary text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Symptoms
        </button>
        <button
          onClick={() => setActiveTab('therapies')}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            activeTab === 'therapies'
              ? 'bg-primary text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Therapies
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
            activeTab === 'services'
              ? 'bg-primary text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Services
        </button>
      </div>

      {/* Content Section */}
      <div className="w-full">
        <h2 className="text-2xl font-medium text-center mb-8 text-gray-800">
          {getTabTitle()}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-3 sm:px-0">
          {getActiveData().map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center bg-gradient-to-r from-primary/5 to-blue-50 p-8 rounded-2xl w-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Need Help with Your Condition?
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Our experienced physiotherapists are here to help you recover and get back to your best life. 
          Book an appointment today to start your journey to better health.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleBookAppointment}
            className="bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 hover:scale-105 transition-all duration-300 font-medium"
          >
            Book Appointment
          </button>
          <button 
            onClick={handleLearnMore}
            className="border border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-medium"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default WhatWeTreat
