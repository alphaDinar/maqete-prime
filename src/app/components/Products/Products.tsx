'use client'
import styles from './products.module.css';
import { FC, useEffect } from 'react';
import Link from 'next/link';
import { MdOutlineAddShoppingCart, MdOutlineShoppingCartCheckout, MdStar } from 'react-icons/md';
import Image from 'next/image';
import WishListTag from '../WishListTag/WishListTag';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { itemLoader } from '@/External/lists';
import AddToCart from '../Cart/AddToCart/AddToCart';

interface defType extends Record<string, any> { };

type ProductsProps = {
  productList: string;
  isLoading: boolean;
}

const Products: FC<ProductsProps> = ({ productList, isLoading }) => {
  const products = JSON.parse(productList);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });

  }, [])


  return (
    <section className={styles.products}>
      {!isLoading ?
        products.map((product: defType, i: number) => (
          <div className={styles.product} key={i} data-aos="fade-up" data-aos-delay={100 * (i + 1)}>
            <Link href={{ pathname: '/viewProduct', query: { pid: product.id } }}>
              <Image alt='' className='contain' width={150} height={150} src={product.image.url} />
            </Link>
            <div>
              <sup className={styles.wishList}>
                <WishListTag pid={product.id} />
              </sup>
              <div className={styles.controlBox}>
                <AddToCart product={product} quantity={1} type='checkout'>
                  <MdOutlineShoppingCartCheckout className={styles.checkout} />
                </AddToCart>
              </div>

              <Link href={{ pathname: '/category', query: { cid: product.category } }} style={{ height: 'auto' }}>
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
                  <small className='cash'>(45)</small>
                </p>
              </article>
            </div>
            <AddToCart product={product} quantity={1} type='add' >
              <button>
                <sup></sup>
                <span style={{ color: 'white' }}>Add To Cart</span> <MdOutlineAddShoppingCart />
              </button>
            </AddToCart>
          </div>
        ))
        :
        Array(5).fill('box').map((box, i) => (
          <div className={styles.product} style={{ height: 354 }} key={i} data-aos="fade-up" data-aos-delay={100 * (i + 1)}>
            {itemLoader}
          </div>
        ))
      }
    </section>
  );
}

export default Products;