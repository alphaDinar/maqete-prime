import { fireAuth, fireStoreDB } from "@/Firebase/base";
import { useCart } from "@/app/contexts/cartContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { FC, ReactNode } from "react";
import { MdDeleteOutline } from "react-icons/md";

interface defType extends Record<string, any> { };

type ClearItemProps = {
  children: ReactNode,
  pid: string
}

const ClearItem: FC<ClearItemProps> = ({ children, pid }) => {
  const { cart, setCart } = useCart();
  const clear = () => {
    onAuthStateChanged(fireAuth, (user) => {
      const customer = localStorage.getItem('maqCustomer');

      const itemExists = cart.find((prod) => prod.id === pid);
      if (itemExists) {
        const updatedCart = [...cart].filter((prod) => prod.id !== pid);
        setCart(updatedCart);
        if (user && customer) {
          updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
            cart: updatedCart
          })
        } else {
          localStorage.setItem('maqCart', JSON.stringify(updatedCart));
        }
      }
    })
  }

  return (
    <legend onClick={clear}>
      {children}
    </legend>
  );
}

export default ClearItem;