function HeroBanner({ className = "" }) {
  return (
    <div
      className={`bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 flex items-center justify-center ${className}`}
    >
      <div className="text-center p-8">
        <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-2">
          SomCart
        </p>
        <p className="text-white text-2xl font-black italic tracking-tighter">
          SOM<span className="text-indigo-200">CART</span>
        </p>
      </div>
    </div>
  );
}

export default HeroBanner;
