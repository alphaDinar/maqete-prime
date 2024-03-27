import Image from 'next/image';
import styles from './loader.module.css';
import icon from '../../../../public/icon.png';

const Loader = () => {
  return (
    <section className={styles.loaderBox}>
      <Image alt='' src={icon} width={200} height={200} className='contain' />
    </section>
  );
}

export default Loader;