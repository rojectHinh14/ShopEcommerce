import { useDispatch, useSelector } from "react-redux";
import { addToCart, clearCart, updateQuantity } from "../store/slices/cartSlice";

export function useCart () {
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const addItem = (item) =>{
        dispatch(addToCart(item))
    }

    const removeItem = (id) =>{
        dispatch(removeItem(id))
    }

    const updateItem = (id, quantity) =>{
        dispatch(updateItem({id, quantity}))
    }
    const clearItem = () =>{
        dispatch(clearCart())
    }

    return {
        cart,
        addItem,
        removeItem,
        updateItem,
        clearItem
    }
}
