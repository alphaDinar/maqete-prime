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
export const getTimeLeft = (stamp: number) => {
  const now = new Date().getTime();
  const difference = stamp - now;


  if (difference <= 0) {
    return `00,00,00,00`;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const formattedDays = days < 10 ? '0' + days : days;
  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

  return `${formattedDays},${formattedHours},${formattedMinutes},${formattedSeconds}`;
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

export const getUnixStamp = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const unixTimestamp = dateObj.getTime();

  return unixTimestamp;
}

export const getDateStamp = (stamp: number) => {
  const date = new Date(stamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const getHourGap = (stamp: number) => {
  const date2 = new Date().getTime();
  const hourDifference = (date2 - stamp) / 36e5;
  return Math.floor(hourDifference);
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

export const sortByPriority = (list: defType[]) => {
  const updatedList = list.sort((a: defType, b: defType) => b.priority - a.priority);
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
  const formattedNumber = `+${contact.slice(0, 3)} ${contact.slice(3, 5)} ${contact.slice(5, 8)} ${contact.slice(8)}`;
  return formattedNumber;
}

export const checkContact = (contact: string) => {
  const regex = /^\+233\d{9}$/;
  return regex.test(contact);
}

export const joinContact = (contact: string) => {
  const joinedContact = contact.replace(/\s/g, '');
  return joinedContact;
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