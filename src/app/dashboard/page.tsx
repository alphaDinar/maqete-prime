'use client';
import { IoIosNotificationsOutline, IoMdTrophy } from "react-icons/io";
import Panel from "./Panel/Panel";
import styles from './dashboard.module.css';
import Link from "next/link";
import { MdArrowForward, MdBolt, MdNorthEast, MdOutlineFavoriteBorder, MdOutlinePending, MdOutlineShoppingCart } from "react-icons/md";
import { GiDiamondTrophy, GiWallet } from "react-icons/gi";
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import Products from "../components/Products/Products";
import { collection, doc, onSnapshot, query, limit, orderBy } from 'firebase/firestore';
import { fireAuth, fireStoreDB } from '@/Firebase/base';
import { onAuthStateChanged } from 'firebase/auth';

interface defType extends Record<string, any> { };
const Dashboard = () => {
  const sample = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708791507/maqete/samp_kqdepy.png';
  const sample2 = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708567337/maqete/modern-stationary-collection-arrangement_23-2149309652_hkfbcn.jpg';
  const air = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708567577/maqete/MPNY3-removebg-preview_o1rd8i.png'

  const avatar = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708985590/maqete/save_key_mjbtko.jpg';


  const [uid, setUid] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<defType[]>([]);

  const [customer, setCustomer] = useState<defType>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(fireStoreDB, 'Products/');

    const productStream = onSnapshot(query(productsRef, orderBy("priority", "desc"), limit(6)), (snapshot) => {
      setProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
    });

    const authStream = onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        setUid(user.uid);
        setDisplayName(user.displayName || user.email || 'Dashboard');

        const customerStream = onSnapshot(doc(fireStoreDB, 'Customers/' + user.uid), (snapshot) => {
          const customerTemp: defType = ({ id: snapshot.id, ...snapshot.data() });
          localStorage.setItem('maqCustomer', '1');
          // localStorage.setItem('maqCart', JSON.stringify(customerTemp.cart));
          // localStorage.setItem('maqWishList', JSON.stringify(customerTemp.wishList));
          // localStorage.setItem('maqKeywords', JSON.stringify(customerTemp.keywords));
          setIsLoading(false);
          setIsLoggedIn(true);
          setCustomer(customerTemp);
        });
        return () => customerStream();
      } else {
        localStorage.removeItem('maqCustomer');
        setIsLoading(false);
        console.log('logged Out');
      }
    });

    return () => {
      authStream()
      productStream();
    }
  }, [])


  return (
    <Panel>
      {!isLoading ?
        <section className={styles.conBox}>
          <section className={styles.header}>
            <nav className={styles.controlBox}>
              <article>
                <Link href={'/wishList'}>
                  <MdOutlineFavoriteBorder />
                  <legend>{customer.wishList.length}</legend>
                </Link>
                <Link href={'/cart'}>
                  <MdOutlineShoppingCart />
                  <legend>{customer.cart.length}</legend>
                </Link>
                <Link href={'/wishList'}>
                  <IoIosNotificationsOutline />
                  <legend>{customer.cart.length}</legend>
                </Link>
              </article>

              <span>|</span>

              <div>
                <Link href={'/profile'}>
                  <Image alt="" className="cover" src={avatar} width={35} height={35} />
                  <span>Hi Omar</span>
                </Link>
              </div>
            </nav>
          </section>

          <section className={styles.con}>
            <section className={styles.top}>
              <section className={styles.recentBox}>
                <header>
                  <Link href={'/allPromos'}>Recent Orders <MdArrowForward /></Link>
                </header>
                <ul>
                  {Array(3).fill('a').map((order, i) => (
                    <Link href={''} key={i}>
                      <MdBolt className={styles.tag} />
                      <Image className="contain" alt="" src={air} width={150} height={150} />
                      <article>
                        <strong className="cash">GHS 4,000</strong>
                        <legend>30 mins ago</legend>
                      </article>
                      <button>
                        <MdArrowForward />
                      </button>
                    </Link>
                  ))}
                </ul>
              </section>
              <section className={styles.right}>
                <header><Link href={'/allPromos'}>More Promos <MdArrowForward /></Link></header>
                <section>
                  {Array(2).fill('').map((promo, i) => (
                    <Link href={''} className={styles.promo} key={i}>
                      <Image className="contain" alt="" height={120} width={120} src={sample} />
                      <article>
                        <h2>Samsung A24</h2>
                        <div className={styles.price}>
                          <strong className="big cancel">GHS 4,000</strong> <strong className="big" style={{ color: 'black' }}>GHS 4,000</strong>
                        </div>

                        <legend className="timeBox">
                          <p>
                            <span>15</span>
                            <small>Days</small>
                          </p>
                          <p>
                            <span>10</span>
                            <small>Hours</small>
                          </p>
                          <p>
                            <span>30</span>
                            <small>Mins</small>
                          </p>
                          <p>
                            <span>25</span>
                            <small>Secs</small>
                          </p>
                        </legend>
                      </article>
                      <MdArrowForward />
                    </Link>
                  ))}

                </section>
              </section>
            </section>

            <section className={styles.trending}>
              <Products productList={JSON.stringify(products)} isLoading={isLoading} />
            </section>
          </section>
        </section>
        : <span>Loading</span>
      }
    </Panel>
  );
}

export default Dashboard;