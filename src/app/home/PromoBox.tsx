'use client';
import { sampleImg } from "@/External/lists";
import Image from "next/image";
import styles from '../home.module.css';
import { addToCart, getTimeLeft } from "@/External/services";
import { useEffect, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import Link from "next/link";
import AOS from 'aos';

interface defType extends Record<string, any> { };
const PromoBox = () => {
  const periodList = ['Days', 'Hours', 'Mins', 'Secs'];
  const [timerList, setTimerList] = useState<string[]>([]);
  const [promos, setPromos] = useState<defType[]>([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });


    const productsRef = collection(fireStoreDB, 'Products/');

    const promoStream = onSnapshot(query(productsRef, where("type", "==", "promo"), orderBy("priority", "desc"), limit(2)), (snapshot) => {
      const promosTemp: defType[] = snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() }));
      setPromos(promosTemp);
      setInterval(() => {
        const deadlines = promosTemp.map((el) => el.deadline);
        const updatedTimerList = deadlines.map((el) => getTimeLeft(el));
        setTimerList(updatedTimerList);
      }, 1000);
    });



    return () => promoStream();
  }, [])



  return (
    <section className={styles.promoBox} id='box'>
      {promos.map((product, i) => (
        <div className={styles.promo} key={i} data-aos="fade-right" data-aos-delay={100 * (i + 1)}>
          <Link href={{ pathname: '/viewProduct', query: { pid: product.id } }}>
            <Image alt='' className="contain" width={250} height={250} src={product.image.url} />
          </Link>
          <article>
            <p>
              <Link href={{ pathname: '/viewProduct', query: { pid: product.id } }}>
                <strong>{product.name}</strong>
              </Link>
            </p>
            <p>
              {product.storePrice && <span className='big cancel'>GHS {product.storePrice.toLocaleString()}</span>}
              <h3 className='big price'>GHS {product.price.toLocaleString()}</h3>
            </p>
            <p className={styles.timeBoxHolder}>
              <legend className="timeBox" key={i}>
                {timerList.length > 0 &&
                  timerList[i].split(',').map((el, ii) => (
                    <p key={ii}>
                      <span>{el}</span>
                      <small>{periodList[ii]}</small>
                    </p>
                  ))}
              </legend>
              <button onClick={() => addToCart(product, 1)}>
                <sup></sup>
                <h4>Add To Cart</h4>
                <MdAddShoppingCart />
              </button>
            </p>
          </article>
        </div>
      ))}
    </section>
  );
}

export default PromoBox;