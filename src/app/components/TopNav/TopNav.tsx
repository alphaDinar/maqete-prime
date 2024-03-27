'use client'
import { userList } from '@/External/lists';
import { addKeyword, getCartTotal } from '@/External/services';
import { fireAuth, fireStoreDB } from '@/Firebase/base';
import { useCart } from '@/app/contexts/cartContext';
import { useWishList } from '@/app/contexts/wishListContext';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdAdd, MdArrowForward, MdClose, MdDeleteOutline, MdMenu, MdOutlineFavoriteBorder, MdOutlinePowerSettingsNew, MdOutlineSelfImprovement, MdOutlineShoppingCart, MdOutlineShoppingCartCheckout, MdRemove, MdSearch, MdSelfImprovement } from 'react-icons/md';
import { TbCategory } from 'react-icons/tb';
import logo from '../../../../public/logo.png';
import AddToCart from '../Cart/AddToCart/AddToCart';
import ClearItem from '../Cart/ClearItem/ClearItem';
import RemFromCart from '../Cart/RemFromCart/RemFromCart';
import Loader from '../Loader/Loader';
import styles from './topNav.module.css';

interface defType extends Record<string, any> { };
const TopNav = () => {
  const router = useRouter();
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
  const [categories, setCategories] = useState<defType[]>([]);
  const [category, setCategory] = useState<defType>({});

  const [userBoxToggled, setUserBoxToggled] = useState(false);
  const [cartBoxToggled, setCartBoxToggled] = useState(false);
  const [wishListToggled, setWishListToggled] = useState(false);
  const [popCartToggled, setPopCartToggled] = useState(false);
  const [categoryBoxToggled, setCategoryBoxToggled] = useState(false);

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

  const toggleCategoryBox = () => {
    categoryBoxToggled ? setCategoryBoxToggled(false) : setCategoryBoxToggled(true);
  }

  const toggleMenu = () => {
    menuToggled ? setMenuToggled(false) : setMenuToggled(true);
  }

  useEffect(() => {
    if (typeof window !== undefined) {
      setWinSize(window.innerWidth);
      window.onresize = () => {
        setWinSize(window.innerWidth);
      }
    }

    const handleScroll = () => {
      if (window.scrollY >= 250) {
        setPopCartToggled(true)
      } else {
        setPopCartToggled(false)
      }
    };

    window.addEventListener('scroll', handleScroll);

    const categoryStream = onSnapshot(collection(fireStoreDB, 'Categories/'), (snapshot) => {
      const categoriesTemp = snapshot.docs.map((cat) => ({ id: cat.id, ...cat.data() }));
      setCategories(categoriesTemp);
      // const categoryTemp = categoriesTemp);
      // if (categoryTemp) {
      //   setCategory(categoryTemp);
      //   setIsLoading(false)
      // }
    });

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

    return () => {
      authStream();
      categoryStream();
      window.addEventListener('scroll', handleScroll);
    }
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

  const logout = () => {
    signOut(fireAuth)
      .then(() => window.location.reload());
  }

  const logoTemp = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708957950/maqete/maqLogo_kded29.png';

  return (
    <section className={styles.topNav}>
      <Link href={'/'}>
        <Image alt='' className='contain' width={100} height={50} src={logo} />
      </Link>

      <div className={`${styles.searchBox} ${styles.change}`} >
        <input type="text" onChange={(e) => { runSearch(e.target.value.toLowerCase()) }} />
        <MdSearch className={styles.search} onClick={toggleSearchBox} />

        <ul>
          {searchResults.map((product, i) => (
            <Link key={i} onClick={toggleSearchBox} href={{ pathname: '/viewProduct', query: { pid: product.id } }}>
              <Image alt='' className='contain' height={30} width={30} src={product.image.url} />
              <small>{product.displayName}</small>
              <MdArrowForward />
            </Link>
          ))}
        </ul>
      </div>

      {
        !isLoading ?
          isLoggedIn ?
            <nav className={winSize > 500 ? styles.controlBox : menuToggled ? `${styles.controlBox} ${styles.change}` : styles.controlBox}>
              <a onClick={toggleCategoryBox}>
                <TbCategory />
              </a>
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
              <a onClick={logout} className={styles.logoutTab}>
                <MdOutlinePowerSettingsNew />
              </a>
              <MdMenu className={styles.tag} onClick={toggleMenu} />
            </nav>
            :
            <nav className={winSize > 500 ? styles.controlBox : menuToggled ? `${styles.controlBox} ${styles.change}` : styles.controlBox}>
              <a onClick={toggleCategoryBox}>
                <TbCategory />
              </a>
              <Link href={'/login'}>
                <MdArrowForward />
                <legend>Login</legend>
              </Link>
              <Link href={'/register'}>
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

      {
        !isLoading &&
        <section className={categoryBoxToggled ? `${styles.categoryBoxHolder} ${styles.change}` : styles.categoryBoxHolder}>
          <section className={styles.sheet} onClick={toggleCategoryBox}></section>
          <section className={styles.categoryBox}>
            <header>
              <TbCategory />
              <strong>Categories</strong>

              <legend>
                <MdClose onClick={toggleCategoryBox} />
              </legend>
            </header>

            <ul>
              {categories.map((cat, i) => (
                <Link href={{ pathname: '/category', query: { cid: cat.id } }} key={i}> <strong>{cat.name}</strong>  <MdArrowForward /> </Link>
              ))}
            </ul>
          </section>
        </section>
      }

      {
        !isLoading &&
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
                      <Image alt='' className='contain' src={item.img} height={70} width={70} />
                    }
                    <article>
                      <small>{item.name}</small>
                      <strong className='cash'>GH₵ {(item.quantity * item.price).toLocaleString()}</strong>
                      <nav>
                        <RemFromCart pid={item.id}>
                          <MdRemove />
                        </RemFromCart>
                        <span className='cash'>{item.quantity}</span>
                        <AddToCart product={item} quantity={1} type='normal'>
                          <MdAdd />
                        </AddToCart>
                      </nav>
                    </article>
                    <legend className={styles.remove}>
                      <ClearItem pid={item.id}>
                        <MdDeleteOutline />
                      </ClearItem>
                    </legend>
                  </li>
                ))}
            </ul>


            {cart.length > 0 &&
              <footer>
                <h3 className='big'>GHS {getCartTotal(cart).toLocaleString()}</h3>
                <Link href={'/checkout'}>
                  <sub></sub>
                  <span>Go to Checkout</span>
                  <MdOutlineShoppingCartCheckout />
                </Link>
              </footer>
            }
          </section>

          <a onClick={() => { toggleCartBox(); setPopCartToggled(false) }} style={cart.length > 0 && popCartToggled ? { right: 10 } : { right: -100 }} className={styles.popCart}>
            <span className='cash'>{cart.length}</span>
            <MdOutlineShoppingCart />
          </a>

        </section>
      }

      {
        !isLoading &&
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
                      <span>{prod.displayName}</span>
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

      {
        isLoggedIn &&
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
              {userList.slice(0, 3).map((item, i) => (
                <Link href={item.target} key={i}>{item.iconEl} <span>{item.tag}</span></Link>
              ))}
            </ul>

            <footer>
              <ul>
                {userList.slice(6, 8).map((item, i) => (
                  <Link href={''} key={i}>{item.iconEl} <span>{item.tag}</span></Link>
                ))}
                <a onClick={logout} style={{ color: 'tomato', fontWeight: 600, cursor: 'pointer' }}> <MdOutlinePowerSettingsNew /> <span>Logout</span></a>
              </ul>
            </footer>
          </section>
        </section>
      }
    </section >
  );
}

export default TopNav;