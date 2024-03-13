'use client'
import { checkJSONParsable } from "@/External/services";
import { fireAuth, fireStoreDB } from "@/Firebase/base";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Dispatch, ReactNode, createContext, useContext, useState, useEffect } from "react";

interface defType extends Record<string, any> { };

type cartContextProviderProps = {
  children: ReactNode;
};

type cartContext = {
  cart: defType[],
  setCart: Dispatch<React.SetStateAction<defType[]>>;
}

export const CartContext = createContext<cartContext | null>(null);

export const CartContextProvider = ({ children }: cartContextProviderProps) => {
  const [cart, setCart] = useState<defType[]>([]);

  useEffect(() => {
    const authStream = onAuthStateChanged(fireAuth, (user) => {
      if (typeof window !== undefined) {
        if (user) {
          const customerStream = onSnapshot(doc(fireStoreDB, 'Customers/' + user.uid), (snapshot) => {
            setCart(snapshot.data()!.cart || []);
            localStorage.setItem('maqCart', JSON.stringify(snapshot.data()!.cart));
          });
          return () => customerStream();
        } else {
          const cartTemp = localStorage.getItem('maqCart');
          if (typeof cartTemp !== undefined && cartTemp && checkJSONParsable(cartTemp)) {
            setCart(JSON.parse(cartTemp));
          }
        }
      }
    });
    return () => authStream();
  }, [])

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be within a cartContextProvider");
  }
  return context;
}
