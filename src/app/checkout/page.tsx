'use client';
import Link from 'next/link';
import TopNav from '../components/TopNav/TopNav';
import styles from './checkout.module.css';
import { checkContact, clearCart, fixContact, genToken, getUpdatedCartTotal, joinContact, setToCart } from '@/External/services';
import { MdAdd, MdArrowForward, MdBolt, MdCall, MdDelete, MdDeleteOutline, MdLocalShipping, MdLocationPin, MdOutlineDeliveryDining, MdOutlineReceiptLong, MdOutlineSmartphone, MdPayments, MdReceiptLong, MdRemove, MdSchedule } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';
import { fireAuth, fireStoreDB } from '@/Firebase/base';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { getUserAddress, predictPlaces } from '@/External/map';
import { LiaMoneyBillWaveAltSolid } from 'react-icons/lia';
import { GiTakeMyMoney } from 'react-icons/gi';
import { useRouter } from 'next/navigation';
import PromptBox from '../components/PromptBox/PromptBox';
import ClearItem from '../components/Cart/ClearItem/ClearItem';
import AddToCart from '../components/Cart/AddToCart/AddToCart';
import RemFromCart from '../components/Cart/RemFromCart/RemFromCart';
import { createPayLink } from '@/External/paystack';


interface defType extends Record<string, any> { };
const Checkout = () => {
  const router = useRouter();
  const [customer, setCustomer] = useState<defType>({});
  const [cart, setCart] = useState<defType[]>([]);
  const [quantityList, setQuantityList] = useState<number[]>([0]);
  const [locText, setLocText] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('0');
  const [predictions, setPredictions] = useState<defType[]>([]);
  const [predLoading, setPredLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderLoading, setOrderLoading] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);


  useEffect(() => {
    if (typeof window != 'undefined') {
      setCartLoaded(true);
    }


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
          if (customerTemp.cart.length < 1) {
            router.push('/');
          } else {
            localStorage.setItem('maqCustomer', '1');
            localStorage.setItem('maqKeywords', JSON.stringify(customerTemp.keywords));
            setCustomer(customerTemp);
            sortCart(customerTemp.cart);
            setContact(customerTemp.contact);
            setQuantityList(customerTemp.cart.map((el: defType) => el.quantity))
          }
        });
        return () => customerStream();
      } else {
        localStorage.removeItem('maqCustomer');
        console.log('logged Out');
      }
    });
    return () => authStream();
  }, [router])

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
    if (val.length > 0) {
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
      .then(() => { clearCart(); router.push('/'); });
  }


  //filter customer info
  //no orderCount on customer side filter all from Orders collection
  // https://www.pinterest.com/pin/1077134435865011509/

  const fixPrompt = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 6000)
  }

  const checkOrder = async () => {
    if (checkContact(joinContact(fixContact(contact))) && location) {
      setOrderLoading(true);
      if (paymentMethod === 'cash') {
        createOrder(0);
      } else {
        const payObj = await createPayLink();
        router.push(payObj.link);
        //run paystack and on 200 fixUpdatedCart(1); add paystack trans ID to make sure.
      }
    } else {
      fixPrompt();
    }
  }


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

            {cartLoaded &&
              cart.map((item: defType, i: number) => (
                <li key={i}>
                  <article>
                    <div className={styles.imgBox}>
                      <Image alt='' fill sizes='auto' src={item.el.image.url} />
                    </div>
                    <p>
                      <Link style={{ color: 'black' }} href={{ pathname: '/viewProduct', query: { pid: item.el.id } }}>
                        <small className="cut">
                          {item.el.name}
                        </small>
                      </Link>
                      <small style={{ color: 'darkgray' }} className="cut">
                        {item.el.category}
                      </small>
                      <ClearItem product={item.el}>
                        <legend>
                          <MdDeleteOutline />
                        </legend>
                      </ClearItem>
                    </p>
                  </article>
                  <nav>
                    <RemFromCart product={item.el}>
                      <button><MdRemove /></button>
                    </RemFromCart>
                    <input className='cash' type="number" value={quantityList[i]} onChange={(e) => setToCart(item.el, parseInt(e.target.value))} />
                    <AddToCart product={item.el} quantity={1} type='normal'>
                      <button><MdAdd /></button>
                    </AddToCart>
                  </nav>
                  <article>
                    <sub>Unit Price</sub>
                    <h5 className='cash'>GH₵ {item.price.toLocaleString()}</h5>
                  </article>

                  <article>
                    <sub>Total</sub>
                    <h5 style={{ fontWeight: '600' }} className='cash'>GH₵ {(item.quantity * item.price).toLocaleString()}</h5>
                  </article>
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
              <span><MdLocationPin /> Change Your Location</span>
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

            <div className={styles.contactBox}>
              <span><MdCall /> Contact</span>
              <p>
                <span className='cash'>+233</span>
                <input className='cash' type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
              </p>
            </div>


            <small className={styles.promptBox}>
              <p className='cash'>
                Delivery would be delivered to your doorstep in 48hrs.
                Payment on delivery.
              </p>
              <Link href={'tel:+233597838142'} className='cash'>
                Call +233 59 783 8142 for any product or delivery enquiry.
              </Link>
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
              <sub id={checkContact(joinContact(fixContact(contact))) ? 'right' : 'wrong'} ></sub>
            </legend>
            <legend>
              <MdLocationPin />
              <strong>{location}</strong>
              <sub id={location ? 'right' : 'wrong'}></sub>
            </legend>
            <hr />
            <legend>
              {paymentMethod === 'cash' ? <GiTakeMyMoney /> : <MdOutlineSmartphone />}
              <strong>{paymentMethod === 'cash' ? 'Cash on delivery' : 'Online Payment'}</strong>
            </legend>
            <legend>
              <MdOutlineDeliveryDining />
              <strong>Free Delivery</strong>
              <sub></sub>
            </legend>
            <legend>
              <LiaMoneyBillWaveAltSolid />
              <strong className='cash'>GH₵ {getUpdatedCartTotal(cart).toLocaleString()}</strong>
              <sub></sub>
            </legend>
          </article>

          <article className={styles.totalBox}>
            <div>
              <hr />
              <strong>Total</strong>
              <legend>
                <MdOutlineReceiptLong />
                <strong className='cash' style={{ fontWeight: 600, fontSize: '1.3rem' }}>GH₵ {getUpdatedCartTotal(cart).toLocaleString()}</strong>
              </legend>
            </div>
          </article>
          <button className={styles.checkout} onClick={checkOrder}>Place order</button>
        </section>
      </section>

      <PromptBox type='fail' info='Contact is required' isPlaying={isPlaying} />

      {orderLoading && <span>order Loading</span>}
    </main>
  );
}

export default Checkout;