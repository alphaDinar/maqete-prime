'use client'
import { useEffect, useState } from 'react';
import styles from '../home.module.css';
import Products from '../components/Products/Products';
import { collection, onSnapshot } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import { sortByCounter, sortByPriority } from '@/External/services';
import AOS from 'aos';

interface defType extends Record<string, any> { };
const CategoryProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('Phones');
  const [allProducts, setAllProducts] = useState<defType[]>([]);
  const [products, setProducts] = useState<defType[]>([]);
  const [categories, setCategories] = useState<defType[]>([]);
  const [itemCount, setItemCount] = useState(5);
  // const [winSize, setWinSize] = useState(1300);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    AOS.init({
      duration: 1000
    });

    const fixItemCounter = () => {
      if (typeof window !== undefined) {
        if (window.innerWidth > 1100) {
          setItemCount(5);
        } else {
          setItemCount(4);
        }
      }
    }

    fixItemCounter();


    const productStream = onSnapshot(collection(fireStoreDB, 'Products/'), (snapshot) => {
      setAllProducts(sortByPriority(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() }))));
      setProducts(sortByPriority(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() }))).filter((el) => el.category === selectedCategory));
      setIsLoading(false);
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
    <section className={styles.productBox} id='boxFull'>
      <header>
        <strong>Shop By Category</strong>
        <small>Discover Our Exclusive Collection: Unveiling the Finest Picks Just for You!.</small>
        <nav>
          {categories.map((cat, i) => (
            <legend key={i} data-aos="fade-right" data-aos-delay={100 * (i + 1)}>
              <span onClick={() => { selectCategory(cat.name) }} className={cat.name == selectedCategory ? 'myTab' : 'tab'}>{cat.name}</span>
            </legend>
          ))}
        </nav>
      </header>
      <Products productList={JSON.stringify(products.slice(0, itemCount))} isLoading={isLoading} />
    </section>
  );
}

export default CategoryProducts;