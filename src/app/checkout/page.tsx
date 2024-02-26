'use client';
import Link from 'next/link';
import TopNav from '../components/TopNav/TopNav';
import styles from './checkout.module.css';
import { addToCart, clearItem, fixContact, genToken, getUpdatedCartTotal, removeFromCart } from '@/External/services';
import { MdAdd, MdArrowForward, MdBolt, MdCall, MdDelete, MdDeleteOutline, MdLocalShipping, MdLocationPin, MdOutlineDeliveryDining, MdOutlineReceiptLong, MdOutlineSmartphone, MdPayments, MdReceiptLong, MdRemove, MdSchedule } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';
import { fireAuth, fireStoreDB } from '@/Firebase/base';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { getUserAddress, predictPlaces } from '@/External/map';
import { LiaMoneyBillWaveAltSolid } from 'react-icons/lia';
import { GiTakeMyMoney } from 'react-icons/gi';


interface defType extends Record<string, any> { };
const Checkout = () => {
  const [customer, setCustomer] = useState<defType>({});
  const [cart, setCart] = useState<defType[]>([]);
  const [quantityList, setQuantityList] = useState<number[]>([0]);
  const [locText, setLocText] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('0');
  const [predictions, setPredictions] = useState<defType[]>([]);
  const [predLoading, setPredLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');


  useEffect(() => {
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        new Error('Geolocation is not supported by this browser.');
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getUserAddress(lat, lon)
              .then((res) => setLocation(res));
          },
          (error) => { }
        )
      };
    };

    getUserLocation()

    const authStream = onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        const customerStream = onSnapshot(doc(fireStoreDB, 'Customers/' + user.uid), (snapshot) => {
          const customerTemp: defType = ({ id: snapshot.id, ...snapshot.data() });
          localStorage.setItem('maqCustomer', '1');
          localStorage.setItem('maqCart', JSON.stringify(customerTemp.cart));
          localStorage.setItem('maqWishList', JSON.stringify(customerTemp.wishList));
          localStorage.setItem('maqKeywords', JSON.stringify(customerTemp.keywords));
          setCustomer(customerTemp);
          sortCart(customerTemp.cart);
        });
        return () => customerStream();
      } else {
        localStorage.removeItem('maqCustomer');
        console.log('logged Out');
      }
    });
    return () => authStream();
  }, [])

  const sortCart = (cartTemp: defType[]) => {
    const updatedCart: defType[] = [];
    const checkProd = async (item: defType) => {
      const prod = await getDoc(doc(fireStoreDB, 'Products/' + item.pid));
      if (prod.exists()) {
        const finalProd = { pid: item.pid, quantity: item.quantity, price: prod.data().price, el: { id: prod.id, ...prod.data() } };
        return finalProd;
      } else {
        return null;
      }
    }

    Promise.all(cartTemp.map(async (el) => await checkProd(el)))
      .then((results) => {
        results.forEach((res) => {
          if (res) updatedCart.push(res);
        });
        setQuantityList(updatedCart.map((el) => el.quantity));
        setCart(updatedCart);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleLocText = async (val: string) => {
    setLocText(val);
    if (val.length > 2) {
      setPredLoading(true);
      const res = await predictPlaces(val);
      console.log(res.data.predictions);
      setPredictions(res.data.predictions);
      setPredLoading(false);
    } else {
      setPredictions([]);
    }
  }

  const selectLocation = (val: string) => {
    setLocText('');
    setLocation(val);
    setPredictions([]);
  }

  const createOrder = (payStatus: number) => {
    const stamp = new Date().getTime();
    const oid = `oid${stamp}`;
    const total = getUpdatedCartTotal(cart);
    const token = genToken();

    setDoc(doc(fireStoreDB, 'Orders/' + oid), {
      uid: customer.id,
      token: token,
      customer: customer,
      location: location,
      contact: contact,
      cart: cart,
      total: total,
      delivery: 0,
      paymentMethod: paymentMethod,
      paymentStatus: payStatus,
      transID: '',
      status: 0,
      timestamp: stamp
    })
      .then(() => alert('complete'));
  }


  //filter customer info
  //no orderCount on customer side filter all from Orders collection
  // https://www.pinterest.com/pin/1077134435865011509/

  const checkOrder = () => {
    createOrder(0);
    // if (location && contact) {
    //   if (paymentMethod === 'cash') {
    //   } else {
    //     //run paystack and on 200 fixUpdatedCart(1); add paystack trans ID to make sure.
    //   }
    // }
  }

  // const handleQuantity = (pid, val, i) => {
  //   if (val < 101) {
  //     console.log(val, 101)
  //     const updatedQuantityList = [...quantityList];
  //     updatedQuantityList[i] = val;
  //     setQuantityList(updatedQuantityList)
  //   }

  //   if (val > 0) {
  //     const updatedVal = parseInt(val);
  //     const item = cart.find((el) => el.pid === pid);
  //     item.quantity = updatedVal;
  //     item.total = val * item.price;
  //     updateCartInfo(cart);
  //   }
  // }


  const [tes, setTes] = useState('');

  return (
    <main className='scroll'>
      <TopNav />
      <section className={styles.checkoutBoxHolder} id='box'>
        <section className={styles.cartBox}>
          <header>
            <h2>Shopping Cart</h2>
            <strong>{cart.length} Products</strong>
          </header>
          <section className={styles.items}>
            <li className={styles.topLi}>
              <span>Product Details</span>
              <span>Quantity</span>
              <span>Price</span>
              <span>Total</span>
            </li>

            {typeof window != 'undefined' &&
              cart.map((item: defType, i: number) => (
                <li key={i}>
                  <article>
                    <div className={styles.imgBox}>
                      <Image alt='' fill sizes='auto' src={item.el.image.url} />
                    </div>
                    <p>
                      <Link href={{ pathname: '/viewProduct', query: { item: JSON.stringify(item) } }}>
                        <small className="cut">
                          {item.el.name}
                        </small>
                      </Link>
                      <small style={{ color: 'darkgray' }} className="cut">
                        {item.el.category}
                      </small>
                      <legend onClick={() => { clearItem(JSON.stringify(item)) }}>
                        <MdDeleteOutline />
                      </legend>
                    </p>
                  </article>
                  <nav>
                    <button onClick={() => { removeFromCart(JSON.stringify(item.el)) }}><MdRemove /></button>
                    <input className='cash' max={100} type="number" value={quantityList[i].toString()} />
                    <button onClick={() => { addToCart(JSON.stringify(item.el), 1) }}><MdAdd /></button>
                  </nav>
                  <p>
                    <sub>Unit Price</sub>
                    <h5 className='cash'>GH₵ {item.price.toLocaleString()}</h5>
                  </p>

                  <p>
                    <sub>Total</sub>
                    <h5 style={{ fontWeight: '600' }} className='cash'>GH₵ {(item.quantity * item.price).toLocaleString()}</h5>
                  </p>
                </li>
              ))}
          </section>
        </section>


        <section className={styles.checkoutBox}>
          <header>
            <h2>
              Order Summary
            </h2>
          </header>

          <section className={styles.locationBox}>
            <div className={styles.searchBox}>
              <span><MdLocationPin /> Enter Your Location</span>
              <p>
                <input type="text" value={locText} onChange={(e) => handleLocText(e.target.value)} />
                {predLoading && <MdBolt />}
              </p>
              <ul>
                {predictions.map((item, i) => (
                  <li key={i} onClick={() => selectLocation(item.description)}>
                    <span>{item.description}</span>
                    <MdArrowForward />
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.searchBox}>
              <span><MdLocationPin /> Contact</span>
              <p>
                <span>+233</span>
                <input className='cash' type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
              </p>
            </div>


            <small>
              <p className='cash'>
                {/* <strong className='cash'>Doorstep Delivery</strong> */}
                Delivery would be delivered to your doorstep in 48hrs.
                Payment on delivery.
              </p>
            </small>

            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cash">Cash on delivery</option>
              <option value="online">Online Payment</option>
            </select>
            <hr />
          </section>

          <article className={styles.totalBox}>
            <legend>
              <MdCall />
              <strong className='cash'>{fixContact(contact)}</strong>
            </legend>
            <legend>
              <MdLocationPin />
              <strong>{location}</strong>
            </legend>
            <hr />
            <legend>
              {paymentMethod === 'cash' ? <GiTakeMyMoney /> : <MdOutlineSmartphone />}
              <strong>{paymentMethod === 'cash' ? 'Cash on delivery' : 'Online Payment'}</strong>
            </legend>
            <legend>
              <MdOutlineDeliveryDining />
              <strong>Free Delivery</strong>
            </legend>
            <legend>
              <LiaMoneyBillWaveAltSolid />
              <strong className='cash'>GH₵ 5,000</strong>
            </legend>
          </article>

          <article className={styles.totalBox}>
            <p>
              <hr />
              <strong>Total</strong>
              <legend>
                <MdOutlineReceiptLong />
                <strong className='cash' style={{ fontWeight: 600, fontSize: '1.3rem' }}>GH₵ 5,000</strong>
              </legend>
            </p>
          </article>
          <button className={styles.checkout} onClick={checkOrder}>Complete order</button>
        </section>
      </section>
    </main>
  );
}

export default Checkout;