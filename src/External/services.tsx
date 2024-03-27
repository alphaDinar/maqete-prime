// 'use client';
import { fireAuth, fireStoreDB } from "@/Firebase/base";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

interface defType extends Record<string, any> { };

//Keyword Services
export const addKeyword = (word: string) => {
  onAuthStateChanged(fireAuth, (user) => {
    const customer = localStorage.getItem('maqCustomer');
    const keywords: defType[] = JSON.parse(localStorage.getItem('maqKeywords') || '[]');
    const wordExists = keywords.find((el) => el.val === word);
    if (wordExists) {
      wordExists['count'] += 1;
    } else {
      const keyword = {
        val: word,
        count: 1
      }
      keywords.push(keyword);
    }

    if (user && customer) {
      updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
        keywords: keywords
      })
    } else {
      console.log('king kong');
      localStorage.setItem('maqKeywords', JSON.stringify(keywords));
    }
  })
}

//cartService


export const setToCart = (product: defType, quantity: number) => {
  onAuthStateChanged(fireAuth, (user) => {
    const customer = localStorage.getItem('maqCustomer');
    const cart: defType[] = JSON.parse(localStorage.getItem('maqCart') || '[]');
    const pid = product.id;

    const itemExists = cart.find((prod) => prod.id === pid);
    if (itemExists) {
      itemExists['quantity'] = quantity || 1;
    }
    if (user && customer) {
      updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
        cart: cart
      })
    } else {
      localStorage.setItem('maqCart', JSON.stringify(cart));
    }
  })
}


export const removeFromCart = (product: defType) => {
  onAuthStateChanged(fireAuth, (user) => {
    const customer = localStorage.getItem('maqCustomer');
    const cart: defType[] = JSON.parse(localStorage.getItem('maqCart') || '[]');
    const pid = product.id;

    const itemExists = cart.find((el) => el.pid === pid);
    if (itemExists) {
      if (itemExists.quantity > 1) {
        itemExists['quantity'] += -1;
        if (user && customer) {
          updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
            cart: cart
          })
        } else {
          localStorage.setItem('maqCart', JSON.stringify(cart));
        }
      } else {
        const updatedCart = cart.filter((el) => el.pid !== pid);
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

export const clearCart = () => {
  onAuthStateChanged(fireAuth, (user) => {
    const customer = localStorage.getItem('maqCustomer');
    if (user && customer) {
      updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
        cart: []
      })
    } else {
      localStorage.setItem('maqCart', JSON.stringify('[]'));
    }
  })
}

export const getCartTotal = (cart: defType[]) => {
  const total = cart.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + itemTotal;
  }, 0);
  return total;
}

export const getUpdatedCartTotal = (updatedCart: defType[]) => {
  const total = updatedCart.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;
    return acc + itemTotal;
  }, 0);
  return total;
}


//sortProducts



//orderServices
export const getOrderSetTotal = (orders: defType[]) => {
  const total = orders.reduce((acc, item) => {
    return acc + item.total;
  }, 0);
  return total;
}

export const getOrderQuantity = (cart: defType[]) => {
  const total = cart.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);
  return total;
}


//tokens 
export const genToken = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;
  const uniqueChars = new Set<string>();

  while (result.length < 4) {
    const randomChar = characters.charAt(Math.floor(Math.random() * charactersLength));
    uniqueChars.add(randomChar);
    result = Array.from(uniqueChars).join('');
  }

  return `#${result}`;
};


export const checkJSONParsable = (data: string) => {
  try {
    JSON.parse(data);
    return true;
  } catch (error) {
    return false;
  }
}