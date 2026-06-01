import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useDispatch } from "react-redux";
import { apiFetch } from "../utils/api";
import { getImageUrl } from "../utils/imageUrl";
import { addToCart } from "../Redux/cartSlice";
import WishlistButton from "../components/WishlistButton";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(`/api/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    navigate("/cart");
  };

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Loading...</p>;
  }
  if (error || !product) {
    return <p className="text-center py-20 text-red-500">{error || "Product not found"}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
            {product.category}
          </p>
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-black text-gray-900">{product.name}</h1>
            <WishlistButton productId={product._id} />
          </div>
          <p className="text-3xl font-black text-indigo-600 mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {product.description}
          </p>
          <p className="text-sm font-bold text-gray-500 mb-4">
            Stock: {product.stock} available
          </p>

          <div className="flex items-center gap-4 mb-6">
            <label className="text-xs font-bold text-gray-400 uppercase">Qty</label>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.min(product.stock, Math.max(1, Number(e.target.value))))
              }
              className="w-20 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 text-center text-sm"
            />
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
