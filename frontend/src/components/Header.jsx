import { ShoppingCart, Search, Menu, Heart, X, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* 1. Top Bar */}
      <div className="bg-indigo-600 text-white text-center py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest px-4">
        Limited Time Offer! Free Shipping on orders $50+
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(true)} className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">
              SOM<span className="text-gray-900">CART</span>
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-sm mx-10">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-10 focus:ring-2 focus:ring-indigo-100 outline-none text-xs transition-all"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600" />
            </div>
          </div>

          {/* Auth & Icons Section */}
          <div className="flex items-center gap-2 md:gap-6">
            
            {/* Login/Register Buttons - Desktop */}
            <div className="hidden lg:flex items-center border-r pr-6 gap-4">
              {/* <Link to="/login" className="text-xs font-bold text-gray-600 hover:text-indigo-600 transition-colors uppercase tracking-tight">
                Log In
              </Link> */}
              <Link to="/login" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all active:scale-95">
                Log In
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                <Heart className="w-5 h-5" />
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">0</span>
              </button>

              <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">3</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation (Desktop) */}
      <nav className="hidden md:block border-t border-gray-50 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-3 flex justify-center space-x-12 text-[11px] font-black text-gray-500 uppercase tracking-widest">
          <a href="#" className="hover:text-indigo-600 transition-colors">All Products</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Men's Wear</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Women's Wear</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Electronics</a>
        </div>
      </nav>

      {/* --- SIDEBAR MOBILE MENU --- */}
      <div className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsOpen(false)}></div>
      
      <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-indigo-600">SOMCART</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-50 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
          </div>

          {/* Auth for Mobile */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 rounded-xl text-xs font-bold border border-gray-100">
              <LogIn className="w-4 h-4" /> Log In
            </Link>
            <Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold">
              <UserPlus className="w-4 h-4" /> Sign Up
            </Link>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</p>
            <a href="#" className="block py-3 px-4 text-sm font-bold text-gray-700 hover:bg-indigo-50 rounded-xl">All Collections</a>
            <a href="#" className="block py-3 px-4 text-sm font-bold text-gray-700 hover:bg-indigo-50 rounded-xl">Men's Fashion</a>
            <a href="#" className="block py-3 px-4 text-sm font-bold text-gray-700 hover:bg-indigo-50 rounded-xl">Women's Fashion</a>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-50">
            <p className="text-[10px] text-gray-400 text-center uppercase font-bold tracking-tighter">© 2026 SomCart Store</p>
          </div>
        </div>
      </div>
    </header>
  );
}


export default Header;





















