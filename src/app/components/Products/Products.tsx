'use client'
import styles from './products.module.css';
import { useEffect } from 'react';
import Link from 'next/link';
import { MdOutlineAddShoppingCart, MdOutlineShoppingCartCheckout, MdStar } from 'react-icons/md';
import Image from 'next/image';
import { sampleImg } from '@/External/lists';
import { addToCart } from '@/External/services';
import { useRouter } from 'next/navigation';
import WishListTag from '../WishListTag/WishListTag';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface defType extends Record<string, any> { };
const Products = ({ productList }: { productList: string }) => {
  const router = useRouter();
  const products = JSON.parse(productList);


  useEffect(() => {
    AOS.init({
      duration: 1000,
    });

  }, [])


  return (
    <section className={styles.products}>
      {products.map((product: defType, i: number) => (
        <div className={styles.product} key={i} data-aos="fade-up" data-aos-delay={100 * (i + 1)}>
          <Link href={{ pathname: '/viewProduct', query: { pid: product.id } }}>
            <Image alt='' className='contain' width={150} height={150} src={product.image.url} />
          </Link>
          <div>
            <sup className={styles.wishList}>
              <WishListTag pid={product.id} />
            </sup>
            <div className={styles.controlBox}>
              <MdOutlineShoppingCartCheckout className={styles.checkout} onClick={() => { addToCart(product, 1); router.push('/checkout') }} />
            </div>

            <Link href={``} style={{ height: 'auto' }}>
              <small>
                {product.category}
              </small>
            </Link>
            <Link href={{ pathname: '/viewProduct', query: { pid: product.id } }}>
              <span className='cut' style={{ textAlign: 'center' }}>{product.name}</span>
            </Link>
            <sub className='cash'>GH₵ {product.price.toLocaleString()}</sub>
            <article>
              <p>
                <legend>
                  <MdStar />
                </legend>
                <small>(45)</small>
              </p>
            </article>
          </div>
          <button onClick={() => addToCart(product, 1)}>
            <sup></sup>
            <span style={{ color: 'white' }}>Add To Cart</span> <MdOutlineAddShoppingCart />
          </button>
        </div>

      ))}
    </section>
  );
}

export default Products;