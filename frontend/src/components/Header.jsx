import { ShoppingCart, Search, Menu, Heart, X, LogIn, User, Shield } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectCartCount } from "../Redux/cartSlice";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.user);
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search)}`);
    setIsOpen(false);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-indigo-600 text-white text-center py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest px-4">
        Limited Time Offer! Free Shipping on orders $50+
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">
              SOM<span className="text-gray-900">CART</span>
            </h1>
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-sm mx-10"
          >
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search for products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-10 focus:ring-2 focus:ring-indigo-100 outline-none text-xs transition-all"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600" />
            </div>
          </form>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="hidden lg:flex items-center border-r pr-6 gap-4">
              {userInfo ? (
                <>
                  {userInfo.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 py-2 px-3 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50"
                    >
                      <Shield className="w-4 h-4" /> Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 py-3 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    <User className="w-4 h-4" /> Account
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 py-3 px-4 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  <LogIn className="w-4 h-4" /> Log In
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={userInfo ? "/wishlist" : "/login"}
                className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              >
                <Heart className="w-5 h-5" />
                {userInfo && wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="hidden md:block border-t border-gray-50 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-3 flex justify-center space-x-12 text-[11px] font-black text-gray-500 uppercase tracking-widest">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            All Products
          </Link>
          <Link to="/?category=fashion" className="hover:text-indigo-600 transition-colors">
            Fashion
          </Link>
          <Link to="/?category=electronics" className="hover:text-indigo-600 transition-colors">
            Electronics
          </Link>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <h2 className="text-xl font-black text-indigo-600">SOMCART</h2>
            </Link>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-50 rounded-full">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-8">
            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                >
                  <User className="w-4 h-4" /> My Account
                </Link>
                {userInfo.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 border border-indigo-600 text-indigo-600 rounded-xl text-xs font-bold"
                  >
                    <Shield className="w-4 h-4" /> Admin
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                <LogIn className="w-4 h-4" /> Log In
              </Link>
            )}
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold"
            >
              <ShoppingCart className="w-4 h-4" /> Cart ({cartCount})
            </Link>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-50">
            <p className="text-[10px] text-gray-400 text-center uppercase font-bold tracking-tighter">
              © 2026 SomCart Store
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
