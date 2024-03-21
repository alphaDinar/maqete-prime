// 'use client'
// import { getTimeLeft } from "@/External/services";
// import { useEffect, useState } from "react";

// const Test = () => {

//   useEffect(() => {
//     if (typeof window !== undefined) {
//       if ("Notification" in window) {
//         if (Notification.permission === 'granted') {
//           notify()
//         } else {
//           Notification.requestPermission()
//             .then((res) => {
//               if (res === 'granted') {
//                 notify()
//               } else if (res === 'denied') {
//                 alert('access denied');
//               } else if (res === 'default') {
//                 alert('not given');
//               }
//             })
//         }
//       }
//     }
//   }, [])


//   const notify = () => {
//     alert('panyin')
//     // const welcomeNotify = new Notification('Welcome To Maqete', {
//     //   body: 'Discover your style at Maqetee',
//     //   icon: 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1709062741/maqete/Favicon_light_bg_wlsqv7.png',
//     //   vibrate: [200, 100, 200]
//     // });

//     // welcomeNotify.addEventListener('click', () => {
//     //   window.open('https://maqete-prime.vercel.app/category?cid=Earbuds');
//     // })
//   }

//   return (
//     <section>
//       notify
//     </section>
//   );
// }

// export default Test;

'use client';

import { checkUser } from "@/External/phoneBook";
import { fireAuth } from "@/Firebase/base";
import { signOut } from "firebase/auth";


const Test = () => {
  const handleUser = async () => {
    // signOut(fireAuth);
    const isCorrect = await checkUser('233558420368', 'loverboy99');
    console.log(isCorrect);
  }

  return (
    <section>
      <button onClick={handleUser}>CHECK USER</button>
    </section>
  );
}

export default Test;