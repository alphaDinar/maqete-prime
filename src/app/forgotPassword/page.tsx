'use client'
import { sendOTP, verifyOTP } from '@/External/arkesel';
import { checkUser, makePassword } from '@/External/phoneBook';
import { checkContact } from '@/External/services';
import { fireStoreDB } from '@/Firebase/base';
import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IoMdDoneAll } from 'react-icons/io';
import { MdArrowBack } from 'react-icons/md';
import logo from '../../../public/logo.png';
import styles from '../register/register.module.css';
import { countryList } from '@/External/lists';
import { useAuthTarget } from '../contexts/authTargetContext';

const ForgotPassword = () => {
  const place = "https://res.cloudinary.com/dvnemzw0z/image/upload/v1708567337/maqete/modern-stationary-collection-arrangement_23-2149309652_hkfbcn.jpg";
  const router = useRouter();
  const { authTarget } = useAuthTarget();

  const [formLoading, setFormLoading] = useState(false);

  const [contact, setContact] = useState('');
  const [phoneCode, setPhoneCode] = useState('233');
  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');

  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [contactExists, setContactExists] = useState(false);
  const [contactVerified, setContactVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [passLength, setPassLength] = useState(0);


  useEffect(() => {
    const blacklistRef = collection(fireStoreDB, 'Blacklist/');
    const blacklistStream = onSnapshot(blacklistRef, (snapshot) => {
      setBlacklist(snapshot.docs.map((con) => con.id));
    });
    return () => blacklistStream();
  }, [])


  const handleContact = (val: string) => {
    setContact(val);
    if (blacklist.includes(phoneCode + val)) {
      setContactExists(true);
    } else {
      setContactExists(false);
      setContactVerified(false);
    }
  }

  const handlePassword = (pass1: string) => {
    setPassword(pass1);
    setPassLength(pass1.length);
  }


  const runOTP = async () => {
    if (contactExists) {
      if (checkContact('+' + phoneCode + contact)) {
        const res = await sendOTP(phoneCode + contact);
        if (res.status === 200) {
          alert(`OTP sent to ${contact}`);
        } else {
          alert('Please try again');
        }
      } else {
        console.log('z')
      }
    } else {
      alert("contact Doesn't Exist");
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

  const resetPassword = async () => {
    if (checkContact('+' + phoneCode + contact) && contact && password) {
      setErrorMessage(false);
      setFormLoading(true);
      const customer = await getDoc(doc(fireStoreDB, 'PhoneBook/' + phoneCode + contact));
      if (customer) {
        const newPassword = await makePassword(password);
        await updateDoc(doc(fireStoreDB, 'PhoneBook/' + phoneCode + contact), {
          password: newPassword,
        })
          .then(async () => {
            const isCorrect = await checkUser(phoneCode + contact, password);
            if (isCorrect) {
              router.push(authTarget);
            } else {
              setFormLoading(false);
              setErrorMessage(true);
            }
          })
          .catch((error) => console.log(error));
      }
    } else {
      setFormLoading(false);
    }
  }

  return (
    <section className={styles.formBox}>
      <section className={styles.left}>
        <Image alt='' src={place} fill sizes='auto' />
        <div className={styles.statBox}>
          <p>
            {contactExists ?
              <span>Contact Check</span>
              :
              <span>Contact Doesn&apos;t Exist</span>
            }
            <sub style={!contactExists ? { background: 'tomato' } : { background: 'var(--pass)' }}></sub>
          </p>
          <p>
            <span>Password Strength | 6 char</span>
            <sub style={passLength > 5 ? { background: 'var(--pass)' } : { background: 'tomato' }}></sub>
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
                <input type="text" readOnly={contactVerified} value={contact} onChange={(e) => handleContact(e.target.value)} />
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
            <div style={!contactVerified ? { opacity: 0.3 } : { opacity: 1 }}>
              <span>Password</span>
              <input type="password" readOnly={contactVerified ? false : true} className='cash' value={password} onChange={(e) => handlePassword(e.target.value)} />
            </div>

            <button onClick={resetPassword} style={!contactVerified ? { opacity: 0.3 } : { opacity: 1 }}>
              {!formLoading ?
                <span>Reset</span>
                :
                <legend className='miniLoader'>
                  <sub></sub>
                  <sub></sub>
                  <sub></sub>
                </legend>
              }
            </button>
          </section>

          <Link href={'/login'}>
            <small>Do you already have an account? login here</small>
          </Link>
        </form>
      </section>
    </section>
  );
}

export default ForgotPassword;