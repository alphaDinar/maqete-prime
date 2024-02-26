'use client';
import { useEffect, useState } from "react";
import Panel from "../Panel/Panel";
import styles from './categories.module.css';
import { collection, onSnapshot } from "firebase/firestore";
import { fireStoreDB } from "@/Firebase/base";
import Image from "next/image";
import { MdAdd, MdEdit, MdNorth, MdNorthEast } from "react-icons/md";
import Link from "next/link";


interface defType extends Record<string, any> { };
const Categories = () => {
  const [allCategories, setAllCategories] = useState<defType[]>([]);
  const [categories, setCategories] = useState<defType[]>([]);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const categoryStream = onSnapshot(collection(fireStoreDB, 'Categories/'), (snapshot) => {
      setCategories(snapshot.docs.map((cat) => ({ id: cat.id, ...cat.data() })));
      setAllCategories(snapshot.docs.map((cat) => ({ id: cat.id, ...cat.data() })));
      setIsLoading(false);
    });

    return () => categoryStream();
  }, [])

  const searchCategories = (name: string, brand: string) => {
    const categoriesTemp = [...allCategories];
    const updatedCategories = categoriesTemp.filter((el) => el.name.toLowerCase().includes(name.toLowerCase()));
    setCategories(updatedCategories);
  }

  const sample = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708791507/maqete/samp_kqdepy.png';

  return (
    <Panel>
      <section className={styles.categoryBox} id="frame">
        <header>
          <h3>Categories</h3>
          <div>
            <input type="text" placeholder="search Name" value={name} onChange={(e) => { setName(e.target.value); searchCategories(e.target.value, brand) }} />
            <input type="text" placeholder="search Brand" value={brand} onChange={(e) => { setBrand(e.target.value); searchCategories(name, e.target.value) }} />
          </div>
        </header>
        {!isLoading ?
          <section className={styles.categories}>
            {categories.map((cat, i) => (
              <div className={styles.category} key={i}>
                <Image className="contain" alt="" src={cat.image.url} width={150} height={150} />
                <p>
                  <strong>{cat.name}</strong>
                  <small className="cash">{cat.brandList.length} brands</small>
                </p>
                <nav>
                  <Link href={''}>
                    <MdNorthEast style={{ background: 'var(--theme)' }} />
                  </Link>
                  <Link href={{ pathname: '/manager/editCategory', query: { category: JSON.stringify(cat) } }}>
                    <MdEdit />
                  </Link>
                </nav>
              </div>
            ))}
            <Link href={'/manager/addCategory'} className='addItem'>
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

export default Categories;