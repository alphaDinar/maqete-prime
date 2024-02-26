import { IoMdTrophy } from "react-icons/io";
import Panel from "./Panel/Panel";
import styles from './dashboard.module.css';
import Link from "next/link";
import { MdNorthEast, MdOutlineFavoriteBorder, MdOutlineShoppingCart } from "react-icons/md";
import { GiDiamondTrophy, GiWallet } from "react-icons/gi";
import Image from "next/image";

const Dashboard = ({ searchParams }: { searchParams: { uid: string } }) => {
  const uid = searchParams.uid;
  const sample = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708567175/maqete/smartwatch-screen-digital-device_53876-96809_e8rasd.jpg';
  const sample2 = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708567337/maqete/modern-stationary-collection-arrangement_23-2149309652_hkfbcn.jpg';
  const air = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1708567577/maqete/MPNY3-removebg-preview_o1rd8i.png'

  return (
    <Panel>
      <section className={styles.conBox}>
        <section className={styles.top}>
          <section className={styles.statusBox}>
            <Link href={'/orders'}>
              <strong className="big">300</strong>
              <span>Orders</span>
            </Link>
            <Link href={'/orders'} style={{ background: '#bdf2d2' }}>
              <strong className="big">300,000</strong>
              <span>Points</span>
            </Link>
            <Link href={'/orders'} style={{ background: '#f2f6f7' }}>
              <strong className="big">1st</strong>
              <GiDiamondTrophy />
            </Link>
            <Link href={'/topUp'} style={{ background: '#ffeb9d' }}>
              <strong className="big">GHC 5,000</strong>
              <GiWallet />
            </Link>
          </section>

          <nav className={styles.controlBox}>
            <Link href={'/wishList'}>
              <MdOutlineFavoriteBorder />
              <legend>5</legend>
            </Link>
            <Link href={'/cart'}>
              <MdOutlineShoppingCart />
              <legend>6</legend>
            </Link>
          </nav>
        </section>

        <section className={styles.low}>
          <section className={styles.left}>
            <div className={styles.card}>
              <Image alt="" fill sizes="auto" src={sample} />
            </div>
            <div className={styles.card}>
              <Image alt="" fill sizes="auto" src={sample2} />
            </div>
          </section>
          <section className={styles.right}>
            <section>
              <Link href={'/viewOrder'} className={styles.order}>
                <legend>1 month ago</legend>
                <sub></sub>
                <Image alt="" height={200} width={200} src={air} />
                <article>
                  <small>Air pods + Iphone 3 + 3 ...</small>
                  <span>Delivers in 3 days</span>
                  <strong className="big">GHC 4,500</strong>
                </article>
                <p>
                  <MdNorthEast />
                </p>
              </Link>
              <Link href={'/viewOrder'} className={styles.order}>
                <legend>1 month ago</legend>
                <sub></sub>
                <Image alt="" height={200} width={200} src={air} />
                <article>
                  <small>Air pods + Iphone 3 + 3 ...</small>
                  <span>Delivers in 3 days</span>
                  <strong className="big">GHC 4,500</strong>
                </article>
                <p>
                  <MdNorthEast />
                </p>
              </Link>
            </section>
          </section>
        </section>
      </section>
    </Panel>
  );
}

export default Dashboard;