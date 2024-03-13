'use client'
import { useEffect, useState } from 'react';
import styles from './category.module.css';
import Products from '../components/Products/Products';
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import TopNav from '../components/TopNav/TopNav';
import Image from 'next/image';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

interface defType extends Record<string, any> { };
const Category = ({ searchParams }: { searchParams: { cid: string } }) => {
  const cid = searchParams.cid;
  const [allProducts, setAllProducts] = useState<defType[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [products, setProducts] = useState<defType[]>([]);
  const [categories, setCategories] = useState<defType[]>([]);
  const [category, setCategory] = useState<defType>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(fireStoreDB, 'Products/');
    const productStream = onSnapshot(query(productsRef, where("category", "==", `${cid}`), orderBy("priority", "desc")), (snapshot) => {
      console.log(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })))
      setAllProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
      setProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
    });

    const categoryStream = onSnapshot(collection(fireStoreDB, 'Categories/'), (snapshot) => {
      const categoriesTemp = snapshot.docs.map((cat) => ({ id: cat.id, ...cat.data() }));
      setCategories(categoriesTemp.filter((el) => el.id !== cid));
      const categoryTemp = categoriesTemp.find((el) => (el.id === cid));
      if (categoryTemp) {
        setCategory(categoryTemp);
        setIsLoading(false)
      }
    });

    return () => {
      productStream();
      categoryStream();
    }
  }, [cid])


  const selectBrand = (val: string) => {
    setSelectedBrand(val);
    if (val === 'All') {
      setProducts(allProducts);
    } else {
      const productsTemp = [...allProducts].filter((prod) => prod.brand === val);
      setProducts(productsTemp);
    }
  }

  return (
    <main className="scroll">
      <TopNav />

      {!isLoading
        ?
        <section className={styles.categoryBox} >
          <section className={styles.top} id='boxNoTop'>
            <section className='pageHeader'>
              <Link href={'/'} className='back'>
                <MdArrowBack />
                <strong>Categories</strong>
              </Link>
            </section>
            <div className={styles.categoryList} id='scrollable'>
              {categories.map((cat, i) => (
                <Link className={styles.category} href={{ pathname: '/category', query: { cid: cat.id } }} key={i}>
                  <sub></sub>
                  <Image alt='' className='contain' src={cat.image.url} width={40} height={40} />
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
            <hr />
            <header>
              <h3><Image alt='' className='contain' src={category.image.url} height={20} width={20} />  {cid}</h3>
            </header>
            <article className={styles.brands} id='scrollable'>
              <span className={selectedBrand === 'All' ? 'myChoice' : 'choice'} onClick={() => selectBrand('All')}>All</span>
              {category.brandList.map((brand: string, i: number) => (
                <span onClick={() => selectBrand(brand)} className={selectedBrand === brand ? 'myChoice' : 'choice'} key={i}>{brand}</span>
              ))}
            </article>
          </section>
          <section id='boxNo'>
            <Products productList={JSON.stringify(products)} isLoading={isLoading} />
          </section>
        </section>
        : <span>loading...</span>
      }
    </main>
  );
}

export default Category;