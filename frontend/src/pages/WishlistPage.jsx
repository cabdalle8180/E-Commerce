import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingCart } from "lucide-react";
import { fetchWishlist, toggleWishlistItem } from "../Redux/wishlistSlice";
import { addToCart } from "../Redux/cartSlice";
import { getImageUrl } from "../utils/imageUrl";

function WishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    dispatch(fetchWishlist());
  }, [userInfo, navigate, dispatch]);

  if (!userInfo) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-500 fill-red-500" /> My Wishlist
      </h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && items.length === 0 && (
        <div className="text-center py-16">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
          <Link to="/" className="text-indigo-600 font-bold hover:underline">
            Browse products
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((product) => (
          <div
            key={product._id}
            className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
          >
            <Link to={`/product/${product._id}`}>
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-xl bg-gray-50"
              />
            </Link>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-bold text-gray-900 text-sm hover:text-indigo-600">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-indigo-600 font-black">${product.price.toFixed(2)}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-40"
                >
                  <ShoppingCart className="w-3 h-3" /> Add to Cart
                </button>
                <button
                  onClick={() => dispatch(toggleWishlistItem(product._id))}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                >
                  <Heart className="w-4 h-4 fill-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
