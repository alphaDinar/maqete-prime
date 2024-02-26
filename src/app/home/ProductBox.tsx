'use client'
import Link from "next/link";
import styles from '../home.module.css';
import Products from "../components/Products/Products";
import { useEffect, useState } from "react";
import { sortArrival, sortPopular, sortViews } from "@/External/services";

interface defType extends Record<string, any> { };
const ProductBox = () => {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState('[]');

  useEffect(() => {
    setSelectedChoice('Popular Products');
    const allProductsTemp = JSON.parse(localStorage.getItem('maqProducts') || '[]');
    const products: defType[] | [] = sortPopular(allProductsTemp).slice(0, 5);
    setAllProducts(allProductsTemp);
    setProducts(JSON.stringify(products));
  }, [])

  const choiceList = [
    { name: 'Popular Products', tag: 'popular' },
    { name: 'New Arrivals', tag: 'arrival' },
    { name: 'We Think You"ll Love' },
    { name: 'Most Viewed Products' },
  ]
  const handleChoice = (choice: defType) => {
    const allProductsTemp = [...allProducts];
    setSelectedChoice(choice.name);
    if (choice.tag === 'popular') {
      setProducts(JSON.stringify(sortPopular(allProductsTemp).slice(0, 5)));
    }
    if (choice.tag === 'arrival') {
      setProducts(JSON.stringify(sortArrival(allProductsTemp).slice(0, 5)));
    }
    if (choice.tag === 'views') {
      setProducts(JSON.stringify(sortViews(allProductsTemp).slice(0, 5)));
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
              <sub style={choice.name == selectedChoice ? { width: '100%' } : { width: '20%' }}></sub>
            </span>
          ))}
          <span><Link href={'/allProducts'}>All Products</Link> <sub></sub></span>
        </nav>
      </header>
      <Products productList={products} />
    </section>
  );
}

export default ProductBox;