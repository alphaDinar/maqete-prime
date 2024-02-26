'use client'
import { useEffect, useState } from 'react';
import styles from '../home.module.css';
import Products from '../components/Products/Products';
import { collection, onSnapshot } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";

interface defType extends Record<string, any> { };
const CategoryProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [allProducts, setAllProducts] = useState<defType[]>([]);
  const [products, setProducts] = useState<defType[]>([]);

  useEffect(() => {
    const productStream = onSnapshot(collection(fireStoreDB, 'Products/'), (snapshot) => {
      setAllProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
      setProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
    });

    return () => productStream();
  }, [])

  const categoryList = [
    { name: 'Phones' },
    { name: 'headphones' },
    { name: 'Electronics' },
    { name: 'Cars' },
  ]

  return (
    <section className={styles.productBox} id='box'>
      <header>
        <strong>Shop By Category</strong>
        <small>Discover Our Exclusive Collection: Unveiling the Finest Picks Just for You!.</small>
        <nav>
          {categoryList.map((el, i) => (
            <span key={i} onClick={() => { setSelectedCategory(el.name) }}>{el.name} <sub style={el.name == selectedCategory ? { width: '100%' } : { width: '30%' }}></sub></span>
          ))}
        </nav>
      </header>
      <Products productList={JSON.stringify(products)} />
    </section>
  );
}

export default CategoryProducts;