'use client';
import { itemLoader, sampleImg } from "@/External/lists";
import Image from "next/image";
import styles from '../home.module.css';
import { useEffect, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import Link from "next/link";
import AOS from 'aos';
import AddToCart from "../components/Cart/AddToCart/AddToCart";
import { getTimeLeft } from "@/External/time";

interface defType extends Record<string, any> { };
const PromoBox = () => {
  const periodList = ['Days', 'Hours', 'Mins', 'Secs'];
  const [timerList, setTimerList] = useState<string[]>([]);
  const [promos, setPromos] = useState<defType[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    AOS.init({
      duration: 1000,
    });


    const productsRef = collection(fireStoreDB, 'Products/');

    const getPromos = async () => {
      const snapshot = await getDocs(query(productsRef, where("type", "==", "promo"), orderBy("priority", "desc"), limit(2)));
      const promosTemp: defType[] = snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() }));
      setPromos(promosTemp);
      setIsLoading(false);
      const interval = setInterval(() => {
        const deadlines = promosTemp.map((el) => el.deadline);
        // console.log(deadlines);
        const updatedTimerList = deadlines.map((el) => getTimeLeft(el));
        setTimerList(updatedTimerList);
      }, 1000);
      return () => clearInterval(interval);
    }

    getPromos();
  }, [])



  return (
    <section className={styles.promoBox} id='box'>
      {!isLoading ?
        promos.map((product, i) => (
          <div className={styles.promo} key={i} data-aos="fade-right" data-aos-delay={100 * (i + 1)}>
            <Link href={{ pathname: '/viewProduct', query: { pid: product.id } }}>
              <Image alt='' className="contain" width={250} height={250} src={product.image.url} />
            </Link>
            <article>
              <ul>
                <Link href={{ pathname: '/viewProduct', query: { pid: product.id } }}>
                  <strong className="cash">{product.displayName}</strong>
                </Link>
              </ul>
              <ul>
                {product.storePrice && <span className='big cancel'>GHS {product.storePrice.toLocaleString()}</span>}
                <h3 className='big price'>GHS {product.price.toLocaleString()}</h3>
              </ul>
              <article className={styles.timeBoxHolder}>
                <legend className="timeBox" key={i}>
                  {timerList.length > 0 &&
                    typeof timerList[i] !== undefined && timerList[i].split(',').map((el, ii) => (
                      <p key={ii}>
                        <span>{el}</span>
                        <small>{periodList[ii]}</small>
                      </p>
                    ))}
                </legend>
                <AddToCart product={product} quantity={1} type="normal">
                  <button>
                    <sup></sup>
                    <h4>Add To Cart</h4>
                    <MdAddShoppingCart />
                  </button>
                </AddToCart>
              </article>
            </article>
          </div>
        ))
        :
        Array(2).fill('box').map((box, i) => (
          <div className={styles.promoLoader} style={{ height: 290 }} key={i}>
            {itemLoader}
          </div>
        ))}
    </section>
  );
}

export default PromoBox;