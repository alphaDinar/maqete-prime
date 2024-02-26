'use client'
import { ReactNode, useState } from "react";
import styles from './panel.module.css';
import { MdLinearScale, MdOutlineAnalytics, MdOutlineCategory, MdOutlineFavoriteBorder, MdOutlineHome, MdOutlineMenu, MdOutlineShoppingCart, MdOutlineShoppingCartCheckout, MdOutlineSmartphone, MdPowerSettingsNew } from "react-icons/md";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { fireAuth } from "@/Firebase/base";

type panelProps = {
  children: ReactNode
}

const Panel = ({ children }: panelProps) => {
  const router = useRouter();
  const pathname = usePathname();


  const topTagList = [
    { tag: 'Home', iconEl: <MdOutlineHome />, target: '/manager' },
    { tag: 'My Orders', iconEl: <MdOutlineShoppingCartCheckout />, target: '/orders' },
  ]

  const lowTagList = [
    { tag: 'Wish List', iconEl: <MdOutlineFavoriteBorder />, target: 'manager/sales' },
    { tag: 'Cart', iconEl: <MdOutlineShoppingCart />, target: 'manager/customers' },
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
        <MdLinearScale className={styles.tag} onClick={toggleSidebar} />
        <header>
          <Link href={'/'}>
            <strong>Maqete</strong>
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