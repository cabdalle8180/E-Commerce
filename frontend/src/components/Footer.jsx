import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-black text-xl mb-3">
            SOM<span className="text-indigo-400">CART</span>
          </h3>
          <p className="text-sm leading-relaxed">
            Your trusted online store. Quality products, secure checkout, and fast delivery.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link to="/?category=fashion" className="hover:text-white transition-colors">Fashion</Link></li>
            <li><Link to="/?category=electronics" className="hover:text-white transition-colors">Electronics</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Manage Cart</Link></li>
            <li><Link to="/my-orders" className="hover:text-white transition-colors">My Orders</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
            <li><Link to="/profile" className="hover:text-white transition-colors">My Account</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs">
        © {new Date().getFullYear()} SomCart. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
