'use client'
import styles from './products.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdFavorite, MdOutlineAddShoppingCart, MdOutlineFavoriteBorder, MdOutlineShoppingCartCheckout, MdStar } from 'react-icons/md';
import Image from 'next/image';
import { sampleImg } from '@/External/lists';
import { addToCart, addToWishList } from '@/External/services';

interface defType extends Record<string, any> { };
const Products = ({ productList }: { productList: string }) => {
  const products = JSON.parse(productList);
  const [wishList, setWishList] = useState<string[]>([]);

  useEffect(() => {
    setWishList(JSON.parse(localStorage.getItem('maqWishList') || '[]'));
    // AOS.init({
    //   duration: "1000",
    // })
  }, [])

  const updateWishList = (pid: string) => {
    const itemExists = wishList.find((el) => el === pid);
    if (itemExists) {
      const updatedWishList = wishList.filter((el) => el !== pid);
      setWishList(updatedWishList);
    } else {
      const updatedWishList = [...wishList, pid];
      setWishList(updatedWishList);
    }
  }

  const checkWishList = (pid: string) => {
    const itemExists = wishList.find((el) => el === pid);
    return itemExists;
  }

  return (
    <section className={styles.products}>
      {products.map((product: defType, i: number) => (
        <div className={styles.product} key={i} data-aos="fade-up" data-aos-delay={100 * 1}>
          {
            product.image.format === 'png' ?
              <Image alt='' className='contain' width={150} height={150} src={product.image.url} />
              :
              <Image alt='' className='cover' width={150} height={150} src={product.image.url} />
          }
          <div>
            <div className={styles.controlBox}>
              <MdOutlineShoppingCartCheckout className={styles.checkout} />
              {
                checkWishList(product.id) ?
                  <MdFavorite id='wished' className={styles.wishList} onClick={() => { addToWishList(product.id), updateWishList(product.id) }} />
                  :
                  <MdOutlineFavoriteBorder className={styles.wishList} onClick={() => { addToWishList(product.id), updateWishList(product.id) }} />
              }
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
          <button onClick={() => addToCart(JSON.stringify(product), 1)}>
            <sup></sup>
            <span style={{ color: 'white' }}>Add To Cart</span> <MdOutlineAddShoppingCart />
          </button>
        </div>

      ))}
    </section>
  );
}

export default Products;