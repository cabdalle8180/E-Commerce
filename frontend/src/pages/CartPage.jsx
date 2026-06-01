import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, Eraser } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCart,
  selectCartTotal,
} from "../Redux/cartSlice";
import { getImageUrl } from "../utils/imageUrl";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const { items, loading } = useSelector((state) => state.cart);
  const total = useSelector(selectCartTotal);

  useEffect(() => {
    if (userInfo?.token) {
      dispatch(loadCart());
    }
  }, [userInfo?.id, dispatch]);

  const handleClear = () => {
    if (window.confirm("Clear entire cart?")) {
      dispatch(clearCart());
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage Cart</h1>
          <p className="text-sm text-gray-500 mt-1">
            {userInfo
              ? "Cart saved to your account"
              : "Log in to save cart across devices"}
          </p>
        </div>
        <div className="flex gap-2">
          {!userInfo && (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-xs font-bold text-indigo-600 border border-indigo-600 rounded-xl hover:bg-indigo-50"
            >
              Log in to save
            </button>
          )}
          {userInfo && (
            <Link
              to="/my-orders"
              className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              My Orders
            </Link>
          )}
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-red-600 border border-red-200 rounded-xl hover:bg-red-50"
          >
            <Eraser className="w-4 h-4" /> Clear all
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-500 text-sm mb-4">Syncing cart...</p>}

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
          >
            <Link to={`/product/${item._id}`}>
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl bg-gray-50"
              />
            </Link>
            <div className="flex-1">
              <Link to={`/product/${item._id}`}>
                <h3 className="font-bold text-gray-900 text-sm hover:text-indigo-600">
                  {item.name}
                </h3>
              </Link>
              <p className="text-indigo-600 font-black">${item.price.toFixed(2)}</p>
              <p className="text-[10px] text-gray-400">Max stock: {item.stock}</p>
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
                  disabled={item.quantity <= 1}
                  className="p-1 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
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
                  disabled={item.quantity >= item.stock}
                  className="p-1 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
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
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold">Total ({items.length} items)</p>
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
