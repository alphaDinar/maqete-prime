import axios from 'axios';
export const createPayLink = async () => {
  const url = "https://api.paystack.co/transaction/initialize";

  const data = {
    email: "customer@email.com",
    amount: "20000",
    callback_url: "http://localhost:3000/orders",
    metadata: { cancel_action: "https://maqete-prime.vercel.app/checkout" }
  };

  const response = await axios.post(url, data, {
    headers: {
      Authorization: 'Bearer sk_test_265acb9b86de46afa9b166773bf933aa4edb8438',
      // Authorization: 'Bearer sk_live_26f4e2ecef7ab554e0920ff99120f8144cb85a71',
      'Cache-Control': 'no-cache'
    }
  })
  const payObj = {
    link: response.data.data.authorization_url,
    ref: response.data.data.reference
  }

  return payObj;
}