'use client';
import { MdArrowBack, MdCall, MdMailOutline, MdOutlineSelfImprovement } from "react-icons/md";
import Panel from "../Panel/Panel";
import styles from './viewOrder.module.css';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getOrderDeadline, getRealDate } from "@/External/services";
import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";

interface defType extends Record<string, any> { };
const ViewOrder = ({ searchParams }: { searchParams: { oid: string } }) => {
  const router = useRouter();
  const oid = searchParams.oid;
  const [order, setOrder] = useState<defType>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getOrderStream = onSnapshot(doc(fireStoreDB, 'Orders/' + oid), (order) => {
      setOrder({ id: order.id, ...order.data() });
      console.log(order.data())
      setIsLoading(false);
    });

    return () => getOrderStream();
  }, [oid])


  const completeOrder = () => {
    setIsLoading(true);
    const stamp = new Date().getTime();
    updateDoc(doc(fireStoreDB, 'Orders/' + oid), {
      paymentStatus: 1,
      status: 1,
      deliveredOn: stamp
    })
      .then(() => setIsLoading(false));
  }

  return (
    <Panel>
      {!isLoading ?
        <section className={styles.viewBox} id="frame">
          <header>
            <MdArrowBack onClick={() => router.back()} />
            <div>
              <h3 className="big">View Order| <span className="big" style={{ color: 'skyblue' }}>{order.token}</span> | {getRealDate(order.timestamp)} |  {order.id}<sub></sub></h3>
              <p>
                <legend><MdOutlineSelfImprovement /> <span className="cash">{order.customer.username}</span></legend>
                <legend><MdMailOutline /> <span className="cash">{order.customer.email}</span></legend>
                <legend><MdCall /> <span className="cash">{order.contact}</span></legend>
              </p>
            </div>
          </header>

          <section className={styles.con}>

            <section className={styles.productBox}>
              <h3>Cart</h3>
              <ul>
                {order.cart.map((item: defType, i: number) => (
                  <li key={i}>
                    {item.el.image.format === 'png' ?
                      <Image alt="" className="contain" height={50} width={50} src={item.el.image.url} />
                      :
                      <Image alt="" className="cover" height={50} width={50} src={item.el.image.url} />
                    }

                    <strong>{item.el.name}</strong>
                    <span className="cash">GHC {item.price.toLocaleString()}</span>
                    <span className="cash">*</span>
                    <span className="cash">{item.quantity}</span>
                    <span className="cash">=</span>
                    <span className="cash">GHC {(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <nav><strong className="big">Total = GHC {order.total.toLocaleString()}</strong></nav>
            </section>

            <section className={styles.infoBox}>
              <h3>Info</h3>
              <ul>
                <p> <span>Location</span>  <strong>{order.location}</strong></p>
                <p> <span>Payment Method</span>  <strong>{order.paymentMethod}</strong></p>
                <p> <span>Payment Status</span>  <strong style={order.paymentStatus ? { background: 'var(--pass)', color: 'white' } : { background: 'tomato', color: 'white' }}>{order.paymentStatus ? 'Paid' : 'Not Paid'}</strong></p>
                <p> <span>Trans ID</span>  <strong>{order.transID || '--'}</strong></p>
              </ul>
            </section>

            <section className={styles.infoBox}>
              <h3>Status</h3>
              <ul>
                <p> <span>Delivery Deadline</span>  <strong>{getOrderDeadline(order.timestamp)}</strong></p>
                <p> <span>Delivered On</span>  <strong>{order.deliveredOn ? getRealDate(order.deliveredOn) : '--'}</strong></p>
                <p> <span>Order Status</span>  <strong style={order.status ? { background: 'var(--pass)', color: 'white' } : { background: 'tomato', color: 'white' }}>{order.status ? 'Completed' : 'Pending'}</strong></p>
              </ul>
            </section>

            {!order.status &&
              <button onClick={completeOrder} className={styles.complete} style={order.status ? { background: 'var(--pass)', color: 'white' } : { background: 'tomato', color: 'white' }}>
                <span>Complete Order</span>
              </button>
            }
          </section>
        </section>
        : <span>loading...</span>
      }
    </Panel>
  );
}

export default ViewOrder;