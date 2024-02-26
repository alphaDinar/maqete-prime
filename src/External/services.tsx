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
export const addToCart = (product: string, quantity: number) => {
  onAuthStateChanged(fireAuth, (user) => {
    const customer = localStorage.getItem('maqCustomer');
    const products: defType[] = JSON.parse(localStorage.getItem('maqProducts') || '[]');
    const cart: defType[] = JSON.parse(localStorage.getItem('maqCart') || '[]');
    const pid = JSON.parse(product).id;

    const finalProduct: defType = products.find((prod) => prod.id === pid) || {};
    if (Object.keys(finalProduct).length > 0) {
      const price = finalProduct.price;

      const itemExists = cart.find((el) => el.pid === pid);
      if (itemExists) {
        itemExists['quantity'] += quantity;
      } else {
        const cartItem = {
          pid: pid,
          product: JSON.stringify(finalProduct),
          price: price,
          quantity: quantity
        }
        cart.push(cartItem);
      }

      if (user && customer) {
        updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
          cart: cart
        })
      } else {
        localStorage.setItem('maqCart', JSON.stringify(cart));
      }
    }
  })
}

export const removeFromCart = (product: string) => {
  onAuthStateChanged(fireAuth, (user) => {
    const customer = localStorage.getItem('maqCustomer');
    const products: defType[] = JSON.parse(localStorage.getItem('maqProducts') || '[]');
    const cart: defType[] = JSON.parse(localStorage.getItem('maqCart') || '[]');
    const pid = JSON.parse(product).id;

    const finalProduct: defType = products.find((prod) => prod.id === pid) || {};
    if (Object.keys(finalProduct).length > 0) {
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
    }
  })
}

export const clearItem = (product: string) => {
  onAuthStateChanged(fireAuth, (user) => {
    const customer = localStorage.getItem('maqCustomer');
    const products: defType[] = JSON.parse(localStorage.getItem('maqProducts') || '[]');
    const cart: defType[] = JSON.parse(localStorage.getItem('maqCart') || '[]');
    const pid = JSON.parse(product).id;

    const finalProduct: defType = products.find((prod) => prod.id === pid) || {};
    if (Object.keys(finalProduct).length > 0) {
      const itemExists = cart.find((el) => el.pid === pid);
      if (itemExists) {
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

export const getCartTotal = () => {
  const cart: defType[] = JSON.parse(localStorage.getItem('maqCart') || '[]');
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


//wishListService
export const addToWishList = (pid: string) => {
  onAuthStateChanged(fireAuth, (user) => {
    const customer = localStorage.getItem('maqCustomer');
    const wishList: string[] = JSON.parse(localStorage.getItem('maqWishList') || '[]');

    const itemExists = wishList.find((el) => el === pid);
    if (itemExists) {
      const updatedWishList = wishList.filter((el) => el !== pid);
      if (user && customer) {
        updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
          wishList: updatedWishList
        })
      } else {
        localStorage.setItem('maqWishList', JSON.stringify(updatedWishList));
      }
    } else {
      wishList.push(pid);
      if (user && customer) {
        updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
          wishList: wishList
        })
      } else {
        localStorage.setItem('maqWishList', JSON.stringify(wishList));
      }
    }
  })
}

//sortProducts
export const sortPopular = (products: defType[]) => {
  const updatedProducts = products.sort((a: defType, b: defType) => b.views - a.views);
  return updatedProducts;
}

export const sortArrival = (products: defType[]) => {
  const updatedProducts = products.sort((a: defType, b: defType) => b.timestamp - a.timestamp);
  return updatedProducts;
}

export const sortViews = (products: defType[]) => {
  const updatedProducts = products.sort((a: defType, b: defType) => b.views - a.views);
  return updatedProducts;
}


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



// timeServices
export const getTimeLeft = (unixTimestamp: number) => {
  const now = new Date().getTime();
  const difference = unixTimestamp - now;

  if (difference <= 0) {
    return 'Timer expired';
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  if (days < 0) {
    return `${hours} : ${minutes} : ${seconds}`;
  } else {
    return `${days} days : ${hours} : ${minutes} : ${seconds}`;
  }
}

export const getTimeSince = (date: number) => {
  const currentDate = new Date();
  const timeElapsed = currentDate.valueOf() - new Date(date).valueOf();
  const seconds = Math.floor(timeElapsed / 1000);
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  }
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const inputYear = new Date(date).getFullYear();
  const inputMonth = new Date(date).getMonth();
  const yearDifference = currentYear - inputYear;
  const monthDifference = currentMonth - inputMonth;
  if (yearDifference === 0) {
    if (monthDifference === 1) {
      return '1 month ago';
    } else {
      return `${monthDifference} months ago`;
    }
  } else if (yearDifference === 1 && monthDifference < 0) {
    return '11 months ago';
  } else {
    if (yearDifference === 1) {
      return '1 year ago';
    } else {
      return `${yearDifference} years ago`;
    }
  }
}


//sorting
export const sortByTime = (list: defType[]) => {
  const updatedList = list.sort((a: defType, b: defType) => b.timestamp - a.timestamp);
  return updatedList;
}

export const sortByCounter = (list: defType[]) => {
  const updatedList = list.sort((a: defType, b: defType) => a.counter - b.counter);
  return updatedList;
}

export const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

export const getRealDate = (timestamp: number) => {
  const dt = new Date(timestamp);
  dt.setDate(dt.getDate());

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[dt.getMonth()];

  const formattedDate = `${dt.getDate()}${getOrdinalSuffix(dt.getDate())} ${month}, ${dt.getFullYear()}`;
  return formattedDate;
}

export const getOrderDeadline = (timestamp: number): string => {
  const dt = new Date(timestamp);
  dt.setDate(dt.getDate() + 2);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[dt.getMonth()];

  const formattedDate = `${dt.getDate()}${getOrdinalSuffix(dt.getDate())} ${month}, ${dt.getFullYear()}`;
  return formattedDate;
};

//phone
export const fixContact = (contact: string) => {
  // const digitsOnly = contact.replace(/\D/g, '');
  const formattedNumber = `+${contact.slice(0, 3)} ${contact.slice(3, 5)} ${contact.slice(5, 8)} ${contact.slice(8)}`;
  return formattedNumber;
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