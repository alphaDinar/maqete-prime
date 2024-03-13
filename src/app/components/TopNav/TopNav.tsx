'use client'
import Link from 'next/link';
import styles from './topNav.module.css';
import { MdAdd, MdArrowForward, MdClose, MdDeleteOutline, MdMenu, MdOutlineFavoriteBorder, MdOutlineSelfImprovement, MdOutlineShoppingCart, MdOutlineShoppingCartCheckout, MdRemove, MdSearch, MdSelfImprovement, MdShoppingBag } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '../../../../public/logo.png';
import { userList } from '@/External/lists';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { fireAuth, fireStoreDB } from '@/Firebase/base';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '../Loader/Loader';
import { addKeyword, getCartTotal } from '@/External/services';
import { useWishList } from '@/app/contexts/wishListContext';
import { useCart } from '@/app/contexts/cartContext';
import ClearItem from '../Cart/ClearItem/ClearItem';
import AddToCart from '../Cart/AddToCart/AddToCart';
import RemFromCart from '../Cart/RemFromCart/RemFromCart';

interface defType extends Record<string, any> { };
const TopNav = () => {
  const [displayName, setDisplayName] = useState('');
  const { cart } = useCart();
  const { wishList, setWishList } = useWishList();
  const [wishListItems, setWishListItems] = useState<defType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<defType[]>([]);
  const [searchBoxToggled, setSearchBoxToggled] = useState(false);
  const [menuToggled, setMenuToggled] = useState(false);
  const [searchResults, setSearchResults] = useState<defType[]>([]);

  const [userBoxToggled, setUserBoxToggled] = useState(false);
  const [cartBoxToggled, setCartBoxToggled] = useState(false);
  const [wishListToggled, setWishListToggled] = useState(false);
  const [customer, setCustomer] = useState<defType>({});
  const [winSize, setWinSize] = useState(1200);

  const toggleSearchBox = () => {
    searchBoxToggled ? setSearchBoxToggled(false) : setSearchBoxToggled(true);
  }
  const toggleUserBox = () => {
    userBoxToggled ? setUserBoxToggled(false) : setUserBoxToggled(true);
  }
  const toggleCartBox = () => {
    cartBoxToggled ? setCartBoxToggled(false) : setCartBoxToggled(true);
  }
  const toggleWishList = () => {
    wishListToggled ? setWishListToggled(false) : setWishListToggled(true);
  }

  const toggleMenu = () => {
    menuToggled ? setMenuToggled(false) : setMenuToggled(true);
  }

  useEffect(() => {
    if (typeof window != 'undefined') {
      setWinSize(window.innerWidth);
      window.onresize = () => {
        setWinSize(window.innerWidth);
      }
    }

    const authStream = onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        setDisplayName(user.displayName || user.email || 'Dashboard');

        const customerStream = onSnapshot(doc(fireStoreDB, 'Customers/' + user.uid), (snapshot) => {
          const customerTemp: defType = ({ id: snapshot.id, ...snapshot.data() });
          setIsLoggedIn(true);
          setCustomer(customerTemp);
          localStorage.setItem('maqCustomer', '1');
          const productsRef = collection(fireStoreDB, 'Products/');
          const productStream = onSnapshot(productsRef, (snapshot) => {
            const wishListTemp: defType[] = [];
            const productsTemp: defType[] = snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() }));
            customerTemp.wishList.map((el: string) => {
              const prod = productsTemp.find((prod) => prod.id === el);
              if (prod) {
                wishListTemp.push(prod)
                setWishListItems(wishListTemp);
              }
            })
            setProducts(productsTemp);
            if (typeof window !== undefined) {
              setIsLoading(false);
            }
          });
          return () => productStream();
        });
        return () => customerStream();
      } else {
        localStorage.removeItem('maqCustomer');
        const productsRef = collection(fireStoreDB, 'Products/');
        const productStream = onSnapshot(productsRef, (snapshot) => {
          setProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
          if (typeof window !== undefined) {
            setIsLoading(false);
          }
        });
        return () => productStream();
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

  const logoTemp = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708957950/maqete/maqLogo_kded29.png';

  return (
    <section className={styles.topNav}>
      <Link href={'/'}>
        <Image alt='' className='contain' width={100} height={50} src={logo} />
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
          <nav className={winSize > 500 ? styles.controlBox : menuToggled ? `${styles.controlBox} ${styles.change}` : styles.controlBox}>
            <a onClick={toggleUserBox} style={{ color: 'var(--pass)', border: '1px solid var(--pass)' }}>
              <MdSelfImprovement />
              <legend>{customer.username}</legend>
            </a>
            <a onClick={toggleWishList}>
              <MdOutlineFavoriteBorder />
              <legend>{wishList.length}</legend>
            </a>
            <a onClick={toggleCartBox}>
              <MdOutlineShoppingCart />
              <legend>{cart.length}</legend>
            </a>
            <MdMenu className={styles.tag} onClick={toggleMenu} />
          </nav>
          :
          <nav className={winSize > 500 ? styles.controlBox : menuToggled ? `${styles.controlBox} ${styles.change}` : styles.controlBox}>
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
              <legend>{cart.length}</legend>
            </a>
            <MdMenu className={styles.tag} onClick={toggleMenu} />
          </nav>
        :
        <Loader />
      }

      {!isLoading &&
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
                cart.map((item: defType, i: number) => (
                  <li key={i}>
                    {
                      <Image alt='' className='contain' src={JSON.parse(item.product).image.url} height={70} width={70} />
                    }
                    <article>
                      <small>{JSON.parse(item.product).name}</small>
                      <strong className='cash'>GH₵ {(item.quantity * item.price).toLocaleString()}</strong>
                      <nav>
                        <RemFromCart product={JSON.parse(item.product)}>
                          <MdRemove />
                        </RemFromCart>
                        <span className='cash'>{item.quantity}</span>
                        <AddToCart product={JSON.parse(item.product)} quantity={1} type='normal'>
                          <MdAdd />
                        </AddToCart>
                      </nav>
                    </article>
                    <legend className={styles.remove}>
                      <ClearItem product={JSON.parse(item.product)}>
                        <MdDeleteOutline />
                      </ClearItem>
                    </legend>
                  </li>
                ))}
            </ul>

            <footer>
              <h3 className='big'>GHS {getCartTotal(cart).toLocaleString()}</h3>
              <Link href={'/checkout'}>
                <sub></sub>
                <span>Go to Checkout</span>
                <MdOutlineShoppingCartCheckout />
              </Link>
            </footer>
          </section>
        </section>
      }

      {!isLoading &&
        <section className={wishListToggled ? `${styles.wishListHolder} ${styles.change}` : styles.wishListHolder}>
          <section className={styles.sheet} onClick={toggleWishList}></section>
          <section className={styles.wishList}>
            <header>
              <MdOutlineFavoriteBorder />
              <strong>My WishList</strong>

              <legend>
                <MdClose onClick={toggleWishList} />
              </legend>
            </header>

            <ul>
              {
                wishListItems.map((prod, i) => (
                  <Link href={{ pathname: '/viewProduct', query: { pid: prod.id } }} key={i}>
                    <Image alt='' className='contain' src={prod.image.url} height={70} width={70} />
                    <article>
                      <span>{prod.name}</span>
                      <small style={{ color: 'gray' }}>{prod.category}</small>
                      <strong className='cash'>GH₵ {prod.price.toLocaleString()}</strong>
                    </article>
                    <legend>
                      <MdArrowForward />
                    </legend>
                  </Link>
                ))}
            </ul>
          </section>
        </section>
      }

      {isLoggedIn &&
        <section className={userBoxToggled ? `${styles.userBoxHolder} ${styles.change}` : styles.userBoxHolder}>
          <section className={styles.sheet} onClick={toggleUserBox}></section>
          <section className={styles.userBox}>
            <header>
              <MdOutlineSelfImprovement />
              <strong>Hi {customer.username}</strong>

              <legend>
                <MdClose onClick={toggleUserBox} />
              </legend>
            </header>

            <ul>
              {userList.slice(0, 6).map((item, i) => (
                <Link href={item.target} key={i}>{item.iconEl} <span>{item.tag}</span></Link>
              ))}
            </ul>

            <footer>
              <ul>
                {userList.slice(6, 8).map((item, i) => (
                  <Link href={''} key={i}>{item.iconEl} <span>{item.tag}</span></Link>
                ))}
              </ul>
            </footer>
          </section>
        </section>
      }
    </section>
  );
}

export default TopNav;