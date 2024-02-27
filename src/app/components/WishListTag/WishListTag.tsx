import { addToWishList } from "@/External/services";
import { useWishList } from "@/app/contexts/wishListContext";
import { MdFavorite, MdOutlineFavoriteBorder } from "react-icons/md";

const WishListTag = ({ pid }: { pid: string }) => {
  const { wishList, setWishList } = useWishList();

  const updateWishList = (pid: string) => {
    const itemExists = wishList.find((el) => el === pid);
    if (itemExists) {
      const updatedWishList = wishList.filter((el) => el !== pid);
      setWishList(updatedWishList);
    } else {
      const updatedWishList = [...wishList, pid];
      setWishList(updatedWishList);
    }
  }

  const checkWishList = (pid: string) => {
    const itemExists = wishList.find((el) => el === pid);
    return itemExists;
  }
  return (
    <>
      {checkWishList(pid) ?
        <MdFavorite onClick={() => { updateWishList(pid); addToWishList(pid) }} id="wished" />
        :
        <MdOutlineFavoriteBorder onClick={() => { updateWishList(pid); addToWishList(pid) }} />
      }
    </>
  );
}

export default WishListTag;