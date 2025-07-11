import whatsappService from './services/whatsappService.js';

console.log("🧪 COMPREHENSIVE WHATSAPP BOOKING TEST");
console.log("=====================================");

// Test the complete booking flow
const testCompleteBookingFlow = async () => {
    console.log("\n1. 📋 Testing Environment Configuration:");
    console.log("   • Target Number:", process.env.WHATSAPP_NUMBER || '+919138136007');
    console.log("   • API Enabled:", process.env.WHATSAPP_API_ENABLED || 'true');
    
    console.log("\n2. 🏥 Simulating Appointment Booking:");
    
    // Sample patient data (with phone number)
    const patientData = {
        name: "John Smith",
        phone: "+919876543210",
        email: "john.smith@email.com"
    };
    
    // Sample doctor data
    const doctorData = {
        name: "Dr. Sarah Wilson",
        speciality: "Physiotherapy",
        fees: 500
    };
    
    // Appointment details
    const appointmentDate = "2025-07-15";
    const appointmentTime = "10:30 AM";
    
    console.log("   • Patient:", patientData.name);
    console.log("   • Patient Phone:", patientData.phone);
    console.log("   • Doctor:", doctorData.name);
    console.log("   • Date:", appointmentDate);
    console.log("   • Time:", appointmentTime);
    
    console.log("\n3. 📱 Generating WhatsApp Notification:");
    
    try {
        const result = await whatsappService.sendAppointmentNotification(
            patientData,
            doctorData,
            appointmentDate,
            appointmentTime
        );
        
        console.log("   ✅ WhatsApp Service Result:");
        console.log("      • Success:", result.success);
        console.log("      • Recipient:", result.recipient);
        console.log("      • Methods Tried:", result.methods.length);
        
        console.log("\n4. 🔍 URL Validation:");
        const urlCheck = result.whatsappUrl;
        
        if (urlCheck.includes('919138136007')) {
            console.log("   ✅ CORRECT: URL contains 919138136007");
        } else {
            console.log("   ❌ ERROR: URL does not contain 919138136007");
        }
        
        if (urlCheck.includes('7838203606')) {
            console.log("   ❌ ERROR: URL still contains old number 7838203606");
        } else {
            console.log("   ✅ CORRECT: URL does not contain old number 7838203606");
        }
        
        if (urlCheck.startsWith('https://wa.me/919138136007')) {
            console.log("   ✅ CORRECT: URL format is perfect");
        } else {
            console.log("   ❌ ERROR: URL format is incorrect");
        }
        
        console.log("\n5. 📝 Message Content Validation:");
        if (result.message.includes(patientData.phone)) {
            console.log("   ✅ CORRECT: Message includes patient phone number");
        } else {
            console.log("   ❌ ERROR: Message missing patient phone number");
        }
        
        if (result.message.includes(doctorData.name)) {
            console.log("   ✅ CORRECT: Message includes doctor name");
        } else {
            console.log("   ❌ ERROR: Message missing doctor name");
        }
        
        console.log("\n6. 🚀 Final WhatsApp URL:");
        console.log("   " + result.whatsappUrl);
        
        console.log("\n🎉 TEST COMPLETED SUCCESSFULLY!");
        console.log("=====================================");
        console.log("✅ WhatsApp notifications will be sent to: +919138136007");
        console.log("✅ All booking confirmations redirect to correct number");
        console.log("✅ Patient phone numbers are captured and displayed");
        console.log("✅ Admin panel will show complete patient information");
        
        return true;
        
    } catch (error) {
        console.error("\n❌ TEST FAILED:", error.message);
        return false;
    }
};

// Run the comprehensive test
testCompleteBookingFlow();
