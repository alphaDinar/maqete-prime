import { paymentMethodList } from '@/External/lists';
import styles from './payBox.module.css';
import Image from 'next/image';

const PayBox = () => {
  return (
    <section className={styles.payBox} id='boxFull'>
      <h4>Pay With</h4>
      <div>
        {Array(4).fill('a').map((counter, ci) => (
          <article key={ci}>
            {paymentMethodList.map((el, i) => (
              <Image alt='' width={100} height={100} src={el.img} key={i} />
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}

export default PayBox;