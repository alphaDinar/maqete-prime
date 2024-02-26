'use client';
import { sampleImg } from "@/External/lists";
import Image from "next/image";
import styles from '../home.module.css';
import { getTimeLeft } from "@/External/services";
import { useEffect, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";

const PromoBox = () => {
  const [timeLeft, setTimeLeft] = useState('');
  const stamp = 1708385654000;

  useEffect(() => {
    setInterval(() => {
      setTimeLeft(getTimeLeft(stamp));
    }, 1000);
  }, [])


  const promos = [0, 0]
  return (
    <section className={styles.promoBox} id='box'>
      {promos.map((item, i) => (
        <div className={styles.promo} key={i}>
          <Image alt='' width={250} height={250} src={sampleImg} />
          <article>
            <p>
              <strong>Samsung A24</strong>
              <small>Lorem ipsum dolor sit amet consectetur adipisicing elit.</small>
            </p>
            <p>
              <span className='big'>GHC 4,000</span>
              <h3 className='big'>GHC 2,500</h3>
            </p>
            <p className={styles.timeBox}>
              <hr />
              <legend className='caps'>{timeLeft}</legend>
              <hr />
              <button>
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