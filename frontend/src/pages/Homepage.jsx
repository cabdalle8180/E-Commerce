import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiFetch } from "../utils/api";
import ProductCard from "../components/ProductCard";
import heroImage from "../assets/hero.png";

const CATEGORIES = ["all", "electronics", "fashion", "general"];

function Homepage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (category !== "all") params.set("category", category);

        const query = params.toString();
        const data = await apiFetch(`/api/products${query ? `?${query}` : ""}`);
        setProducts(data.products || []);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <main>
      <section className="relative bg-indigo-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-3">
              Welcome to SomCart
            </p>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
              Shop smarter with local deals
            </h1>
            <p className="text-indigo-100 text-sm mb-8 max-w-md">
              Discover quality products with fast delivery. Free shipping on orders over $50.
            </p>
            <Link
              to="#products"
              className="inline-block bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors"
            >
              Shop Now
            </Link>
          </div>
          <div className="hidden md:block">
            <img
              src={heroImage}
              alt="Shopping"
              className="rounded-2xl shadow-2xl w-full max-h-80 object-cover"
            />
          </div>
        </div>
      </section>

      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-black text-gray-900">All Products</h2>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 text-sm outline-none focus:ring-2 focus:ring-indigo-100 min-w-[200px]"
            />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-colors ${
                  category === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <p className="text-center text-gray-500 py-12">Loading products...</p>
        )}
        {error && (
          <p className="text-center text-red-500 py-12">{error}</p>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-500 py-12">
            No products yet. Admin can add products from the dashboard.
          </p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Homepage;
