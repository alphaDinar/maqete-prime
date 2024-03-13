import { fireAuth, fireStoreDB } from "@/Firebase/base";
import { useCart } from "@/app/contexts/cartContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FC, ReactNode } from "react";

interface defType extends Record<string, any> { };

type AddToCartProps = {
  children : ReactNode,
  product: defType;
  quantity: number;
  type: string;
}

const AddToCart: FC<AddToCartProps> = ({ children, product, quantity, type }) => {
  const router = useRouter();
  const { cart, setCart } = useCart();
  let cartTemp = [...cart];

  const add = () => {
    onAuthStateChanged(fireAuth, (user) => {
      const customer = localStorage.getItem('maqCustomer');
      const pid = product.id;
      const itemExists = cartTemp.find((el) => el.pid === pid);
      if (itemExists) {
        itemExists['quantity'] += quantity;
        setCart(cartTemp);
      } else {
        const cartItem = {
          pid: pid,
          product: JSON.stringify(product),
          price: product.price,
          quantity: quantity
        }
        cartTemp = [...cart, cartItem];
        setCart(cartTemp);
      }

      if (user && customer) {
        if (type === 'checkout') {
          updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
            cart: cartTemp
          })
            .then(() => router.push('/checkout'));
        } else {
          updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
            cart: cartTemp
          })
        }
      } else {
        if (type === 'checkout') {
          localStorage.setItem('maqCart', JSON.stringify(cartTemp));
          router.push('/checkout')
        } else {
          localStorage.setItem('maqCart', JSON.stringify(cartTemp));
        }
      }
    })
  }

  return (
    <sup onClick={add} style={{cursor:'pointer'}}>
      {children}
    </sup>
  );
}

export default AddToCart;