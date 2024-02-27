'use client'
import { useEffect, useState } from 'react';
import styles from '../home.module.css';
import Products from '../components/Products/Products';
import { collection, onSnapshot } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import { sortByCounter, sortByPriority } from '@/External/services';

interface defType extends Record<string, any> { };
const CategoryProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('Phones');
  const [allProducts, setAllProducts] = useState<defType[]>([]);
  const [products, setProducts] = useState<defType[]>([]);
  const [categories, setCategories] = useState<defType[]>([]);


  useEffect(() => {
    const productStream = onSnapshot(collection(fireStoreDB, 'Products/'), (snapshot) => {
      setAllProducts(sortByPriority(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() }))));
      setProducts(sortByPriority(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() }))).filter((el) => el.category === selectedCategory));
    });

    const categoryStream = onSnapshot(collection(fireStoreDB, 'Categories/'), (snapshot) => {
      setCategories(sortByCounter(snapshot.docs.map((cat) => ({ id: cat.id, ...cat.data() }))));
    });

    return () => {
      productStream();
      categoryStream();
    }
  }, [selectedCategory])


  const selectCategory = (val: string) => {
    setSelectedCategory(val);
    const productsTemp = [...allProducts].filter((prod) => prod.category === val);
    setProducts(productsTemp);
  }

  return (
    <section className={styles.productBox} id='box'>
      <header>
        <strong>Shop By Category</strong>
        <small>Discover Our Exclusive Collection: Unveiling the Finest Picks Just for You!.</small>
        <nav>
          {categories.map((cat, i) => (
            <span key={i} onClick={() => { selectCategory(cat.name) }}>{cat.name} <sub style={cat.name == selectedCategory ? { width: '100%' } : { width: '30%' }}></sub></span>
          ))}
        </nav>
      </header>
      <Products productList={JSON.stringify(products)} />
    </section>
  );
}

export default CategoryProducts;