'use client';
import Link from 'next/link';
import TopNav from '../components/TopNav/TopNav';
// import styles from './orders.module.css';
import { pageHeader } from '@/External/lists';
import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { fireAuth, fireStoreDB } from '@/Firebase/base';
import { onAuthStateChanged } from 'firebase/auth';
import styles from './profile.module.css';
import { MdClose } from 'react-icons/md';
import { IoMdDoneAll } from 'react-icons/io';
import Loading from '../components/Loading/Loading';

interface defType extends Record<string, any> { };
const Profile = () => {
  const [username, setUsername] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');

  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [contactVerified, setContactVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStream = onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        const uid = user.uid;
        const customerStream = onSnapshot(doc(fireStoreDB, 'Customers/' + uid), (snapshot) => {
          const customerTemp: defType = ({ id: snapshot.id, ...snapshot.data() });
          setUsername(customerTemp.username);
          setContact(customerTemp.contact);
          setEmail(customerTemp.email);
          // setCustomer(customerTemp);
          setIsLoading(false);

          const blacklistRef = collection(fireStoreDB, 'Blacklist/');
          const blacklistStream = onSnapshot(blacklistRef, (snapshot) => {
            const blacklistTemp = snapshot.docs.map((con) => con.id);
            setBlacklist(blacklistTemp);
            if (blacklistTemp.includes(customerTemp.contact)) {
              setContactVerified(true);
            }
          });
          return () => blacklistStream();
        });

        return () => customerStream();
      }
    });
    return () => authStream();
  }, [])


  // const handleContact = (val: string) => {
  //   setContact(val);
  //   if (blacklist.includes(phoneCode + val)) {
  //     setContactExists(true);
  //   } else {
  //     setContactVerified(false);
  //   }
  // }

  return (
    <main className="scroll">
      <TopNav />

      <section className={styles.profileBox} id='boxNoTop'>
        {pageHeader('My Profile', '/')}

        {!isLoading ?
          <section className={styles.infoBox}>
            <div>
              <span>Username</span>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div>
              <span>Contact</span>
              <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
              {contactVerified ?
                <IoMdDoneAll />
                :
                <legend>Verify Contact <MdClose /></legend>
              }
            </div>

            <div>
              <span>E-mail</span>
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              {/* <legend>Verify Email <MdClose /></legend> */}
            </div>

            <button>Update</button>
          </section>
          : <Loading />
        }
      </section>
    </main>
  );
}

export default Profile;