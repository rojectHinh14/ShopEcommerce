import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, clearWishlist, removeFromWishlist } from "../store/slices/wishlistSlice";

export function useWishlist () {
    const wishlist = useSelector(state => state.wishlist);
    const dispatch = useDispatch();

    const addItem = (item) =>{
        dispatch(addToWishlist(item))
    }

    const removeItem = (id) =>{
        dispatch(removeFromWishlist(id))
    }
    const clearItems = () =>{
        dispatch(clearWishlist())
    }
    const isInWishlist = (id) => {
        return wishlist.items.some((item) => item.id === id)
      }

      return {
        wishlist,
        addItem,
        removeItem,
        clearItems,
        isInWishlist
      }


}