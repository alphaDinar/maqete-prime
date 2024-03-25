'use client';
import { MdAdd, MdMoney, MdOutlineCategory, MdOutlineLocalShipping, MdOutlinePendingActions, MdOutlineSelfImprovement, MdOutlineSmartphone, MdPhone } from "react-icons/md";
import Panel from "./Panel/Panel";
import styles from './manager.module.css';
import Link from "next/link";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import Image from "next/image";
import { sampleImg } from "@/External/lists";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import { getOrderQuantity, getOrderSetTotal, getTimeSince, sortByTime } from "@/External/services";

interface defType extends Record<string, any> { };
const Manager = () => {
  const [orders, setOrders] = useState<defType[]>([]);
  const [categories, setCategories] = useState<defType[]>([]);
  const [products, setProducts] = useState<defType[]>([]);
  const [customers, setCustomers] = useState<defType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const orderStream = onSnapshot(collection(fireStoreDB, 'Orders/'), (snapshot) => {
      setOrders(sortByTime(snapshot.docs.map((order) => ({ id: order.id, ...order.data() }))));
    });

    const categoryStream = onSnapshot(collection(fireStoreDB, 'Categories/'), (snapshot) => {
      setCategories(snapshot.docs.map((cat) => ({ id: cat.id, ...cat.data() })));
    });

    const productStream = onSnapshot(collection(fireStoreDB, 'Products/'), (snapshot) => {
      setProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
    });

    const customerStream = onSnapshot(collection(fireStoreDB, 'Customers/'), (snapshot) => {
      setCustomers(snapshot.docs.map((cus) => ({ id: cus.id, ...cus.data() })));
    });

    return () => {
      orderStream();
      categoryStream();
      productStream();
      customerStream();
    }
  }, [])

  return (
    <Panel>
      <section className={styles.con}>
        <section className={styles.dataBox}>
          <Link href={'manager/orders'}>
            <strong className="big" style={{ color: '#50C1F1' }}>{orders.length}</strong>
            <p>
              <span>Orders</span>
              <small>20 days || start 1st march</small>
            </p>
          </Link>
          <hr />
          <Link href={'manager/categories'}>
            <strong className="big" style={{ color: '#79D3B8' }}>{categories.length}</strong>
            <p>
              <span>Categories</span>
              <MdOutlineCategory />
            </p>
          </Link>
          <hr />
          <Link href={'manager/products'}>
            <strong className="big" style={{ color: '#79D3B8' }}>{products.length}</strong>
            <p>
              <span>Products</span>
              <MdOutlineSmartphone />
            </p>
          </Link>
          <hr />
          <Link href={'manager/customers'}>
            <strong className="big" style={{ color: '#79D3B8' }}>{customers.length}</strong>
            <p>
              <span>Customers</span>
              <MdOutlineSelfImprovement />
            </p>
          </Link>
        </section>

        <section className={styles.statBox}>
          <section className={styles.row}>
            <section className={styles.dailyBox}>
              <Link href={'manager/sales'} style={{ background: '#E8EFF9' }}>
                <FaMoneyBillTrendUp style={{ background: '#80DAF6', color: '#8D80B6' }} />
                <small>Daily Sales</small>

                <p>
                  <strong className="big">300</strong>
                  <small className="cash">GH₵ 45,000</small>
                </p>
              </Link>
              <Link href={'manager/orders'} style={{ background: '#FFEFE7' }}>
                <MdOutlinePendingActions style={{ background: '#FFAEAE', color: 'white' }} />
                <small>Pending Orders</small>

                <p>
                  <strong className="big">{orders.filter((el) => el.status === 0).length}</strong>
                  <small className="cash">GH₵ {getOrderSetTotal(orders.filter((el) => el.status === 0)).toLocaleString()}</small>
                </p>
              </Link>
            </section>

            <section className={styles.recentBox}>
              <h3>Recent</h3>
              {orders.slice(0, 2).map((order, i) => (
                <Link key={i} href={{ pathname: 'manager/viewOrder', query: { oid: order.id } }}>
                  <Image alt="" fill sizes="auto" src={order.cart[0].img} />
                  <article>
                    <small>{order.cart.length} products ({getOrderQuantity(order.cart)} pcs)</small>
                    <small>GH₵ {order.total.toLocaleString()}</small>
                    <small>{getTimeSince(order.timestamp)}</small>
                    {/* <small><MdOutlineLocalShipping /> 1 day Left</small> */}
                  </article>
                </Link>
              ))}
            </section>
          </section>

          <section className={styles.row}>
            <section className={styles.promptBox}>

              <section className={styles.depBox}>
              </section>

              <section className={styles.controlBox}>
                <Link href={'manager/addProduct'}>
                  <MdOutlineSmartphone />
                  <MdAdd />
                  <span>Add Product</span>
                </Link>
                <Link href={'manager/addCategory'}>
                  <MdOutlineCategory />
                  <MdAdd />
                  <span>Add Category</span>
                </Link>
              </section>
            </section>
            <section className={styles.topBox}>
              <h3>Top Products</h3>
              <section>
                <Link href={''}>
                  <Image alt="" fill sizes="auto" src={sampleImg} />
                  <article>
                    <span>Google Pixel 8</span>
                    <p>
                      <span>5000 orders</span>
                      <strong>GH₵ 25,000</strong>
                    </p>
                  </article>
                </Link>
                <Link href={''}>
                  <Image alt="" fill sizes="auto" src={sampleImg} />
                  <article>
                    <span>Google Pixel 8</span>
                    <p>
                      <span>5000 orders</span>
                      <strong>GH₵ 25,000</strong>
                    </p>
                  </article>
                </Link>
              </section>
            </section>
          </section>
        </section>
      </section>
    </Panel>
  );
}

export default Manager;