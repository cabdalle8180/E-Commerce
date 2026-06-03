import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Package, XCircle, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";
import { apiFetch } from "../utils/api";
import { getImageUrl } from "../utils/imageUrl";

const STATUS_COLORS = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border border-blue-200",
  shipped: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  delivered: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

function MyOrdersPage() {
  const { userInfo } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const isAdmin = userInfo?.role === "admin";

  const fetchOrders = async () => {
    try {
      setError("");
      const endpoint = isAdmin ? "/api/orders/admin/all" : "/api/orders/myorders";
      const data = await apiFetch(endpoint);
      setOrders(data.orders || []);
    } catch (err) {
      setOrders([]);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchOrders();
    }
  }, [userInfo, isAdmin]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await apiFetch(`/api/orders/${orderId}/cancel`, { method: "PUT" });
      setMessage("Order cancelled successfully.");
      await fetchOrders();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setError("");
      setMessage("");
      await apiFetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setMessage("Order status updated successfully.");
      await fetchOrders();
    } catch (err) {
      setError(err.message || "Failed to update order status");
    }
  };

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          {isAdmin ? (
            <>
              <ShieldAlert className="w-7 h-7 text-indigo-600 animate-pulse" />
              All Customer Orders
            </>
          ) : (
            <>
              <Package className="w-7 h-7 text-indigo-600" />
              My Orders
            </>
          )}
        </h1>
        
        {!isAdmin && (
          <Link
            to="/cart"
            className="text-sm font-bold text-indigo-600 hover:underline"
          >
            Manage cart →
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(
          (s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                filter === s
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          )
        )}
      </div>

      {message && (
        <p className="mb-4 text-sm text-center text-green-600 font-medium bg-green-50 py-2 rounded-xl border border-green-100">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-4 text-sm text-center text-red-500 font-medium bg-red-50 py-2 rounded-xl border border-red-100">
          {error}
        </p>
      )}

      {loading && <p className="text-gray-500 text-sm">Loading orders...</p>}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 mb-4">No orders found.</p>
          <Link to="/" className="text-indigo-600 font-bold hover:underline">
            Start shopping
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((order) => (
          <div
            key={order._id}
            className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all ${
              isAdmin ? "border-indigo-100 hover:border-indigo-200" : "border-gray-100"
            }`}
          >
            <div
              className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-gray-50/50"
              onClick={() =>
                setExpandedId(expandedId === order._id ? null : order._id)
              }
            >
              <div>
                <p className="text-[10px] text-gray-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="font-black text-indigo-600 text-lg">
                  ${order.totalPrice.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  Order #{order._id.slice(-8)}
                  {isAdmin && (
                    <span className="text-[10px] text-gray-400 ml-2">
                      · {order.user?.fullName || order.user?.username}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Exactly ONE clear status badge/selector based on backend status value */}
                {isAdmin ? (
                  <select
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className={`text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg outline-none cursor-pointer border ${
                      STATUS_COLORS[order.status] || "bg-gray-100"
                    }`}
                  >
                    {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                      <option key={s} value={s} className="bg-white text-gray-800">
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg border ${
                      STATUS_COLORS[order.status] || "bg-gray-100"
                    }`}
                  >
                    {order.status}
                  </span>
                )}

                {expandedId === order._id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedId === order._id && (
              <div className="px-4 pb-4 border-t border-gray-50 pt-4 bg-gray-50/20">
                <div className="space-y-3 mb-4">
                  {order.products?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={getImageUrl(item.product?.image)}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-900">
                          {item.product?.name || "Product Unavailable"}
                        </p>
                        <p className="text-xs text-gray-500">
                          ${(item.price || 0).toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <span className="uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {order.paymentStatus}
                    </span>
                  </p>
                  
                  {order.shippingAddress && (
                    <p>
                      <strong>Shipping Address:</strong> {order.shippingAddress.street},{" "}
                      {order.shippingAddress.city}, {order.shippingAddress.district}{" "}
                      {order.shippingAddress.country}
                    </p>
                  )}

                  {isAdmin && order.user && (
                    <p>
                      <strong>Customer Details:</strong> {order.user.fullName} (@{order.user.username}) · {order.user.email}
                    </p>
                  )}

                  {order.status === "pending" && !isAdmin && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="flex items-center gap-2 text-red-600 font-bold hover:underline mt-4 text-xs"
                    >
                      <XCircle className="w-4 h-4" /> Cancel Order
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrdersPage;
