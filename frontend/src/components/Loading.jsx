import React from 'react'

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading MyPhysioFriend...</h2>
        <p className="text-gray-500 mt-2">Please wait while we prepare your experience</p>
      </div>
    </div>
  )
}

export default Loading
