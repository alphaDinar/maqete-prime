'use client'
import Link from "next/link";
import styles from '../home.module.css';
import Products from "../components/Products/Products";
import { useEffect, useState } from "react";
import { sortArrival, sortPopular, sortViews } from "@/External/services";
import { collection, onSnapshot } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import AOS from "aos";

interface defType extends Record<string, any> { };
const ProductBox = () => {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [allProducts, setAllProducts] = useState<defType[]>([]);
  const [products, setProducts] = useState<defType[]>([]);
  const [itemCount, setItemCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });

    const fixItemCounter =()=>{
      if (typeof window !== undefined) {
        if (window.innerWidth > 1100) {
          setItemCount(5);
        } else {
          setItemCount(4);
        }
      }
    }

    fixItemCounter();

    setSelectedChoice('popular');
    const productStream = onSnapshot(collection(fireStoreDB, 'Products/'), (snapshot) => {
      setAllProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
      setProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
      setIsLoading(false)
    });

    return () => productStream();
  }, [])

  const choiceList = [
    { name: 'Popular Products', tag: 'popular' },
    { name: 'New Arrivals', tag: 'arrival' },
    { name: 'We Think You"ll Love', tag: 'favorite' },
    { name: 'Most Viewed Products', tag: 'views' },
  ]
  const handleChoice = (choice: defType) => {
    const allProductsTemp = [...allProducts];
    setSelectedChoice(choice.tag);
    if (choice.tag === 'popular') {
      setProducts(sortPopular(allProductsTemp).slice(0, itemCount));
    }
    if (choice.tag === 'arrival') {
      setProducts(sortArrival(allProductsTemp).slice(0, itemCount));
    }
    if (choice.tag === 'views') {
      setProducts(sortViews(allProductsTemp).slice(0, itemCount));
    }
  }


  return (
    <section className={styles.productBox} id="boxFull">
      <header>
        <strong>Featured Products</strong>
        <small>Discover Our Exclusive Collection: Unveiling the Finest Picks Just for You!.</small>
        <nav>
          {choiceList.map((choice, i) => (
            <legend key={i} data-aos="fade-right" data-aos-delay={100 * (i + 1)}>
              <span className={choice.tag === selectedChoice ? 'myTab' : 'tab'} onClick={() => handleChoice(choice)}>
                {choice.name}
              </span>
            </legend>
          ))}
          <legend data-aos="fade-right" data-aos-delay={100 * (4 + 1)}>
            <Link className="tab" style={{ color: 'black' }} href={'/allProducts'}>All Products</Link>
          </legend>
        </nav>
      </header>
      <Products productList={JSON.stringify(products.slice(0, itemCount))} isLoading={isLoading} />
    </section>
  );
}

export default ProductBox;