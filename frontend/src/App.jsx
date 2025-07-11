import { Route, Routes } from "react-router-dom"
import { useContext } from "react"
import Home from "./pages/Home"
import Doctors from "./pages/Doctors"
import Login from "./pages/Login"
import About from "./pages/About"
import Contact from "./pages/Contact"
import MyProfile from "./pages/MyProfile"
import MyAppointments from "./pages/MyAppointments"
import Appointment from "./pages/Appointment"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Loading from "./components/Loading"
import ProtectedRoute from "./components/ProtectedRoute"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from "./context/AppContext"

const App = () => {
  const { isLoading } = useContext(AppContext)

  // Show loading screen while initializing app
  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/doctors" element={<Doctors/>}/>
        <Route path="/doctors/:speciality" element={<Doctors/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/my-profile" element={
          <ProtectedRoute>
            <MyProfile/>
          </ProtectedRoute>
        }/>
        <Route path="/my-appointments" element={
          <ProtectedRoute>
            <MyAppointments/>
          </ProtectedRoute>
        }/>
        <Route path="/appointment/:docId" element={
          <ProtectedRoute>
            <Appointment/>
          </ProtectedRoute>
        }/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
