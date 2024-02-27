'use client'
import { Dispatch, ReactNode, createContext, useContext, useState, useEffect } from "react";

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
