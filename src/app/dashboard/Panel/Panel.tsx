'use client'
import { ReactNode, useState } from "react";
import styles from './panel.module.css';
import { MdArrowBack, MdLinearScale, MdOutlineFavoriteBorder, MdOutlineHome, MdOutlineSelfImprovement, MdOutlineShoppingCart, MdOutlineShoppingCartCheckout, MdOutlineSmartphone, MdPowerSettingsNew, MdSelfImprovement } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { fireAuth } from "@/Firebase/base";
import logo from '../../../../public/logo.png';
import logoFav from '../../../../public/logoFav.png';
import Image from "next/image";


type panelProps = {
  children: ReactNode
}

const Panel = ({ children }: panelProps) => {
  const router = useRouter();
  const pathname = usePathname();


  const topTagList = [
    { tag: 'Dashboard', iconEl: <MdOutlineHome />, target: '/dashboard' },
    { tag: 'My Orders', iconEl: <MdOutlineShoppingCartCheckout />, target: '/orders' },
  ]

  const lowTagList = [
    { tag: 'Wish List', iconEl: <MdOutlineFavoriteBorder />, target: '/wishList' },
    { tag: 'Cart', iconEl: <MdOutlineShoppingCart />, target: '/cart' },
    { tag: 'Profile', iconEl: <MdOutlineSelfImprovement />, target: '/profile' },
  ]

  const [sidebarToggled, setSidebarToggled] = useState(false);

  const toggleSidebar = () => {
    sidebarToggled ? setSidebarToggled(false) : setSidebarToggled(true);
  }


  const logout = () => {
    sessionStorage.removeItem('maqCustomer');
    signOut(fireAuth)
      .then(() => router.push('/'));
  }


  return (
    <main className={styles.panel}>
      <section className={sidebarToggled ? `${styles.sidebar} ${styles.change}` : styles.sidebar}>
        <MdArrowBack className={styles.tag} onClick={toggleSidebar} />
        <header>
          <Link href={'/'}>
            <Image alt="" src={window.innerWidth > 1300 ? sidebarToggled ? logoFav : logo : logo} height={50} width={100} className="contain" />
          </Link>
        </header>

        <article>
          <nav>
            {topTagList.map((el, i) => (
              <Link key={i} href={el.target} style={pathname === el.target ? { border: '1px solid #D4D4D4' } : { border: '1px solid transparent' }}  >
                {el.iconEl} <span>{el.tag}</span>
              </Link>
            ))}
          </nav>
          <hr />
          <nav>
            {lowTagList.map((el, i) => (
              <Link key={i} href={el.target} style={pathname === el.target ? { border: '1px solid #D4D4D4' } : { border: '1px solid transparent' }}  >
                {el.iconEl} <span>{el.tag}</span>
              </Link>
            ))}
          </nav>
        </article>

        <footer>
          <a onClick={logout} style={{ cursor: 'pointer' }}>
            <MdPowerSettingsNew />
            <span>Logout</span>
          </a>
        </footer>
      </section>

      <section className={sidebarToggled ? `${styles.conBox} ${styles.change}` : styles.conBox}>
        {children}
      </section>
    </main>
  );
}

export default Panel;