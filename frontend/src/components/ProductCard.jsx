import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/cartSlice";
import { getImageUrl } from "../utils/imageUrl";
import WishlistButton from "./WishlistButton";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock > 0) {
      dispatch(addToCart({ product, quantity: 1 }));
    }
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all relative"
    >
      <div className="absolute top-2 right-2 z-10">
        <WishlistButton productId={product._id} className="bg-white/90 shadow-sm" />
      </div>
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-black text-indigo-600">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
        {product.stock === 0 && (
          <p className="text-[10px] text-red-500 font-bold mt-2">Out of stock</p>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
