import axios from "axios";

const headers = {
  'api-key': 'Z2ROSXNnamNqckFMc2NQdGtLQmk',
  'Content-Type': 'application/json',
};


export const sendOTP = async (contact: string) => {
  const url = 'https://sms.arkesel.com/api/otp/generate';
  const payload = {
    "expiry": 10,
    "length": 6,
    "medium": "sms",
    "message": "%otp_code%, Your Maq OTP Expires in 10 mins",
    "number": '233558420368',
    "sender_id": "Super Mc",
    "type": "numeric"
  }

  const response = await axios.post(url, payload, { headers });
  return response;
}


export const verifyOTP = async (contact: string, code: string) => {
  const url = 'https://sms.arkesel.com/api/otp/verify';
  const payload = { "code": code, "number": contact };
  const response = await axios.post(url, payload, { headers });
  return response;
}