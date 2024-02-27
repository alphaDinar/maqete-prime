'use client'
import styles from '../home.module.css';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCube } from 'swiper/modules';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import 'swiper/css/effect-cube';
import 'swiper/css';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import { TbBolt, TbTruckReturn } from 'react-icons/tb';
import { GiTakeMyMoney } from 'react-icons/gi';

interface defType extends Record<string, any> { };
const HeadBox = () => {
  const headSwiper = useRef<{ swiper: any }>({ swiper: null });
  const imgSwiper = useRef<{ swiper: any }>({ swiper: null });
  const [products, setProducts] = useState<defType[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const colorList = ['whitesmoke', '#F5E987', '#ebebf3'];

  useEffect(() => {
    const productsRef = collection(fireStoreDB, 'Products/');

    const productStream = onSnapshot(query(productsRef, orderBy("priority", "desc"), limit(3)), (snapshot) => {
      setProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
    });

    return () => productStream();
  }, [])

  const changeSlide = () => {
    if (headSwiper.current) {
      imgSwiper.current.swiper.slideNext();
      setCurrentIndex(headSwiper.current.swiper.activeIndex);
      console.log(headSwiper.current.swiper.activeIndex)
    }
  }

  const stopSwiper = () => {
    if (headSwiper.current) {
      headSwiper.current.swiper.autoplay.stop();
    }
  }

  const startSwiper = () => {
    if (headSwiper.current) {
      headSwiper.current.swiper.autoplay.start();
    }
  }

  const slideNext = async () => {
    if (headSwiper.current) {
      headSwiper.current.swiper.slideNext();
      // imgSwiper.current.swiper.slideTo(headSwiper.current.swiper.activeIndex);
    }
  }
  const slidePrev = () => {
    if (headSwiper.current) {
      headSwiper.current.swiper.slidePrev();
      // imgSwiper.current.swiper.slideTo(headSwiper.current.swiper.activeIndex);
    }
  }

  const topItems = [
    { pid: 'pid1', name: 'Samsung', price: 250, description: 'description' },
    { pid: 'pid1', name: 'IPhone', price: 250, description: 'description' },
    { pid: 'pid1', name: 'Air Pods', price: 250, description: 'description' }
  ]

  const sample = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708791507/maqete/samp_kqdepy.png';

  return (
    <section className={styles.headBox} style={{ backgroundColor: colorList[currentIndex] }}>
      <div className={styles.infoBox}>
        <article>
          <TbBolt />
          <legend>
            <span className='cash'>48 hr Delivery</span>
            <span className='cash'>+ For Free</span>
          </legend>
        </article>
        <article>
          <GiTakeMyMoney />
          <legend>
            <span className='cash'>Pay on delivery</span>
            <span className='cash'>+ more methods</span>
          </legend>
        </article>
        <article>
          <TbTruckReturn />
          <legend>
            <span className='cash'>Return Policies</span>
            <span className='cash'>all Purchase methods</span>
          </legend>
        </article>
      </div>

      <section className={styles.left} onMouseEnter={stopSwiper} onMouseLeave={startSwiper}>
        <Swiper
          modules={[Autoplay]}
          speed={1000}
          ref={headSwiper}
          autoplay={{ delay: 4000, disableOnInteraction: true }}
          className={styles.swiper}
          onSlideChange={changeSlide}
        >
          {products.map((product, i) => (
            <SwiperSlide className={styles.slide} key={i}>
              <div className={styles.con}>
                <p>
                  <strong>{product.name}</strong>
                  <small>{product.description}</small>
                </p>
                <Link href={{ pathname: '/viewProduct', query: { pid: product.id } }}>Buy Now <MdArrowForward /></Link>
                <p>
                  {product.storePrice && <h4 className='big cancel'>GHS {product.storePrice.toLocaleString()} </h4>}
                  <h3 className='big price'>GHS {product.price.toLocaleString()}</h3>
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </section>
      <section className={styles.right}>
        <Swiper
          modules={[EffectCube]}
          effect="cube"
          // loop={false}
          ref={imgSwiper}
          speed={1000}
          cubeEffect={{ shadow: false, slideShadows: false, shadowOffset: 10, shadowScale: 0.94 }}
          allowTouchMove={false}
          className={styles.swiper}
        >
          {products.map((product, i) => (
            <SwiperSlide className={styles.slide} key={i}>
              <Image alt='' className='contain' width={350} height={350} src={product.image.url} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>


      <div className={styles.controlBox}>
        <p>
          <MdArrowBack onClick={slidePrev} />
          <MdArrowForward onClick={slideNext} />
        </p>
        <nav>
          {topItems.map((item, i) => (
            i === currentIndex
              ?
              <sub className={styles.change} key={i}></sub>
              :
              <sub key={i}></sub>
          ))}
        </nav>
      </div>


    </section>
  );
}

export default HeadBox;