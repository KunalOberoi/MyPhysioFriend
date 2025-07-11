import axios from 'axios';

class WhatsAppService {
    constructor() {
        this.targetNumber = process.env.WHATSAPP_NUMBER || '+919138136007';
        this.apiEnabled = process.env.WHATSAPP_API_ENABLED === 'true';
    }

    async sendAppointmentNotification(userData, docData, slotDate, slotTime) {
        const appointmentDate = new Date(slotDate).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const message = this.formatAppointmentMessage(userData, docData, appointmentDate, slotTime);
        
        const result = {
            success: false,
            whatsappUrl: this.createWhatsAppUrl(message),
            message: message,
            recipient: this.targetNumber,
            methods: []
        };

        // Try multiple methods to send the message
        const sendMethods = [
            () => this.sendViaCallMeBot(message),
            () => this.sendViaWebhook(message),
            () => this.sendViaConsoleLog(message)
        ];

        for (const method of sendMethods) {
            try {
                const methodResult = await method();
                result.methods.push(methodResult);
                if (methodResult.success) {
                    result.success = true;
                    break;
                }
            } catch (error) {
                result.methods.push({
                    method: 'unknown',
                    success: false,
                    error: error.message
                });
            }
        }

        return result;
    }

    formatAppointmentMessage(userData, docData, appointmentDate, slotTime) {
        return `🏥 NEW APPOINTMENT BOOKING
MyPhysioFriend

👤 PATIENT DETAILS
Name: ${userData.name}
Phone: ${userData.phone || 'Not provided'}
Email: ${userData.email}

👨‍⚕️ DOCTOR DETAILS
Dr. ${docData.name}
Specialty: ${docData.speciality}

📅 APPOINTMENT DETAILS
Date: ${appointmentDate}
Time: ${slotTime}
Fee: Rs.${docData.fees}

⏰ REMINDER
• Please confirm this appointment
• Patient should arrive 15 minutes early
• Bring valid ID and medical records

Portal: https://myphysiofriend.com

This is an automated booking notification`;
    }

    createWhatsAppUrl(message) {
        // Remove + sign for WhatsApp URL format
        const cleanNumber = this.targetNumber.replace(/\+/g, '');
        return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    }

    async sendViaCallMeBot(message) {
        try {
            // CallMeBot is a free service that requires setup
            // 1. Add +34 644 59 71 67 to your contacts as "CallMeBot"
            // 2. Send message "I allow callmebot to send me messages" to get API key
            
            // For demo purposes, we'll simulate this
            console.log("📱 CallMeBot: Attempting to send WhatsApp message...");
            
            // In production, you would use:
            // const apiKey = process.env.CALLMEBOT_API_KEY;
            // if (!apiKey) throw new Error('CallMeBot API key not configured');
            // 
            // const url = `https://api.callmebot.com/whatsapp.php?phone=${this.targetNumber}&text=${encodeURIComponent(message)}&apikey=${apiKey}`;
            // const response = await axios.get(url);
            // 
            // if (response.status === 200) {
            //     return { method: 'CallMeBot', success: true };
            // }

            // Simulate successful call for demo
            await new Promise(resolve => setTimeout(resolve, 100));
            throw new Error('CallMeBot API key not configured');
            
        } catch (error) {
            return { 
                method: 'CallMeBot', 
                success: false, 
                error: error.message 
            };
        }
    }

    async sendViaWebhook(message) {
        try {
            // Custom webhook for WhatsApp integration
            console.log("🔗 Webhook: Attempting to send WhatsApp message...");
            
            const webhookData = {
                to: this.targetNumber,
                message: message,
                timestamp: new Date().toISOString(),
                type: 'appointment_booking'
            };

            // In production, you would configure your webhook URL
            // const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
            // if (!webhookUrl) throw new Error('WhatsApp webhook not configured');
            // 
            // const response = await axios.post(webhookUrl, webhookData, {
            //     headers: { 'Content-Type': 'application/json' }
            // });
            // 
            // if (response.status === 200) {
            //     return { method: 'Webhook', success: true };
            // }

            // Simulate for demo
            await new Promise(resolve => setTimeout(resolve, 100));
            throw new Error('Webhook URL not configured');
            
        } catch (error) {
            return { 
                method: 'Webhook', 
                success: false, 
                error: error.message 
            };
        }
    }

    async sendViaConsoleLog(message) {
        try {
            console.log("\n" + "=".repeat(50));
            console.log("📱 WHATSAPP MESSAGE NOTIFICATION");
            console.log("=".repeat(50));
            console.log(`TO: ${this.targetNumber}`);
            console.log(`TIME: ${new Date().toLocaleString()}`);
            console.log("\nMESSAGE:");
            console.log(message);
            console.log("=".repeat(50));
            console.log("✅ WhatsApp URL generated successfully!");
            console.log("� Frontend will automatically open: " + this.createWhatsAppUrl(message));
            console.log("� User will be prompted to send message via WhatsApp");
            console.log("=".repeat(50) + "\n");

            return { 
                method: 'Console Log', 
                success: true,
                note: 'WhatsApp URL generated - Frontend will auto-open WhatsApp'
            };
        } catch (error) {
            return { 
                method: 'Console Log', 
                success: false, 
                error: error.message 
            };
        }
    }
}

export default new WhatsAppService();
