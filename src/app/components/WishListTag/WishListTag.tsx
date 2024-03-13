import { fireAuth, fireStoreDB } from "@/Firebase/base";
import { useWishList } from "@/app/contexts/wishListContext";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { FC } from "react";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";

type wishListProps = {
  pid: string
}

const WishListTag: FC<wishListProps> = ({ pid }) => {
  const { wishList, setWishList } = useWishList();

  const updateWishList = (pid: string) => {
    onAuthStateChanged(fireAuth, (user) => {
      const customer = localStorage.getItem('maqCustomer');
      const wishList: string[] = JSON.parse(localStorage.getItem('maqWishList') || '[]');

      const itemExists = wishList.find((el) => el === pid);
      if (itemExists) {
        const updatedWishList = [...wishList].filter((el) => el !== pid);
        setWishList(updatedWishList);
        if (user && customer) {
          updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
            wishList: updatedWishList
          })
        } else {
          localStorage.setItem('maqWishList', JSON.stringify(updatedWishList));
        }
      } else {
        const updatedWishList = [...wishList, pid];
        setWishList(updatedWishList);
        if (user && customer) {
          updateDoc(doc(fireStoreDB, 'Customers/' + user?.uid), {
            wishList: updatedWishList
          })
        } else {
          localStorage.setItem('maqWishList', JSON.stringify(updatedWishList));
        }
      }
    })
  }

  const checkWishList = (pid: string) => {
    const itemExists = wishList.find((el) => el === pid);
    return itemExists;
  }
  
  return (
    <>
      {checkWishList(pid) ?
        <MdFavorite onClick={() => { updateWishList(pid) }} id="wished" />
        :
        <MdOutlineFavoriteBorder onClick={() => { updateWishList(pid) }} />
      }
    </>
  );
}

export default WishListTag;