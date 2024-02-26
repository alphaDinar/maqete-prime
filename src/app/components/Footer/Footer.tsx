import Link from 'next/link';
import styles from './footer.module.css';
import { MdCall, MdMail, MdSend } from 'react-icons/md';

const Footer = () => {
  return (
    <section className={styles.footerBox} id="box">
      <section className={styles.top}>
        <section className={styles.left}>
          <article>
            <strong>Quick Links</strong>
            <p>
              <Link href={''}>About Us</Link>
              <Link href={''}>News Blog</Link>
            </p>
          </article>
          <article>
            <strong>Contact</strong>
            <p>
              <Link href={''}> <MdCall /> <span>+233 55 842 0368</span> </Link>
              <Link href={''}> <MdMail /> <span>info@maqete.com</span> </Link>
            </p>
          </article>
        </section>
        <section className={styles.right}>
          <article>
          <strong>Get Exclusive Offers & Updates</strong>
          <div className={styles.sendBox}>
            <input type="text" placeholder='email' />
            <MdSend/>
          </div>
          </article>
        </section>
      </section>
    </section>
  );
}

export default Footer;