'use client';
import { useEffect, useState } from "react";
import Panel from "../Panel/Panel";
import styles from '../categories/categories.module.css';
import { collection, onSnapshot } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import Image from "next/image";
import { MdAdd, MdEdit, MdNorthEast } from "react-icons/md";
import Link from "next/link";

interface defType extends Record<string, any> { };
const Products = () => {
  const [allProducts, setAllProducts] = useState<defType[]>([]);
  const [products, setProducts] = useState<defType[]>([]);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const productStream = onSnapshot(collection(fireStoreDB, 'Products/'), (snapshot) => {
      setProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
      setAllProducts(snapshot.docs.map((prod) => ({ id: prod.id, ...prod.data() })));
      setIsLoading(false);
    });

    return () => productStream();
  }, [])

  const searchProducts = (name: string, brand: string) => {
    const productsTemp = [...allProducts];
    const updatedProducts = productsTemp.filter((el) => el.name.toLowerCase().includes(name.toLowerCase()));
    setProducts(updatedProducts);
  }

  const sample = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708791507/maqete/samp_kqdepy.png';

  return (
    <Panel>
      <section className={styles.categoryBox} id="frame">
        <header>
          <h3>Products</h3>
          <div>
            <select>
              <option hidden>Payment</option>
              <option value="0">Unpaid</option>
              <option value="1">Paid</option>
            </select>
            <input type="text" placeholder="search Name" value={name} onChange={(e) => { setName(e.target.value); searchProducts(e.target.value, brand) }} />
            <input type="text" placeholder="search Brand" value={brand} onChange={(e) => { setBrand(e.target.value); searchProducts(name, e.target.value) }} />
          </div>
        </header>

        {!isLoading ?
          <section className={styles.categories}>
            {products.map((prod, i) => (
              <div className={styles.category} key={i}>
                <Image className="contain" alt="" src={prod.image.url} width={150} height={150} />
                <p>
                  <strong>{prod.displayName}</strong>
                  <small>{prod.category}</small>
                  <strong className="cash">GHC {prod.price.toLocaleString()}</strong>
                  {/* <small className="cash">{Prod.brandList.length} brands</small> */}
                </p>
                <nav>
                  <Link href={{ pathname: '/manager/editProduct', query: { product: JSON.stringify(prod) } }}>
                    <MdEdit />
                  </Link>
                </nav>
              </div>
            ))}
            <Link href={'/manager/addProduct'} className='addItem'>
              <MdAdd />
            </Link>
          </section>
          :
          <span>loading...</span>
        }
      </section>
    </Panel>
  );
}

export default Products;