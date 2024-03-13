'use client'
import { checkJSONParsable } from "@/External/services";
import { fireAuth, fireStoreDB } from "@/Firebase/base";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Dispatch, ReactNode, createContext, useContext, useState, useEffect } from "react";

interface defType extends Record<string, any> { };

type keywordsContextProviderProps = {
  children: ReactNode;
};

type keywordsContext = {
  keywords: defType[],
  setKeywords: Dispatch<React.SetStateAction<defType[]>>;
}

export const KeywordsContext = createContext<keywordsContext | null>(null);

export const KeywordsContextProvider = ({ children }: keywordsContextProviderProps) => {
  const [keywords, setKeywords] = useState<defType[]>([]);

  useEffect(() => {
    const authStream = onAuthStateChanged(fireAuth, (user) => {
      if (typeof window !== undefined) {
        if (user) {
          const customerStream = onSnapshot(doc(fireStoreDB, 'Customers/' + user.uid), (snapshot) => {
            setKeywords(snapshot.data()!.keywords || []);
          });
          return () => customerStream();
        } else {
          const keyWordsTemp = localStorage.getItem('maqKeyWords');
          if (typeof keyWordsTemp !== undefined && keyWordsTemp && checkJSONParsable(keyWordsTemp)) {
            setKeywords(JSON.parse(keyWordsTemp));
          }
        }
      }
    });
    return () => authStream();
  }, [])

  return (
    <KeywordsContext.Provider value={{ keywords, setKeywords }}>
      {children}
    </KeywordsContext.Provider>
  )
}

export const useKeywords = () => {
  const context = useContext(KeywordsContext);
  if (!context) {
    throw new Error("useKeywordsContext must be within a KeywordsContextProvider");
  }
  return context;
}
