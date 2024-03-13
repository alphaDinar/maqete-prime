'use client'
import axios from 'axios';
const Pay = () => {

  const stack = async () => {
    const url = "https://api.paystack.co/transaction/initialize";
    // const url = "https://api.paystack.co/transaction/charge_authorization"

    const data = {
      email: "customer@email.com",
      amount: "20000",
      callback_url: "https://hello.pstk.xyz/callback",
      metadata: { cancel_action: "https://your-cancel-url.com" }
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: 'Bearer sk_live_26f4e2ecef7ab554e0920ff99120f8144cb85a71',
        'Cache-Control': 'no-cache'
      }
    })
    console.log(response.data);
  }

  return (
    <button onClick={stack}>Payment</button>
  );
}

export default Pay;