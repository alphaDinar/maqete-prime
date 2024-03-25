'use client';
import Link from 'next/link';
import TopNav from '../components/TopNav/TopNav';
import styles from './orders.module.css';
import { pageHeader, sampleImg } from '@/External/lists';
import { useEffect, useState } from 'react';
import { collection, doc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { fireAuth, fireStoreDB } from '@/Firebase/base';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import { IoIosDoneAll } from 'react-icons/io';
import { MdArrowForward, MdOutlineDeliveryDining } from 'react-icons/md';
import { getTimeSince } from '@/External/services';
import TrackBox from '../components/TrackBox/TrackBox';
import Loading from '../components/Loading/Loading';

interface defType extends Record<string, any> { };
const Orders = () => {
  const [allOrders, setAllOrders] = useState<defType[]>([]);
  const [orders, setOrders] = useState<defType[]>([]);
  const [selectedChoice, setSelectedChoice] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStream = onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        const uid = user.uid;
        const ordersRef = collection(fireStoreDB, 'Orders/');
        const orderStream = onSnapshot(query(ordersRef, where("uid", "==", `${uid}`), orderBy("timestamp", "desc")), (snapshot) => {
          setAllOrders(snapshot.docs.map((order) => ({ id: order.id, ...order.data() })));
          setOrders(snapshot.docs.map((order) => ({ id: order.id, ...order.data() })));
          setIsLoading(false);
        });
        return () => orderStream();
      }
    });

    return () => authStream();
  }, [])

  const tabList = [
    { tag: 'All' },
    { tag: 'Active' },
    { tag: 'Completed' }
  ]

  const handleChoice = (val: string) => {
    setSelectedChoice(val);
    if (val === 'All') {
      setOrders(allOrders);
    } else if (val === 'Active') {
      const updatedOrders = [...allOrders].filter((el) => el.status === 0);
      setOrders(updatedOrders);
    } else if (val === 'Completed') {
      const updatedOrders = [...allOrders].filter((el) => el.status === 1);
      setOrders(updatedOrders);
    }
  }

  return (
    <main className="scroll">
      <TopNav />

      <section className={styles.orderBox} id='boxNoTop'>
        {pageHeader('My Orders', '/')}

        <article className={styles.tabBox}>
          {tabList.map((el, i) => (
            <legend onClick={() => handleChoice(el.tag)} className={el.tag === selectedChoice ? 'myTab' : 'tab'} key={i}>{el.tag}</legend>
          ))}
        </article>

        {!isLoading ?
          <section className={styles.orders}>
            {orders.map((order, i) => (
              <Link href={{ pathname: '/viewOrder', query: { oid: order.id } }} className={styles.order} key={i}>
                {order.status ?
                  <IoIosDoneAll style={{ background: 'var(--pass)' }} className={styles.tag} /> :
                  <MdOutlineDeliveryDining style={{ background: 'orange' }} className={styles.tag} />}
                <div className={styles.imgBox}>
                  {order.cart.slice(0, 2).map((item: defType, ii: number) => (
                    <div className={styles.item} key={ii}>
                      <Image alt='' className='contain' width={60} height={60} src={item.img} />
                      <sub className='cash'>{item.quantity}</sub>
                    </div>
                  ))}
                  <small>{order.cart.length - 2 > 0 && `${order.cart.length - 2} more`}</small>
                </div>
                <article>
                  <p>
                    <span className='cash'>{getTimeSince(order.timestamp)}</span>
                    <strong className='big'>GHS {order.total.toLocaleString()}</strong>
                    {order.status ?
                      <small style={{ color: 'gray' }}>Completed</small>
                      :
                      <small style={{ color: 'gray' }}>Being Delivered</small>
                    }
                  </p>
                  <MdArrowForward />
                </article>
              </Link>
            ))}
          </section>
          : <Loading />
        }
      </section>
    </main>
  );
}

export default Orders;