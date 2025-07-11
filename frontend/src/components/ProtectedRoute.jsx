import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Loading from './Loading'

const ProtectedRoute = ({ children }) => {
  const { token, userData, isLoading } = useContext(AppContext)

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />
  }

  // Redirect to login if not authenticated
  if (!token || !userData) {
    return <Navigate to="/login" replace />
  }

  // Render the protected component
  return children
}

export default ProtectedRoute
