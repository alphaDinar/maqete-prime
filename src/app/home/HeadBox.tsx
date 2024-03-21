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
import { itemLoader, sampleImg } from "@/External/lists";
import Loading from '../components/Loading/Loading';

interface defType extends Record<string, any> { };
const HeadBox = () => {
  const headSwiper = useRef<{ swiper: any }>({ swiper: null });
  const imgSwiper = useRef<{ swiper: any }>({ swiper: null });
  const [products, setProducts] = useState<defType[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const colorList = ['whitesmoke', '#F5E987', '#ebebf3'];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(fireStoreDB, 'Products/');

    const productStream = onSnapshot(query(productsRef, orderBy("priority", "desc"), limit(3)), (snapshot) => {
      setProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
      setIsLoading(false);
    });

    return () => productStream();
  }, [])

  const changeSlide = () => {
    if (headSwiper.current) {
      if (imgSwiper.current.swiper) {
        imgSwiper.current.swiper.slideNext();
        setCurrentIndex(headSwiper.current.swiper.activeIndex);
      }
      // console.log(headSwiper.current.swiper.activeIndex)
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

  const slideNext = () => {
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
    <>

      {!isLoading ?
        <section className={styles.headBox} style={{ backgroundColor: colorList[currentIndex] }}>
          <section className={styles.left} onMouseEnter={stopSwiper} onMouseLeave={startSwiper}>
            <Swiper
              modules={[Autoplay]}
              speed={1000}
              // loop={true}
              ref={headSwiper}
              allowTouchMove={false}
              autoplay={{ delay: 4000 }}
              className={styles.swiper}
              onSlideChange={changeSlide}
            >
              {products.length > 2 && products.map((product, i) => (
                <SwiperSlide className={styles.slide} key={i}>
                  <div className={styles.con}>
                    <article>
                      <strong>{product.name}</strong>
                      <small className='cut2'>{product.description}</small>
                    </article>
                    <Link href={{ pathname: '/viewProduct', query: { pid: product.id } }}>Buy Now <MdArrowForward /></Link>
                    <article>
                      {product.storePrice && <h4 className='big cancel'>GHS {product.storePrice.toLocaleString()} </h4>}
                      <h3 className='big price'>GHS {product.price.toLocaleString()}</h3>
                    </article>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

          </section>
          <section className={styles.right}>
            <Swiper
              modules={[EffectCube]}
              effect="cube"
              loop={true}
              ref={imgSwiper}
              speed={1000}
              cubeEffect={{ shadow: false, slideShadows: false, shadowOffset: 10, shadowScale: 0.94 }}
              allowTouchMove={false}
              className={styles.swiper}
            >
              {products.length > 2 && products.map((product, i) => (
                <SwiperSlide className={styles.slide} key={i}>
                  <Image alt='' className='contain' width={350} height={350} src={product.image.url} />
                </SwiperSlide>
              ))}
            </Swiper>
          </section>

          <div className={styles.controlBox}>
            {/* <p>
              <MdArrowBack onClick={slidePrev} />
              <MdArrowForward onClick={slideNext} />
            </p> */}
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
        :
        <div className={styles.headLoader}>
          <Loading />
        </div>
      }
    </>
  );
}

export default HeadBox;