'use client'
import Link from 'next/link';
import styles from './topNav.module.css';
import { MdAdd, MdArrowForward, MdClose, MdDelete, MdDeleteOutline, MdOutlineFavoriteBorder, MdOutlineShoppingCart, MdOutlineShoppingCartCheckout, MdRemove, MdRemoveCircle, MdRemoveCircleOutline, MdSearch, MdSelfImprovement, MdShoppingBag } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { sampleImg } from '@/External/lists';
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { fireAuth, fireStoreDB } from '@/Firebase/base';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '../Loader/Loader';
import { addKeyword, addToCart, clearItem, getCartTotal, removeFromCart } from '@/External/services';

interface defType extends Record<string, any> { };
const TopNav = () => {
  const [displayName, setDisplayName] = useState('');
  const [uid, setUid] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<defType[]>([]);
  const [searchBoxToggled, setSearchBoxToggled] = useState(false);
  const [searchResults, setSearchResults] = useState<defType[]>([]);

  const [userBoxToggled, setUserBoxToggled] = useState(false);
  const [cartBoxToggled, setCartBoxToggled] = useState(false);
  const [customer, setCustomer] = useState<defType>({});

  const toggleSearchBox = () => {
    searchBoxToggled ? setSearchBoxToggled(false) : setSearchBoxToggled(true);
  }
  const toggleUserBox = () => {
    userBoxToggled ? setUserBoxToggled(false) : setUserBoxToggled(true);
  }
  const toggleCartBox = () => {
    cartBoxToggled ? setCartBoxToggled(false) : setCartBoxToggled(true);
  }

  useEffect(() => {
    getDocs(collection(fireStoreDB, 'Products/'))
      .then((res) => {
        const productsTemp: defType[] = res.docs.map((el) => ({ id: el.id, ...el.data() }))
        localStorage.setItem('maqProducts', JSON.stringify(productsTemp));
        setProducts(productsTemp);
      });

    const authStream = onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        setUid(user.uid);
        setDisplayName(user.displayName || user.email || 'Dashboard');

        const customerStream = onSnapshot(doc(fireStoreDB, 'Customers/' + user.uid), (snapshot) => {
          const customerTemp: defType = ({ id: snapshot.id, ...snapshot.data() });
          localStorage.setItem('maqCustomer', '1');
          localStorage.setItem('maqCart', JSON.stringify(customerTemp.cart));
          localStorage.setItem('maqWishList', JSON.stringify(customerTemp.wishList));
          localStorage.setItem('maqKeywords', JSON.stringify(customerTemp.keywords));
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

    return () => authStream();
  }, [])

  const prodTest = [
    { name: 'Samsung A24' },
    { name: 'iPhone' },
    { name: 'Air Pods Pro' },
  ]

  const runSearch = (searchVal: string) => {
    if (searchVal.length > 0) {
      const updatedSearch = products.filter((prod) => prod.name.toLocaleLowerCase().includes(searchVal)).slice(0, 5);
      setSearchResults(updatedSearch);
      if (updatedSearch.length === 0) {
        // notfound Box
      }
      if (searchVal.length > 3) {
        addKeyword(searchVal);
      }
    } else {
      setSearchResults([]);
    }
  }


  return (
    <section className={styles.topNav}>
      <Link href={'/'}>
        <strong>Logo</strong>
      </Link>

      <div className={searchBoxToggled ? `${styles.searchBox} ${styles.change}` : styles.searchBox}>
        <input type="text" onChange={(e) => { runSearch(e.target.value.toLowerCase()) }} />
        <MdSearch className={styles.search} onClick={toggleSearchBox} />

        <ul>
          {searchResults.map((product, i) => (
            <Link key={i} onClick={toggleSearchBox} href={{ pathname: '/viewProduct', query: { pid: product.id } }}>
              <Image alt='' className='contain' height={30} width={30} src={product.image.url} />
              <small>{product.name}</small>
              <MdArrowForward />
            </Link>
          ))}
        </ul>
      </div>

      {!isLoading ?
        isLoggedIn ?
          <nav className={styles.controlBox}>
            <Link href={{ pathname: 'dashboard', query: { uid: uid } }} style={{ color: 'var(--pass)', border: '1px solid var(--pass)' }}>
              <MdSelfImprovement />
              <legend>{customer.username}</legend>
            </Link>
            <Link href={''}>
              <MdOutlineFavoriteBorder />
              <legend>{customer.wishList.length}</legend>
            </Link>
            <a onClick={toggleCartBox}>
              <MdOutlineShoppingCart />
              <legend>{customer.cart.length}</legend>
            </a>
          </nav>
          :
          <nav className={styles.controlBox}>
            <Link href={''}>
              <MdArrowForward />
              <legend>Login</legend>
            </Link>
            <Link href={'register'}>
              <MdArrowForward />
              <legend>Get Started</legend>
            </Link>
            <a onClick={toggleCartBox}>
              <MdOutlineShoppingCart />
              <legend>6</legend>
            </a>
          </nav>
        :
        <Loader />
      }

      {typeof window != 'undefined' &&
        <section className={cartBoxToggled ? `${styles.cartBoxHolder} ${styles.change}` : styles.cartBoxHolder}>
          <section className={styles.sheet} onClick={toggleCartBox}></section>
          <section className={styles.cartBox}>
            <header>
              <MdOutlineShoppingCart />
              <strong>My Cart</strong>

              <legend>
                <MdClose onClick={toggleCartBox} />
              </legend>
            </header>

            <ul>
              {
                localStorage.getItem('maqCart') &&
                JSON.parse(localStorage.getItem('maqCart') || '[]').map((item: defType, i: number) => (
                  <li key={i}>
                    {
                      <Image alt='' src={JSON.parse(item.product).image.url} height={70} width={70} />
                    }
                    <p>
                      <small>{JSON.parse(item.product).name}</small>
                      <strong className='cash'>GHC {(item.quantity * item.price).toLocaleString()}</strong>
                      <nav>
                        <MdRemove onClick={() => removeFromCart(item.product)} />
                        <span>{item.quantity}</span>
                        <MdAdd onClick={() => addToCart(item.product, 1)} />
                      </nav>
                    </p>
                    <MdDeleteOutline onClick={() => clearItem(item.product)} className={styles.remove} />
                  </li>
                ))}
            </ul>

            <footer>
              <strong>GHC {getCartTotal().toLocaleString()}</strong>
              <Link href={'/checkout'}>
                <sub></sub>
                <span className='caps'>Go to Checkout</span>
                <MdOutlineShoppingCartCheckout />
              </Link>
            </footer>
          </section>
        </section>
      }


    </section>
  );
}

export default TopNav;