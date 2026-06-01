import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  selectCartTotal,
} from "../Redux/cartSlice";
import { getImageUrl } from "../utils/imageUrl";

function CartPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const total = useSelector(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <Link
          to="/"
          className="inline-block mt-4 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-black text-gray-900 mb-8">Shopping Cart</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
          >
            <img
              src={getImageUrl(item.image)}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-xl bg-gray-50"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
              <p className="text-indigo-600 font-black">${item.price.toFixed(2)}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        id: item._id,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                  className="p-1 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        id: item._id,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                  className="p-1 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => dispatch(removeFromCart(item._id))}
                className="mt-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
          <p className="text-3xl font-black text-indigo-600">${total.toFixed(2)}</p>
        </div>
        <Link
          to="/checkout"
          className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm uppercase tracking-widest"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

export default CartPage;
