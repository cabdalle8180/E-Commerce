import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCartTotal, clearCart } from "../Redux/cartSlice";
import { apiFetch } from "../utils/api";
import { getImageUrl } from "../utils/imageUrl";

function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.user);
  const total = useSelector(selectCartTotal);

  const [shipping, setShipping] = useState({
    country: userInfo?.address?.country || "",
    city: userInfo?.address?.city || "",
    district: userInfo?.address?.district || "",
    street: userInfo?.address?.street || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 text-center px-4">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <Link to="/" className="text-indigo-600 font-bold hover:underline">
          Shop Products
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          products: items.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          shippingAddress: shipping,
        }),
      });
      await dispatch(clearCart()).unwrap();
      navigate("/my-orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Checkout</h1>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          Order summary
        </p>
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-3">
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover bg-gray-50"
              />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-indigo-600">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xl font-black text-indigo-600 border-t pt-4">
          Total: ${total.toFixed(2)}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
      >
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Shipping Address
        </p>
        <div className="grid grid-cols-2 gap-3">
          {["country", "city", "district", "street"].map((field) => (
            <input
              key={field}
              name={field}
              value={shipping[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required={field === "city" || field === "street"}
              className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;
