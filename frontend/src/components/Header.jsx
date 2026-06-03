import { ShoppingCart, Search, Menu, Heart, X, LogIn, User, Shield, Package, Users, Globe, Coins, LogOut, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectCartCount } from "../Redux/cartSlice";
import { CURRENCY_FLAGS, CURRENCY_SYMBOLS, LANGUAGES } from "../utils/currency";
import {
  setCurrency,
  setLanguage,
  createCollabSession,
  joinCollabSession,
  leaveCollabSession,
  fetchCollabSession,
} from "../Redux/collabSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  // Dropdown UI states
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrMenu, setShowCurrMenu] = useState(false);
  const [showCollabMenu, setShowCollabMenu] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const { userInfo } = useSelector((state) => state.user);
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);

  // Collab Slice states
  const { activeSession, currency, language, loading, error: collabError } = useSelector((state) => state.collab);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Poll for collaborative session state
  useEffect(() => {
    if (userInfo?.token) {
      dispatch(fetchCollabSession());
      const interval = setInterval(() => {
        dispatch(fetchCollabSession());
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [userInfo, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search)}`);
    setIsOpen(false);
  };

  const handleCreateSession = () => {
    dispatch(createCollabSession(currentLang.flag));
  };

  const handleJoinSession = (e) => {
    e.preventDefault();
    if (!joinCode) return;
    dispatch(joinCollabSession({ sessionCode: joinCode, flag: currentLang.flag }));
    setJoinCode("");
  };

  const handleLeaveSession = () => {
    if (window.confirm("Are you sure you want to leave the collaborative shopping session?")) {
      dispatch(leaveCollabSession());
      setShowCollabMenu(false);
    }
  };

  const copySessionCode = () => {
    if (!activeSession) return;
    navigator.clipboard.writeText(activeSession.sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Banner with Selectors */}
      <div className="bg-indigo-600 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 py-1.5 sm:py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>Limited Time Offer! Free Shipping on orders $50+</div>
          
          <div className="flex items-center gap-4 text-[10px] tracking-normal font-medium">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowLangMenu(!showLangMenu);
                  setShowCurrMenu(false);
                }}
                className="flex items-center gap-1 hover:text-indigo-200 transition-colors uppercase font-bold"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{currentLang.flag} {currentLang.name}</span>
              </button>
              {showLangMenu && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-gray-100 rounded-xl shadow-xl py-1 text-gray-800 z-50 text-xs">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        dispatch(setLanguage(l.code));
                        setShowLangMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50 font-medium flex items-center gap-2"
                    >
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCurrMenu(!showCurrMenu);
                  setShowLangMenu(false);
                }}
                className="flex items-center gap-1 hover:text-indigo-200 transition-colors uppercase font-bold"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>{CURRENCY_FLAGS[currency]} {currency} ({CURRENCY_SYMBOLS[currency]})</span>
              </button>
              {showCurrMenu && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-gray-100 rounded-xl shadow-xl py-1 text-gray-800 z-50 text-xs">
                  {Object.keys(CURRENCY_FLAGS).map((cur) => (
                    <button
                      key={cur}
                      onClick={() => {
                        dispatch(setCurrency(cur));
                        setShowCurrMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50 font-medium flex items-center gap-2"
                    >
                      <span>{CURRENCY_FLAGS[cur]}</span>
                      <span>{cur} ({CURRENCY_SYMBOLS[cur]})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
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
            {/* COLLABORATIVE SHOPPING WIDGET */}
            {userInfo && (
              <div className="relative">
                <button
                  onClick={() => setShowCollabMenu(!showCollabMenu)}
                  className={`flex items-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all border ${
                    activeSession
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 collab-active-glow"
                      : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {activeSession ? "Shopping Group" : "Shop Together"}
                  </span>
                  {activeSession && (
                    <span className="bg-indigo-600 text-white rounded-full text-[9px] px-1.5 py-0.5">
                      {activeSession.members?.length || 1}
                    </span>
                  )}
                </button>

                {showCollabMenu && (
                  <div className="absolute right-0 mt-2.5 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 z-50 text-gray-800 text-xs space-y-3 glassmorphism">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="font-black uppercase text-indigo-600 tracking-wider">Group Shopping</span>
                      <button onClick={() => setShowCollabMenu(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {!activeSession ? (
                      <div className="space-y-3">
                        <p className="text-gray-500 text-[11px] leading-relaxed">
                          Create a group shopping cart to shop with friends and family in real-time. Share cart changes and see active steps!
                        </p>
                        <button
                          onClick={handleCreateSession}
                          disabled={loading}
                          className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {loading ? "Creating..." : "Start Group Cart"}
                        </button>
                        
                        <div className="relative flex py-1 items-center">
                          <div className="flex-grow border-t border-gray-100"></div>
                          <span className="flex-shrink mx-2 text-[10px] text-gray-400 uppercase font-black">or join</span>
                          <div className="flex-grow border-t border-gray-100"></div>
                        </div>

                        <form onSubmit={handleJoinSession} className="flex gap-2">
                          <input
                            placeholder="Code (e.g. COLLAB-123)"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-50 rounded-xl outline-none text-xs border border-gray-100 focus:ring-1 focus:ring-indigo-100"
                          />
                          <button
                            type="submit"
                            disabled={loading}
                            className="bg-gray-900 text-white font-bold px-3.5 rounded-xl hover:bg-black text-[11px]"
                          >
                            Join
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex justify-between items-center">
                          <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Session Code</p>
                            <p className="font-black text-indigo-700 text-sm tracking-widest">{activeSession.sessionCode}</p>
                          </div>
                          <button
                            onClick={copySessionCode}
                            className="p-2 hover:bg-white rounded-lg text-indigo-600 transition-colors"
                            title="Copy code"
                          >
                            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Members & Steps</p>
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {activeSession.members?.map((member, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                                <span className="text-sm">{member.flag}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-[11px] text-gray-900 truncate">
                                    {member.fullName || member.username}
                                  </p>
                                  <p className="text-[9px] text-indigo-500 font-semibold truncate">
                                    {member.activeStep}
                                  </p>
                                </div>
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={handleLeaveSession}
                          className="w-full flex items-center justify-center gap-1.5 border border-red-200 text-red-600 font-bold py-2 rounded-xl hover:bg-red-50 text-[11px] transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Leave Session
                        </button>
                      </div>
                    )}
                    {collabError && <p className="text-red-500 text-[10px] font-medium text-center">{collabError}</p>}
                  </div>
                )}
              </div>
            )}

            <div className="hidden lg:flex items-center border-r pr-6 gap-4">
              {userInfo ? (
                <>
                  <Link
                    to="/my-orders"
                    className="flex items-center gap-2 py-2 px-3 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50"
                  >
                    <Package className="w-4 h-4" /> Orders
                  </Link>
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
                {/* Dual Cart Count */}
                {((activeSession && activeSession.cartItems?.length) || cartCount) > 0 && (
                  <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                    {activeSession ? activeSession.cartItems.length : cartCount}
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
          <Link to="/?category=general" className="hover:text-indigo-600 transition-colors">
            General
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer */}
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

          <form onSubmit={handleSearch} className="mb-6 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-10 text-xs outline-none"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>
          </form>

          <div className="grid grid-cols-1 gap-3 mb-8">
            {userInfo ? (
              <>
                <Link
                  to="/my-orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 border border-indigo-600 text-indigo-600 rounded-xl text-xs font-bold"
                >
                  <Package className="w-4 h-4" /> My Orders
                </Link>
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
              <ShoppingCart className="w-4 h-4" /> Cart ({activeSession ? activeSession.cartItems?.length : cartCount})
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
