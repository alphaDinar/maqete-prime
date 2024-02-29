'use client'
import { useEffect, useState } from 'react';
import styles from '../category/category.module.css';
import Products from '../components/Products/Products';
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { sortArrival, sortPopular, sortViews } from "@/External/services";
import { fireStoreDB } from "@/Firebase/base";
import TopNav from '../components/TopNav/TopNav';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

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
            <Link href={'/'}>
              <MdArrowBack className={styles.back} />
            </Link>
            <header>
              <h3>All Products</h3>
            </header>
            <article className={styles.brands}>
              <span style={selectedChoice === 'All' ? { background: 'skyblue', color: 'white' } : { background: '#ffefe3', color: 'black' }} onClick={() => handleChoice('All')}>All</span>
              {choiceList.map((choice, i) => (
                <span onClick={() => handleChoice(choice.tag)} style={selectedChoice === choice.tag ? { background: 'skyblue', color: 'white' } : { background: '#ffefe3', color: 'black' }} key={i}>{choice.name}</span>
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