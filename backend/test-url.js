import whatsappService from './services/whatsappService.js';

// Test WhatsApp URL generation
const testWhatsAppURL = async () => {
    console.log("🧪 Testing WhatsApp URL generation...\n");
    
    // Sample data
    const userData = {
        name: "Test Patient",
        phone: "+919876543210",
        email: "test@example.com"
    };
    
    const docData = {
        name: "Dr. Test",
        speciality: "Physiotherapy",
        fees: 500
    };
    
    try {
        const result = await whatsappService.sendAppointmentNotification(
            userData, 
            docData, 
            "2025-07-15", 
            "10:00 AM"
        );
        
        console.log("📱 Target Number:", result.recipient);
        console.log("🔗 WhatsApp URL:", result.whatsappUrl);
        console.log("\n✅ URL Format Check:");
        
        if (result.whatsappUrl.includes('919138136007')) {
            console.log("✅ Correct number format in URL (without +)");
        } else {
            console.log("❌ Incorrect number format in URL");
        }
        
        if (result.whatsappUrl.startsWith('https://wa.me/919138136007')) {
            console.log("✅ Perfect WhatsApp URL format!");
        } else {
            console.log("❌ URL format needs fixing");
        }
        
    } catch (error) {
        console.error("❌ Test failed:", error.message);
    }
};

testWhatsAppURL();
