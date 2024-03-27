'use client';
import { useEffect, useState } from "react";
import Panel from "../Panel/Panel";
import styles from './orders.module.css';
import { collection, onSnapshot } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import Image from "next/image";
import { MdDensitySmall, MdLocationPin, MdOutlinePending, MdOutlineVerified } from "react-icons/md";
import Link from "next/link";
import { getTimeSince } from "@/External/time";
import { sortByTime } from "@/External/sort";


interface defType extends Record<string, any> { };
const Orders = () => {
  const [allOrders, setAllOrders] = useState<defType[]>([]);
  const [orders, setOrders] = useState<defType[]>([]);
  const [status, setStatus] = useState<number>(5);
  const [payment, setPayment] = useState('');
  const [contact, setContact] = useState('');
  const [token, setToken] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const orderStream = onSnapshot(collection(fireStoreDB, 'Orders/'), (snapshot) => {
      setOrders(sortByTime(snapshot.docs.map((order) => ({ id: order.id, ...order.data() }))));
      setAllOrders(sortByTime(snapshot.docs.map((order) => ({ id: order.id, ...order.data() }))));
      setIsLoading(false);
    });

    return () => orderStream();
  }, [])

  const searchOrders = (contact: string, token: string, location: string) => {
    const ordersTemp = [...allOrders];
    const updatedOrders = ordersTemp.filter((el) => el.contact.toLowerCase().includes(contact.toLowerCase())).filter((el) => el.token.toLowerCase().includes(token.toLowerCase())).filter((el) => el.location.toLowerCase().includes(location.toLowerCase()));
    setOrders(updatedOrders);
  }

  const filterPayment = (pay: number) => {
    setPayment(pay.toString());
    if (status === 5) {
      setOrders(allOrders.filter((el) => el.paymentStatus === pay));
    } else {
      const ordersTemp = [...allOrders];
      const updatedOrders = ordersTemp.filter((el) => el.status === status).filter((el) => el.paymentStatus === pay);
      setOrders(updatedOrders);
    }
  }

  const filterStatus = (status: number) => {
    setStatus(status);
    if (status === 5) {
      setOrders(allOrders);
    } else {
      const ordersTemp = [...allOrders];
      const updatedOrders = ordersTemp.filter((el) => el.status === status);
      setOrders(updatedOrders);
    }
  }


  return (
    <Panel>
      {!isLoading ?
        <section className={styles.orderBox} id="frame">
          <header>
            <h3>Orders</h3>
            <div>
              <select value={payment} onChange={(e) => { filterPayment(parseInt(e.target.value)) }}>
                <option hidden>Payment</option>
                <option value="0">Unpaid</option>
                <option value="1">Paid</option>
              </select>
              <input type="text" placeholder="search Contact" value={contact} onChange={(e) => { setContact(e.target.value); searchOrders(e.target.value, token, location) }} />
              <input type="text" placeholder="search Token" value={token} onChange={(e) => { setToken(e.target.value); searchOrders(contact, e.target.value, location) }} />
              <input type="text" placeholder="search Location" value={location} onChange={(e) => { setLocation(e.target.value); searchOrders(contact, token, e.target.value) }} />
            </div>
          </header>

          <article className={styles.statusBox}>
            <legend onClick={() => filterStatus(5)}> <span><MdDensitySmall /> All</span>  <sub style={status === 5 ? { width: '100%' } : { width: '10px' }}></sub></legend>
            <legend onClick={() => filterStatus(0)}> <span><MdOutlinePending /> Pending</span>  <sub style={status === 0 ? { width: '100%' } : { width: '10px' }}></sub></legend>
            <legend onClick={() => filterStatus(1)}><span><MdOutlineVerified /> Completed</span><sub style={status === 1 ? { width: '100%' } : { width: '10px' }}></sub></legend>
          </article>

          <section className={styles.orders}>
            {orders.map((order, i) => (
              <Link key={i} href={{ pathname: '/manager/viewOrder', query: { oid: order.id } }} className={styles.order}>
                {order.status ?
                  <MdOutlineVerified className={styles.tag} style={{ background: 'var(--pass)' }} />
                  :
                  <MdOutlinePending className={styles.tag} style={{ background: 'tomato' }} />
                }
                <Image className="contain" alt="" src={order.cart[0].img} height={60} width={60} />
                <article>
                  <p className="cut"><MdLocationPin /> <span>{order.location}</span></p>
                  <span style={{ color: 'skyblue' }}>{order.token}</span>
                  <legend className="cash">{getTimeSince(order.timestamp)}</legend>
                  <strong className="cash">GHC {order.total.toLocaleString()}</strong>
                </article>
              </Link>
            ))}
          </section>

        </section>
        : <span>loading...</span>
      }
    </Panel>
  );
}

export default Orders;