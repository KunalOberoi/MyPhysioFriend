import React, { useContext, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorConnectionTest = () => {

    const { backendUrl } = useContext(DoctorContext)
    const [testResults, setTestResults] = useState({})
    const [loading, setLoading] = useState(false)

    const runConnectionTests = async () => {
        setLoading(true)
        const results = {}

        // Test 1: Basic API connection
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/test')
            results.basicConnection = data.success ? 'Pass' : 'Fail'
        } catch (error) {
            results.basicConnection = 'Fail - ' + error.message
        }

        // Test 2: Doctor list endpoint
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            results.doctorList = data.success ? `Pass - ${data.doctors.length} doctors found` : 'Fail'
        } catch (error) {
            results.doctorList = 'Fail - ' + error.message
        }

        // Test 3: Doctor login with test credentials
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/login', {
                email: 'test@test.com',
                password: 'test123'
            })
            results.loginEndpoint = data.success ? 'Login Success' : 'Login Failed (Expected for test credentials)'
        } catch (error) {
            results.loginEndpoint = 'Endpoint Working - ' + (error.response?.data?.message || 'Invalid credentials expected')
        }

        // Test 4: Backend environment
        results.backendUrl = backendUrl
        results.timestamp = new Date().toLocaleString()

        setTestResults(results)
        setLoading(false)
        toast.success('Connection tests completed!')
    }

    return (
        <div className='m-5 max-w-4xl'>
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
                <h2 className='text-xl font-semibold mb-4'>Doctor Panel Connection Test</h2>
                
                <button 
                    onClick={runConnectionTests}
                    disabled={loading}
                    className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 mb-6'
                >
                    {loading ? 'Testing...' : 'Run Connection Tests'}
                </button>

                {Object.keys(testResults).length > 0 && (
                    <div className='space-y-4'>
                        <h3 className='text-lg font-medium'>Test Results:</h3>
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='border rounded-lg p-4'>
                                <h4 className='font-medium text-gray-700'>Basic API Connection</h4>
                                <p className={`text-sm ${testResults.basicConnection?.includes('Pass') ? 'text-green-600' : 'text-red-600'}`}>
                                    {testResults.basicConnection}
                                </p>
                            </div>

                            <div className='border rounded-lg p-4'>
                                <h4 className='font-medium text-gray-700'>Doctor List Endpoint</h4>
                                <p className={`text-sm ${testResults.doctorList?.includes('Pass') ? 'text-green-600' : 'text-red-600'}`}>
                                    {testResults.doctorList}
                                </p>
                            </div>

                            <div className='border rounded-lg p-4'>
                                <h4 className='font-medium text-gray-700'>Login Endpoint</h4>
                                <p className='text-sm text-blue-600'>
                                    {testResults.loginEndpoint}
                                </p>
                            </div>

                            <div className='border rounded-lg p-4'>
                                <h4 className='font-medium text-gray-700'>Backend URL</h4>
                                <p className='text-sm text-gray-600'>
                                    {testResults.backendUrl}
                                </p>
                            </div>
                        </div>

                        <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                            <h4 className='font-medium text-gray-700 mb-2'>Connection Status</h4>
                            <p className='text-sm text-gray-600'>
                                Last tested: {testResults.timestamp}
                            </p>
                            <div className='mt-2'>
                                {testResults.basicConnection?.includes('Pass') && testResults.doctorList?.includes('Pass') ? (
                                    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600'>
                                        ✅ Doctor Panel Connected Successfully
                                    </span>
                                ) : (
                                    <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600'>
                                        ❌ Connection Issues Detected
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className='mt-4 p-4 bg-blue-50 rounded-lg'>
                            <h4 className='font-medium text-blue-700 mb-2'>Available Doctors for Testing</h4>
                            <p className='text-sm text-blue-600'>
                                You can test doctor login using the credentials of doctors created through the admin panel.
                                Contact admin to get test doctor credentials.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DoctorConnectionTest
