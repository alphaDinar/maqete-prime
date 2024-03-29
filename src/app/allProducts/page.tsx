'use client'
import { useEffect, useState } from 'react';
import styles from '../category/category.module.css';
import Products from '../components/Products/Products';
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import TopNav from '../components/TopNav/TopNav';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';
import { sortArrival, sortPopular, sortViews } from '@/External/sort';

interface defType extends Record<string, any> { };
const Category = ({ searchParams }: { searchParams: { cid: string } }) => {
  const cid = searchParams.cid;
  const [selectedChoice, setSelectedChoice] = useState('All');
  const [allProducts, setAllProducts] = useState<defType[]>([]);
  const [products, setProducts] = useState<defType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(fireStoreDB, 'Products/');
    const productStream = onSnapshot(query(productsRef, orderBy("priority", "desc")), (snapshot) => {
      setAllProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
      setProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
      setIsLoading(false);
    });

    return () => productStream();
  }, [cid])


  const choiceList = [
    { name: 'Popular Products', tag: 'popular' },
    { name: 'New Arrivals', tag: 'arrival' },
    { name: 'We Think You"ll Love', tag: 'favorite' },
    { name: 'Most Viewed Products', tag: 'views' },
  ]

  const handleChoice = (choice: string) => {
    setSelectedChoice(choice);
    const allProductsTemp = [...allProducts];

    if (choice === 'All') {
      setProducts(allProductsTemp);
    } else {
      if (choice === 'popular') {
        setProducts(sortPopular(allProductsTemp));
      }
      if (choice === 'arrival') {
        setProducts(sortArrival(allProductsTemp));
      }
      if (choice === 'views') {
        setProducts(sortViews(allProductsTemp));
      }
    }
  }


  return (
    <main className="scroll">
      <TopNav />

      {!isLoading
        ?
        <section className={styles.categoryBox} id='boxMin'>
          <section className={styles.top}>
            <section className='pageHeader'>
              <Link href={'/'} className='back'>
                <MdArrowBack />
                <strong>All Products</strong>
              </Link>
            </section>
            <article className={styles.brands} id='scrollable'>
              <span className={selectedChoice === 'All' ? 'myChoice' : 'choice'} onClick={() => handleChoice('All')}>All</span>
              {choiceList.map((choice, i) => (
                <span onClick={() => handleChoice(choice.tag)} className={selectedChoice === choice.tag ? 'myChoice' : 'choice'} key={i}>{choice.name}</span>
              ))}
            </article>
          </section>
          <Products productList={JSON.stringify(products)} isLoading={isLoading} />
        </section>
        : <span>loading...</span>
      }
    </main>
  );
}

export default Category;