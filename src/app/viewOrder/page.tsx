'use client';
import { useEffect, useState } from "react";
import TopNav from "../components/TopNav/TopNav";
import styles from './viewOrder.module.css';
import { onSnapshot, doc } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import { pageHeader } from "@/External/lists";
import Image from "next/image";
import { getHourGap, getRealDate, getTimeSince, getUpdatedCartTotal } from "@/External/services";
import { MdCall, MdOutlineDeliveryDining } from "react-icons/md";
import { IoIosDoneAll } from "react-icons/io";
import Link from "next/link";
import TrackBox from "../components/TrackBox/TrackBox";
import Loading from "../components/Loading/Loading";

interface defType extends Record<string, any> { };
const ViewOrder = ({ searchParams }: { searchParams: { oid: string } }) => {
  const oid = searchParams.oid;
  const [order, setOrder] = useState<defType>({});

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getOrderStream = onSnapshot(doc(fireStoreDB, 'Orders/' + oid), (prod) => {
      if (prod.exists()) {
        setOrder({ id: prod.id, ...prod.data() });
      }
      setIsLoading(false);
    });

    return () => getOrderStream();
  }, [oid])



  return (
    <main className="scroll">
      <TopNav />

      <section className={styles.orderBox} id='boxNoTop'>
        {pageHeader(`View Order`, '/orders')}

        {!isLoading ?
          <section className={styles.con}>
            <header>
              <strong className="cash">{order.token} <sub></sub></strong>
            </header>

            <article>
              <span className="cash">{getTimeSince(order.timestamp)}  | {getRealDate(order.timestamp)}</span>
            </article>


            <TrackBox status={order.status} stamp={order.timestamp} />

            <section className={styles.cart}>
              <h3>Cart</h3>
              <ul>
                {order.cart.map((item: defType, i: number) => (
                  <Link href={{ pathname: '/viewProduct', query: { pid: item.id } }} key={i}>
                    <Image alt="" className="contain" src={item.img} width={50} height={50} />
                    <span>{item.name}</span>
                    <span className="cash">GH₵ {item.price.toLocaleString()}</span>
                    <span className="cash">x {item.quantity.toLocaleString()}</span>
                    <strong className="cash">GH₵ {(item.quantity * item.price).toLocaleString()}</strong>
                  </Link>
                ))}
              </ul>
              <div className={styles.total}>
                <strong className="big">GHS {getUpdatedCartTotal(order.cart).toLocaleString()}</strong>
              </div>
            </section>

            {order.status ?
              <p className={styles.promptBox}>
                <IoIosDoneAll style={{ background: 'var(--pass)' }} />
                <span>Your order has been delivered</span>
              </p>
              :
              <p className={styles.promptBox}>
                <MdOutlineDeliveryDining style={{ background: 'orange' }} />
                <span>Your order is on it&apos;s way</span>
              </p>
            }

            <Link href={'tel:+233597838142'} className={styles.contactBox}>
              <MdCall style={{ background: 'orange' }} />
              <span className="cash">+233 59 783 8142</span>
            </Link>
          </section>

          : <Loading />
        }
      </section>
    </main>
  );
}

export default ViewOrder;