'use client'
import Link from "next/link";
import styles from '../home.module.css';
import Products from "../components/Products/Products";
import { useEffect, useState } from "react";
import { sortArrival, sortPopular, sortViews } from "@/External/services";
import { collection, onSnapshot } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";

interface defType extends Record<string, any> { };
const ProductBox = () => {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [allProducts, setAllProducts] = useState<defType[]>([]);
  const [products, setProducts] = useState<defType[]>([]);

  useEffect(() => {
    setSelectedChoice('popular');
    const productStream = onSnapshot(collection(fireStoreDB, 'Products/'), (snapshot) => {
      setAllProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
      setProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
    });

    return () => productStream();
  }, [])

  const choiceList = [
    { name: 'Popular Products', tag: 'popular' },
    { name: 'New Arrivals', tag: 'arrival' },
    { name: 'We Think You"ll Love' },
    { name: 'Most Viewed Products' },
  ]
  const handleChoice = (choice: defType) => {
    const allProductsTemp = [...allProducts];
    setSelectedChoice(choice.tag);
    if (choice.tag === 'popular') {
      setProducts(sortPopular(allProductsTemp).slice(0, 5));
    }
    if (choice.tag === 'arrival') {
      setProducts(sortArrival(allProductsTemp).slice(0, 5));
    }
    if (choice.tag === 'views') {
      setProducts(sortViews(allProductsTemp).slice(0, 5));
    }
  }


  return (
    <section className={styles.productBox} id="box">
      <header>
        <strong>Featured Products</strong>
        <small>Discover Our Exclusive Collection: Unveiling the Finest Picks Just for You!.</small>
        <nav>
          {choiceList.map((choice, i) => (
            <span onClick={() => handleChoice(choice)} key={i}>
              {choice.name}
              <sub style={choice.tag == selectedChoice ? { width: '100%' } : { width: '20%' }}></sub>
            </span>
          ))}
          <span><Link href={'/allProducts'}>All Products</Link> <sub></sub></span>
        </nav>
      </header>
      <Products productList={JSON.stringify(products)} />
    </section>
  );
}

export default ProductBox;