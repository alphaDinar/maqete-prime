'use client'
import { Dispatch, ReactNode, createContext, useContext, useState, useEffect } from "react";
import { fireAuth, fireStoreDB } from "@/Firebase/base";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { checkJSONParsable } from "@/External/services";

interface defType extends Record<string, any> { };

type wishListContextProviderProps = {
  children: ReactNode;
};

type wishListContext = {
  wishList: string[],
  setWishList: Dispatch<React.SetStateAction<string[]>>;
}

export const wishListContext = createContext<wishListContext | null>(null);

export const WishListContextProvider = ({ children }: wishListContextProviderProps) => {
  const [wishList, setWishList] = useState<string[]>([]);

  useEffect(() => {
    const authStream = onAuthStateChanged(fireAuth, (user) => {
      if (typeof window != 'undefined') {
        if (user) {
          const customerStream = onSnapshot(doc(fireStoreDB, 'Customers/' + user.uid), (snapshot) => {
            setWishList(snapshot.data()!.wishList || []);
            localStorage.setItem('maqWishList', JSON.stringify(snapshot.data()!.wishList));
          });
          return () => customerStream();
        } else {
          const wishListTemp = localStorage.getItem('maqWishList');
          if (typeof wishListTemp !== undefined && wishListTemp && checkJSONParsable(wishListTemp)) {
            setWishList(JSON.parse(wishListTemp));
          }
        }
      }
    });
    return () => authStream();
  }, [])

  return (
    <wishListContext.Provider value={{ wishList, setWishList }}>
      {children}
    </wishListContext.Provider>
  )
}

export const useWishList = () => {
  const context = useContext(wishListContext);
  if (!context) {
    throw new Error("useWishListContext must be within a wishListContextProvider");
  }
  return context;
}
