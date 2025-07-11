import whatsappService from './services/whatsappService.js';

const testWhatsAppRedirect = async () => {
    console.log("🔍 Testing WhatsApp redirect functionality...\n");
    
    // Test data
    const userData = {
        name: "John Doe",
        phone: "+919876543210",
        email: "john@example.com"
    };
    
    const docData = {
        name: "Dr. Smith",
        speciality: "Physiotherapy",
        fees: 500
    };
    
    const result = await whatsappService.sendAppointmentNotification(
        userData, 
        docData, 
        "2025-07-15", 
        "2:00 PM"
    );
    
    console.log("📊 REDIRECT TEST RESULTS:");
    console.log("========================");
    console.log("✅ Target Number:", result.recipient);
    console.log("✅ WhatsApp URL:", result.whatsappUrl);
    console.log("\n🔍 URL Analysis:");
    
    if (result.whatsappUrl.includes('919138136007')) {
        console.log("✅ Correct number found in URL");
    } else {
        console.log("❌ Wrong number in URL!");
    }
    
    if (result.whatsappUrl.startsWith('https://wa.me/919138136007')) {
        console.log("✅ Perfect URL format for WhatsApp");
    } else {
        console.log("❌ URL format incorrect");
    }
    
    console.log("\n🚀 TEST THE URL:");
    console.log("Copy this URL and paste in browser:");
    console.log(result.whatsappUrl);
    
    // Also test if we can decode the message
    const urlParts = result.whatsappUrl.split('?text=');
    if (urlParts.length === 2) {
        const decodedMessage = decodeURIComponent(urlParts[1]);
        console.log("\n📝 Decoded message preview:");
        console.log(decodedMessage.substring(0, 200) + "...");
    }
};

testWhatsAppRedirect();
