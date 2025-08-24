import WhatsApp from "../interfaces/whatsapp";
import Twilio from "../config/twilio";

class TwilioWhatsApp extends WhatsApp {

    client: typeof Twilio

    constructor() {
        super();
        this.client = Twilio
    }

    async sendMesagge(message: string, config: { from: string, to: number }) {
        try {
            const response = await this.client.messages.create({
                body: message,
                from: `whatsapp:+${config.from}`,
                to: `whatsapp:+${config.to}`,
            });
            return !!response.sid;

        } catch (error) {
            console.error("Error enviando mensaje con Twilio:", error);
            return false;
        }
    }
}

export default TwilioWhatsApp;