import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Package, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { apiFetch } from "../utils/api";
import { getImageUrl } from "../utils/imageUrl";

const STATUS_COLORS = {
  pending: "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

function MyOrdersPage() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const data = await apiFetch("/api/orders/myorders");
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [userInfo, navigate]);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await apiFetch(`/api/orders/${orderId}/cancel`, { method: "PUT" });
      setMessage("Order cancelled.");
      await fetchOrders();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  if (!userInfo) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Package className="w-7 h-7 text-indigo-600" /> My Orders
        </h1>
        <Link
          to="/cart"
          className="text-sm font-bold text-indigo-600 hover:underline"
        >
          Manage cart →
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(
          (s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                filter === s
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {s}
            </button>
          )
        )}
      </div>

      {message && (
        <p className="mb-4 text-sm text-center text-indigo-600 font-medium">{message}</p>
      )}

      {loading && <p className="text-gray-500">Loading orders...</p>}
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
            className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
          >
            <button
              type="button"
              onClick={() =>
                setExpandedId(expandedId === order._id ? null : order._id)
              }
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
            >
              <div>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="font-black text-indigo-600 text-lg">
                  ${order.totalPrice.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Order #{order._id.slice(-8)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${
                    STATUS_COLORS[order.status] || "bg-gray-100"
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                  {order.paymentStatus}
                </span>
                {expandedId === order._id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedId === order._id && (
              <div className="px-4 pb-4 border-t border-gray-50 pt-4">
                <div className="space-y-3 mb-4">
                  {order.products?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={getImageUrl(item.product?.image)}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover bg-gray-50"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-sm">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">
                          ${item.price?.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {order.shippingAddress && (
                  <p className="text-xs text-gray-500 mb-4">
                    <strong>Shipping:</strong> {order.shippingAddress.street},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.district} {order.shippingAddress.country}
                  </p>
                )}
                {order.status === "pending" && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="flex items-center gap-2 text-red-600 font-bold text-sm hover:underline"
                  >
                    <XCircle className="w-4 h-4" /> Cancel order
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrdersPage;
