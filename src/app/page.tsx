import styles from './home.module.css';
import sampleA from '../../public/pixel.png';
import sampleB from '../../public/sample.webp';
import TopNav from './components/TopNav/TopNav';
import Image from 'next/image';
import { sampleImg } from '@/External/lists';
import Link from 'next/link';
import HeadBox from './home/HeadBox';
import ProductBox from './home/ProductBox';
import PromoBox from './home/PromoBox';
import cosmetics from '../../public/cosmetics.png';
import fash from '../../public/fash.png';
import bag from '../../public/bag.png'
import { MdNorthEast } from 'react-icons/md';
import { TbBolt, TbTruckReturn } from 'react-icons/tb';
import { GiTakeMyMoney } from 'react-icons/gi';
import CategoryProducts from './home/CategoryProducts';
import Footer from './components/Footer/Footer';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { fireStoreDB } from '@/Firebase/base';
import { sortByCounter } from '@/External/services';

interface defType extends Record<string, any> { };
const Home = async () => {
  const testerCount = [0, 0, 0, 0, 0, 0, 0];
  const categoriesRef = collection(fireStoreDB, 'Categories/');
  const categories = sortByCounter(await getDocs(categoriesRef).then((res) => res.docs.map((el) => ({ id: el.id, ...el.data() }))));

  return (
    <main className='scroll'>
      <TopNav />

      <HeadBox />

      <section className={styles.categoryBox} id='box'>
        <h3>Trending Categories</h3>
        <section className={styles.categories}>
          {categories.slice(0, 6).map((category: defType, i) => (
            <Link href={{ pathname: '/category', query: { cid: category.id } }} className={styles.category} style={{ color: 'black' }} key={i}>
              <sub></sub>
              <Image alt='' className='contain' src={category.image.url} width={100} height={100} />
              <span>{category.name}</span>
            </Link>
          ))}
        </section>
      </section>

      <PromoBox />

      <ProductBox />

      <section className={styles.skillBox} id='box'>
        <article>
          <sub></sub>
          <p>
            <TbBolt />
            <strong>48 hr Delivery</strong>
            <small>For Free</small>
          </p>
        </article>
        <article>
          <sub></sub>
          <p>
            <GiTakeMyMoney />
            <strong>Pay on delivery option</strong>
            <small>+ more methods</small>
          </p>
        </article>
        <article>
          <sub></sub>
          <p>
            <TbTruckReturn />
            <strong>Return Policies</strong>
            <small>all Purchase methods</small>
          </p>
        </article>
      </section>

      <section className={styles.featuredBox} id='box'>
        <section className={styles.left}>
          <Link href={''}>
            <Image alt='' src={cosmetics} sizes='auto' />
            <p>
              <strong>Cosmetics</strong>
              <small>Unveil Your Perfect Look</small>
            </p>
            <legend>
              <MdNorthEast />
            </legend>
          </Link>
          <Link href={''} style={{ background: '#bdf2d2' }}>
            <Image alt='' sizes='auto' src={fash} />
            <p>
              <strong>Fashion</strong>
              <small>Unveil Your Perfect Look</small>
            </p>
            <legend>
              <MdNorthEast />
            </legend>
          </Link>
        </section>
        <section className={styles.right}>
          <Link href={''}>
            <div className={styles.imgBox}>
              <Image alt='' src={bag} fill sizes='auto' />
            </div>
            <p>
              <strong>Fashion</strong>
              <small>Unveil Your Perfect Look</small>
            </p>
            <legend>
              <MdNorthEast />
            </legend>
          </Link>
          <Link href={''}>
            <div className={styles.imgBox}>
              <Image alt='' src={sampleB} fill sizes='auto' />
            </div>
            <p>
              <strong>Fashion</strong>
              <small>Unveil Your Perfect Look</small>
            </p>
            <legend>
              <MdNorthEast />
            </legend>
          </Link>
        </section>
      </section>

      <CategoryProducts />

      <Footer />
    </main>
  );
}

export default Home;
