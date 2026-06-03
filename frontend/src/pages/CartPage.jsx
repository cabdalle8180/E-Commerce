import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, Eraser, Users, User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCart,
  selectCartTotal,
} from "../Redux/cartSlice";
import { getImageUrl } from "../utils/imageUrl";
import { formatPrice } from "../utils/currency";
import {
  updateCollabStep,
  updateCollabCartQuantity,
  removeFromCollabCart,
} from "../Redux/collabSlice";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  
  // Personal cart selectors
  const { items: personalItems, loading: personalLoading, error: personalError } = useSelector((state) => state.cart);
  const personalTotal = useSelector(selectCartTotal);

  // Collab cart selectors
  const { activeSession, currency, loading: collabLoading } = useSelector((state) => state.collab);

  const [activeTab, setActiveTab] = useState(activeSession ? "collab" : "personal");

  // Keep active step synced
  useEffect(() => {
    if (activeSession) {
      dispatch(updateCollabStep("Reviewing Cart"));
    }
    return () => {
      if (activeSession) {
        dispatch(updateCollabStep("Browsing Products"));
      }
    };
  }, [activeSession, dispatch]);

  useEffect(() => {
    if (userInfo?.token) {
      dispatch(loadCart());
    }
  }, [userInfo?.id, dispatch]);

  // Set default tab when session becomes active
  useEffect(() => {
    if (activeSession) {
      setActiveTab("collab");
    } else {
      setActiveTab("personal");
    }
  }, [activeSession]);

  const handleClear = () => {
    if (window.confirm("Clear entire personal cart?")) {
      dispatch(clearCart());
    }
  };

  const handlePersonalQty = (id, currentQty, stock, change) => {
    const target = currentQty + change;
    if (target > 0 && target <= stock) {
      dispatch(updateQuantity({ id, quantity: target }));
    }
  };

  const handleCollabQty = (productId, currentQty, stock, change) => {
    const target = currentQty + change;
    if (target > 0 && target <= stock) {
      dispatch(updateCollabCartQuantity({ productId, quantity: target }));
    }
  };

  const activeCartItems = activeTab === "collab" && activeSession
    ? activeSession.cartItems.map((item) => ({
        _id: item.product?._id,
        name: item.product?.name,
        price: item.product?.price || 0,
        image: item.product?.image,
        stock: item.product?.stock || 0,
        quantity: item.quantity,
        addedByUsername: item.addedByUsername,
        addedByFlag: item.addedByFlag,
      }))
    : personalItems;

  const activeTotal = activeTab === "collab" && activeSession
    ? activeSession.cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
    : personalTotal;

  const handleCheckoutClick = () => {
    if (activeTab === "collab") {
      navigate("/checkout?mode=collab");
    } else {
      navigate("/checkout");
    }
  };

  if (activeCartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        {/* Tab Selection for empty state if in collab session */}
        {activeSession && (
          <div className="flex justify-center border-b border-gray-100 mb-8 max-w-sm mx-auto">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === "personal" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <User className="w-3.5 h-3.5" /> Personal
            </button>
            <button
              onClick={() => setActiveTab("collab")}
              className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                activeTab === "collab" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Group Cart
            </button>
          </div>
        )}

        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {activeTab === "collab" ? "Group cart is empty" : "Your cart is empty"}
        </h2>
        <Link
          to="/"
          className="inline-block mt-4 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            {activeTab === "collab" ? <><Users className="w-6 h-6 text-indigo-600" /> Group Cart</> : "Manage Cart"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === "collab"
              ? `Shared Shopping Session: ${activeSession?.sessionCode}`
              : userInfo
              ? "Cart saved to your account"
              : "Log in to save cart across devices"}
          </p>
        </div>

        {/* Tab Selection */}
        {activeSession && (
          <div className="flex bg-gray-100 rounded-xl p-1 text-[11px] font-black uppercase tracking-wide">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === "personal" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <User className="w-3.5 h-3.5" /> Personal
            </button>
            <button
              onClick={() => setActiveTab("collab")}
              className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === "collab" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Group Cart ({activeSession.cartItems.length})
            </button>
          </div>
        )}

        <div className="flex gap-2">
          {activeTab === "personal" && (
            <>
              {!userInfo && (
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-xs font-bold text-indigo-600 border border-indigo-600 rounded-xl hover:bg-indigo-50"
                >
                  Log in to save
                </button>
              )}
              <button
                onClick={handleClear}
                className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-red-600 border border-red-200 rounded-xl hover:bg-red-50"
              >
                <Eraser className="w-4 h-4" /> Clear all
              </button>
            </>
          )}
        </div>
      </div>

      {(personalLoading || collabLoading) && <p className="text-indigo-600 text-sm mb-4">Syncing cart items...</p>}
      {personalError && <p className="text-red-500 text-sm mb-4">{personalError}</p>}

      <div className="space-y-4 mb-8">
        {activeCartItems.map((item) => (
          <div
            key={item._id}
            className={`flex gap-4 bg-white border rounded-2xl p-4 shadow-sm relative transition-all ${
              activeTab === "collab" ? "border-indigo-50 hover:border-indigo-100" : "border-gray-100"
            }`}
          >
            <Link to={`/product/${item._id}`}>
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl bg-gray-50"
              />
            </Link>
            <div className="flex-1">
              <Link to={`/product/${item._id}`}>
                <h3 className="font-bold text-gray-900 text-sm hover:text-indigo-600 line-clamp-1">
                  {item.name}
                </h3>
              </Link>
              <p className="text-indigo-600 font-black text-sm mt-0.5">
                {formatPrice(item.price, currency)}
              </p>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      activeTab === "collab"
                        ? handleCollabQty(item._id, item.quantity, item.stock, -1)
                        : handlePersonalQty(item._id, item.quantity, item.stock, -1)
                    }
                    disabled={item.quantity <= 1}
                    className="p-1 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      activeTab === "collab"
                        ? handleCollabQty(item._id, item.quantity, item.stock, 1)
                        : handlePersonalQty(item._id, item.quantity, item.stock, 1)
                    }
                    disabled={item.quantity >= item.stock}
                    className="p-1 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-gray-400">Max stock: {item.stock}</span>
              </div>
            </div>
            
            <div className="text-right flex flex-col justify-between items-end">
              <div>
                <p className="font-black text-gray-900 text-base">
                  {formatPrice(item.price * item.quantity, currency)}
                </p>
                {activeTab === "collab" && item.addedByUsername && (
                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-[9px] font-bold text-indigo-600 px-2 py-0.5 rounded-full mt-1">
                    <span>{item.addedByFlag}</span>
                    <span>{item.addedByUsername}</span>
                  </span>
                )}
              </div>
              
              <button
                onClick={() =>
                  activeTab === "collab"
                    ? dispatch(removeFromCollabCart(item._id))
                    : dispatch(removeFromCart(item._id))
                }
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-xs text-indigo-500 uppercase font-black tracking-widest">
            {activeTab === "collab" ? "Group Total" : "Subtotal"} ({activeCartItems.length} items)
          </p>
          <p className="text-3xl font-black text-indigo-600 mt-1">
            {formatPrice(activeTotal, currency)}
          </p>
        </div>
        <button
          onClick={handleCheckoutClick}
          className="w-full sm:w-auto bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all text-xs uppercase tracking-widest"
        >
          {activeTab === "collab" ? "Checkout Group Cart" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
}

export default CartPage;
