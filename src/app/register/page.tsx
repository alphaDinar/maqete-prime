'use client'
import { sendOTP, verifyOTP } from '@/External/arkesel';
import { makePassword } from '@/External/phoneBook';
import { checkContact } from '@/External/services';
import { fireAuth, fireStoreDB, googleProvider } from '@/Firebase/base';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { IoMdDoneAll } from 'react-icons/io';
import { MdArrowBack } from 'react-icons/md';
import logo from '../../../public/logo.png';
import { useCart } from '../contexts/cartContext';
import { useWishList } from '../contexts/wishListContext';
import styles from './register.module.css';
import { countryList } from '@/External/lists';
import { useAuthTarget } from '../contexts/authTargetContext';

const Register = () => {
  const place = "https://res.cloudinary.com/dvnemzw0z/image/upload/v1708567337/maqete/modern-stationary-collection-arrangement_23-2149309652_hkfbcn.jpg";
  const router = useRouter();
  const { cart } = useCart();
  const { wishList } = useWishList();
  const { authTarget } = useAuthTarget();

  const [formLoading, setFormLoading] = useState(false);

  const [contact, setContact] = useState('');
  const [phoneCode, setPhoneCode] = useState('233');
  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');


  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [contactExists, setContactExists] = useState(false);
  const [contactVerified, setContactVerified] = useState(false);
  const [passLength, setPassLength] = useState(0);
  const [passMatch, setPassMatch] = useState(false);



  useEffect(() => {
    const blacklistRef = collection(fireStoreDB, 'Blacklist/');
    const blacklistStream = onSnapshot(blacklistRef, (snapshot) => {
      setBlacklist(snapshot.docs.map((con) => con.id));
    });
    return () => blacklistStream();
  }, [])

  const googleRegister = () => {
    signInWithPopup(fireAuth, googleProvider)
      .then(async (user) => {
        const username = user.user.displayName || 'Dashboard';
        const customer = await getDoc(doc(fireStoreDB, 'Customers/' + user.user.uid))
        if (customer !== undefined && customer.data() !== undefined) {
          router.push(authTarget);
        } else {
          const keywords = JSON.parse(sessionStorage.getItem('maqKeywords') || '[]');
          setDoc(doc(fireStoreDB, 'Customers/' + user.user.uid), {
            cart: cart,
            email: user.user.email,
            contact: '',
            wishList: wishList,
            keywords: keywords,
            username: username,
            points: 0,
            balance: 0
          })
            .then(() => router.push(authTarget))
            .catch((error) => console.log(error));
        }
      })
  }

  const handleContact = (val: string) => {
    setContact(val);
    if (blacklist.includes(phoneCode + val)) {
      setContactExists(true);
    } else {
      setContactExists(false);
      setContactVerified(false);
    }
  }

  const handlePassword = (pass1: string, pass2: string) => {
    setPassword(pass1);
    setPassLength(pass1.length);
    setConPassword(pass2);

    if (pass1 === pass2) {
      setPassMatch(true);
    } else {
      setPassMatch(false);
    }
  }


  const runOTP = async () => {
    if (checkContact('+' + phoneCode + contact)) {
      const res = await sendOTP(phoneCode + contact);
      if (res.status === 200) {
        alert(`OTP sent to ${phoneCode + ' ' + contact}`);
      } else {
        alert('Please try again');
      }
    } else {
      console.log('z')
    }
  }

  const checkOTP = async () => {
    if (otp.length === 6) {
      const res = await verifyOTP(phoneCode + contact, otp);
      if (res.status === 200) {
        setContactVerified(true);
      } else {
        alert('wrong');
      }
    } else {
      console.log('zzz');
    }
  }

  const createCustomer = async () => {
    if (contactVerified && passLength && passMatch && !contactExists) {
      setFormLoading(true);
      const passKey = await makePassword(password);
      const email = phoneCode + contact + '@gmail.com';
      createUserWithEmailAndPassword(fireAuth, email, passKey)
        .then((user) => {
          const username = user.user.displayName || 'Dashboard';
          const keywords = JSON.parse(sessionStorage.getItem('maqKeywords') || '[]');
          const updatedContact = phoneCode + contact;
          setDoc(doc(fireStoreDB, 'Customers/' + user.user.uid), {
            cart: cart,
            email: '',
            contact: updatedContact,
            wishList: wishList,
            keywords: keywords,
            username: username,
            points: 0,
            balance: 0
          })
            .then(() => {
              setDoc(doc(fireStoreDB, 'Blacklist/' + contact), {})
                .then(() => addToPhoneAuth(passKey))
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
        })
    } else {
      setFormLoading(false);
      // alert('fail');
    }
  }

  const addToPhoneAuth = async (passKey: string) => {
    setDoc(doc(fireStoreDB, 'PhoneBook/' + phoneCode + contact), {
      contactKey: contact,
      passKey: passKey,
      contact: contact,
      password: passKey
    })
      .then(() => router.push(authTarget))
      .catch((error) => console.log(error));
  }

  return (
    <section className={styles.formBox}>
      <section className={styles.left}>
        <Image alt='' src={place} fill sizes='auto' />
        <div className={styles.statBox}>
          <p>
            {contactExists ?
              <span>Contact Already Exists</span>
              :
              <span>Contact Check</span>
            }
            <sub style={contactExists ? { background: 'tomato' } : { background: 'var(--pass)' }}></sub>
          </p>
          <p>
            <span>Password Strength | 6 char</span>
            <sub style={passLength > 5 ? { background: 'var(--pass)' } : { background: 'tomato' }}></sub>
          </p>
          <p>
            <span>Password Match</span>
            <sub style={passMatch ? { background: 'var(--pass)' } : { background: 'tomato' }}></sub>
          </p>
        </div>
      </section>
      <section className={styles.right}>
        <form onSubmit={(e) => e.preventDefault()}>
          <header>
            <Link href={'/'}>
              <MdArrowBack />
            </Link>
            <Image alt='' className='contain' src={logo} height={40} width={100} />
          </header>
          <section>
            <div>
              <span>Phone</span>
              <article className={styles.contactRow}>
                <select value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)}>
                  {countryList.map((item, i) => (
                    <option key={i} value={item.phoneCode}>
                      + {item.phoneCode}
                    </option>
                  ))}
                </select>
                <input type="text" value={contact} readOnly={contactVerified} onChange={(e) => handleContact(e.target.value)} />
              </article>
            </div>
            {!contactVerified &&
              <p>
                <legend onClick={runOTP}>Send OTP</legend>
              </p>
            }
            <p>
              {!contactVerified &&
                <input type="text" placeholder='OTP' style={{ width: 100, letterSpacing: '2px' }} value={otp} onChange={(e) => e.target.value.length < 7 && setOTP(e.target.value)} />
              }
              <sub onClick={checkOTP} style={contactVerified ? { background: 'var(--pass)' } : { background: 'tomato' }}>
                {contactVerified ?
                  <IoMdDoneAll />
                  :
                  <span>check</span>
                }
              </sub>
            </p>
            <div>
              <span>Password</span>
              <input type="password" className='cash' value={password} onChange={(e) => handlePassword(e.target.value, conPassword)} />
            </div>
            <div>
              <span>Confirm Password</span>
              <input type="password" className='cash' value={conPassword} onChange={(e) => handlePassword(password, e.target.value)} />
            </div>
            <p style={{ gap: '1rem' }}>
              <span>I accept the <Link href={'/terms'}>terms and conditions</Link></span>
              <input type="checkbox" required />
            </p>

            <button onClick={createCustomer}>
              {!formLoading ?
                <span>Register</span>
                :
                <legend className='miniLoader'>
                  <sub></sub>
                  <sub></sub>
                  <sub></sub>
                </legend>
              }
            </button>
          </section>
          <footer>
            <FcGoogle onClick={googleRegister} />
          </footer>

          <article style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem' }}>
            <Link href={'/login'}>
              <small>Do you already have an account? login here</small>
            </Link>

            <Link href={'/forgotPassword'}>
              <small style={{ color: 'tomato', fontWeight: 600 }}>Forgot Password? Reset here</small>
            </Link>
          </article>
        </form>
      </section>
    </section>
  );
}

export default Register;