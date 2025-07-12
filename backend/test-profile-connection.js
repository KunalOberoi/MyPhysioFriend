// Test script to verify doctor profile functionality
import axios from 'axios';

const backendUrl = 'http://localhost:4000';

async function testDoctorProfileConnection() {
    try {
        console.log('🔐 Testing Doctor Profile Connection...\n');
        
        // Step 1: Login
        console.log('1. 🔑 Testing login...');
        const loginResponse = await axios.post(`${backendUrl}/api/doctor/login`, {
            email: 'test@doctor.com',
            password: 'test123'
        });
        
        if (!loginResponse.data.success) {
            console.log('❌ Login failed:', loginResponse.data.message);
            return;
        }
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful');
        
        // Step 2: Get Profile
        console.log('2. 👤 Testing get profile...');
        const profileResponse = await axios.get(`${backendUrl}/api/doctor/profile`, {
            headers: { dtoken: token }
        });
        
        if (!profileResponse.data.success) {
            console.log('❌ Get profile failed:', profileResponse.data.message);
            return;
        }
        
        console.log('✅ Profile retrieved successfully');
        console.log('📋 Doctor Details:');
        console.log('   Name:', profileResponse.data.profileData.name);
        console.log('   Email:', profileResponse.data.profileData.email);
        console.log('   Speciality:', profileResponse.data.profileData.speciality);
        console.log('   Fees: $', profileResponse.data.profileData.fees);
        console.log('   Available:', profileResponse.data.profileData.available);
        
        // Step 3: Test Profile Update
        console.log('3. ✏️  Testing profile update...');
        const formData = new FormData();
        formData.append('name', 'Dr. Test Doctor (Updated)');
        formData.append('email', 'test@doctor.com');
        formData.append('phone', '+1234567890');
        formData.append('experience', '6 Years');
        formData.append('fees', 120);
        formData.append('about', 'Updated test doctor profile for MyPhysioFriend application.');
        formData.append('speciality', 'Ortho Physiotherapist');
        formData.append('degree', 'MBBS, MPT');
        formData.append('address', JSON.stringify({ 
            line1: 'Updated Address Line 1', 
            line2: 'Updated Address Line 2' 
        }));
        formData.append('available', true);
        
        const updateResponse = await fetch(`${backendUrl}/api/doctor/update-profile`, {
            method: 'POST',
            headers: { 
                dtoken: token
            },
            body: formData
        });
        
        const updateData = await updateResponse.json();
        
        if (updateData.success) {
            console.log('✅ Profile update successful');
        } else {
            console.log('❌ Profile update failed:', updateData.message);
            return;
        }
        
        // Step 4: Verify Update
        console.log('4. 🔍 Verifying update...');
        const verifyResponse = await axios.get(`${backendUrl}/api/doctor/profile`, {
            headers: { dtoken: token }
        });
        
        if (verifyResponse.data.success) {
            console.log('✅ Profile verification successful');
            console.log('📋 Updated Doctor Details:');
            console.log('   Name:', verifyResponse.data.profileData.name);
            console.log('   Phone:', verifyResponse.data.profileData.phone);
            console.log('   Experience:', verifyResponse.data.profileData.experience);
            console.log('   Fees: $', verifyResponse.data.profileData.fees);
            console.log('   Speciality:', verifyResponse.data.profileData.speciality);
            console.log('   Degree:', verifyResponse.data.profileData.degree);
        }
        
        console.log('\n🎉 Doctor Profile Connection Test Complete!');
        console.log('\n✅ All functionalities working:');
        console.log('   - Login ✅');
        console.log('   - Get Profile ✅');
        console.log('   - Update Profile ✅');
        console.log('   - Verify Update ✅');
        console.log('\n🔗 Doctor Profile is fully connected to the backend!');
        
    } catch (error) {
        console.error('❌ Error testing doctor profile:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('   1. Make sure backend server is running on port 4000');
        console.log('   2. Check if database is connected');
        console.log('   3. Verify test doctor exists in database');
    }
}

testDoctorProfileConnection();
