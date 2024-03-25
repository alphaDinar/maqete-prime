'use client'
import { ReactNode, useState } from "react";
import styles from './panel.module.css';
import { MdLinearScale, MdOutlineAnalytics, MdOutlineCategory, MdOutlineHome, MdOutlineMenu, MdOutlineNotifications, MdOutlineShoppingCartCheckout, MdOutlineSmartphone, MdPowerSettingsNew } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

type panelProps = {
  children: ReactNode
}

const Panel = ({ children }: panelProps) => {
  const pathname = usePathname();
  const topTagList = [
    { tag: 'Home', iconEl: <MdOutlineHome />, target: '/manager' },
    { tag: 'Orders', iconEl: <MdOutlineShoppingCartCheckout />, target: '/manager/orders' },
    { tag: 'Categories', iconEl: <MdOutlineCategory />, target: '/manager/categories' },
    { tag: 'Products', iconEl: <MdOutlineSmartphone />, target: '/manager/products' },
    { tag: 'Notifications', iconEl: <MdOutlineNotifications />, target: '/manager/notifications' },
  ]

  const lowTagList = [
    { tag: 'Sales Analytics', iconEl: <MdOutlineAnalytics />, target: '/manager/sales' },
    { tag: 'Customer Analytics', iconEl: <MdOutlineAnalytics />, target: '/manager/customers' },
    { tag: 'Delivery Analytics', iconEl: <MdOutlineAnalytics />, target: '/manager/dispatch' },
  ]

  const [sidebarToggled, setSidebarToggled] = useState(false);

  const toggleSidebar = () => {
    sidebarToggled ? setSidebarToggled(false) : setSidebarToggled(true);
  }



  return (
    <main className={styles.panel}>
      <section className={sidebarToggled ? `${styles.sidebar} ${styles.change}` : styles.sidebar}>
        <MdOutlineMenu className={styles.tag} onClick={toggleSidebar} />
        <header>
          <strong>Maqete</strong>
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
          <a>
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