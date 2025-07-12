import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { DoctorContext } from '../../context/DoctorContext'
import { toast } from 'react-toastify'

const DoctorLogin = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setDToken, backendUrl } = useContext(DoctorContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            const response = await fetch(backendUrl + '/api/doctor/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (data.success) {
                localStorage.setItem('dToken', data.token)
                setDToken(data.token)
                toast.success('Doctor login successful!')
            } else {
                toast.error(data.message || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            toast.error('Something went wrong. Please try again.')
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'>
                    <span className='text-primary'>Doctor</span> Login
                </p>
                <div className='w-full'>
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className='border border-[#DADADA] rounded w-full p-2 mt-1'
                        type="email"
                        required
                    />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='border border-[#DADADA] rounded w-full p-2 mt-1'
                        type="password"
                        required
                    />
                </div>
                <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
                <p className='text-center w-full text-xs'>
                    Admin Login? <span className='text-primary underline cursor-pointer'>Click here</span>
                </p>
            </div>
        </form>
    )
}

export default DoctorLogin
