'use client'
import Image from 'next/image';
import styles from './register.module.css';
// import logo from '../../../public/logo.png';
import { FcGoogle } from 'react-icons/fc';
import { MdArrowBack, MdClose } from 'react-icons/md';
import Link from 'next/link';
import { signInWithPopup } from 'firebase/auth';
import { fireAuth, fireStoreDB, googleProvider } from '@/Firebase/base';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Register = () => {
  const place = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708559399/maqete/laptop-shopping-bags-online-shopping-concept_1423-190_ckhywh.avif';
  const router = useRouter();

  const googleRegister = () => {
    signInWithPopup(fireAuth, googleProvider)
      .then(async (user) => {
        const username = user.user.displayName || 'Dashboard';
        const customer = await getDoc(doc(fireStoreDB, 'Customers/' + user.user.uid))
        if (customer !== undefined && customer.data() !== undefined) {
          router.push('/')
        } else {
          const cart = JSON.parse(sessionStorage.getItem('maqCart') || '[]');
          const wishList = JSON.parse(sessionStorage.getItem('maqWishList') || '[]');
          const keywords = JSON.parse(sessionStorage.getItem('maqKeywords') || '[]');
          setDoc(doc(fireStoreDB, 'Customers/' + user.user.uid), {
            cart: cart,
            wishList: wishList,
            orders: [],
            keywords: keywords,
            username: username,
            points: 0,
            balance: 0
          })
            .then(() => router.push('/'))
            .catch((error) => console.log(error));
        }
      })
  }

  return (
    <section className={styles.formBox}>
      <section className={styles.left}>
        <Image alt='' src={place} fill sizes='auto' />
      </section>
      <section className={styles.right}>
        <form>
          <header>
            <Link href={'/'}>
              <MdArrowBack />
            </Link>
            {/* <Image alt='' src={logo} height={100} width={100} /> */}
          </header>
          <section>
            <div>
              <span>Phone</span>
              <input type="text" name="" id="" />
            </div>
            <p>
              <legend>verify contact</legend>
              <sub>
                <MdClose />
              </sub>
            </p>
            <div>
              <span>Password</span>
              <input type="text" name="" id="" />
            </div>
            <div>
              <span>Confirm Password</span>
              <input type="text" name="" id="" />
            </div>
            <button>Register</button>
          </section>
          <footer>
            <FcGoogle onClick={googleRegister} />
          </footer>
          <Link href={'/login'}>
            <small>Do you already have an account? login here</small>
          </Link>
        </form>
      </section>
    </section>
  );
}

export default Register;