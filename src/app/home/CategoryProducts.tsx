'use client'
import { useEffect, useState } from 'react';
import styles from '../home.module.css';
import Products from '../components/Products/Products';

const CategoryProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState('[]');

  useEffect(() => {
    const products: [] = JSON.parse(localStorage.getItem('maqProducts') || '[]').slice(0, 5);
    setProducts(JSON.stringify(products));
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
          {categoryList.map((el,i) => (
            <span key={i} onClick={() => { setSelectedCategory(el.name) }}>{el.name} <sub style={el.name == selectedCategory ? { width: '100%' } : { width: '30%' }}></sub></span>
          ))}
        </nav>
      </header>
      <Products productList={products} />
    </section>
  );
}

export default CategoryProducts;