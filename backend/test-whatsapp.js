import whatsappService from './services/whatsappService.js';

// Test WhatsApp notification with sample data
const testWhatsAppNotification = async () => {
    console.log("🧪 Testing WhatsApp notification with new number...\n");
    
    // Sample user data
    const userData = {
        name: "Kunal Oberoi",
        phone: "+919876543210",
        email: "kunal@example.com"
    };
    
    // Sample doctor data
    const docData = {
        name: "Dr. Sharma",
        speciality: "Physiotherapy",
        fees: 500
    };
    
    // Sample appointment details
    const slotDate = "2025-07-15";
    const slotTime = "10:00 AM";
    
    try {
        const result = await whatsappService.sendAppointmentNotification(
            userData, 
            docData, 
            slotDate, 
            slotTime
        );
        
        console.log("📊 Test Results:");
        console.log("✅ Success:", result.success);
        console.log("📱 Target Number:", result.recipient);
        console.log("🔗 WhatsApp URL:", result.whatsappUrl);
        console.log("\n📝 Message Preview:");
        console.log(result.message);
        console.log("\n" + "=".repeat(80));
        
        if (result.whatsappUrl) {
            console.log("\n🚀 You can test this URL manually:");
            console.log(result.whatsappUrl);
        }
        
    } catch (error) {
        console.error("❌ Test failed:", error.message);
    }
};

// Run the test
testWhatsAppNotification();
