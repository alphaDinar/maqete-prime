import { fireAuth, fireStoreDB } from "@/Firebase/base";
import { useCart } from "@/app/contexts/cartContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FC, ReactNode } from "react";

interface defType extends Record<string, any> { };

type RemFromCartProps = {
  children: ReactNode,
  product: defType;
}

const RemFromCart: FC<RemFromCartProps> = ({ children, product }) => {
  const { cart, setCart } = useCart();
  let cartTemp = [...cart];

  const remove = () => {
    onAuthStateChanged(fireAuth, (user) => {
      const customer = localStorage.getItem('maqCustomer');
      const cart: defType[] = JSON.parse(localStorage.getItem('maqCart') || '[]');
      const pid = product.id;

      const itemExists = cartTemp.find((el) => el.pid === pid);
      if (itemExists) {
        if (itemExists.quantity > 1) {
          itemExists['quantity'] += -1;
          if (user && customer) {
            updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
              cart: cartTemp
            })
            setCart(cartTemp);
          } else {
            localStorage.setItem('maqCart', JSON.stringify(cartTemp));
            setCart(cartTemp);
          }
        } else {
          const updatedCart = [...cart].filter((el) => el.pid !== pid);
          setCart(updatedCart)
          if (user && customer) {
            updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
              cart: updatedCart
            })
          } else {
            localStorage.setItem('maqCart', JSON.stringify(updatedCart));
          }
        }
      }
    })
  }

  return (
    <sup onClick={remove} style={{ cursor: 'pointer' }}>
      {children}
    </sup>
  );
}

export default RemFromCart;