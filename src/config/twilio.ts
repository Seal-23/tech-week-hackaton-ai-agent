
import Twilio from 'twilio';

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const twilio = Twilio(accountSid, authToken);

export default twilio;