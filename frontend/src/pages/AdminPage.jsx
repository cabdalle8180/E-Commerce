import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Trash2, Plus, Upload, Pencil, Package, X } from "lucide-react";
import { apiFetch } from "../utils/api";
import { getImageUrl } from "../utils/imageUrl";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "general",
  stock: "10",
  isActive: "true",
};

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed"];

function AdminPage() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");

  const fetchProducts = async () => {
    const data = await apiFetch("/api/products?active=false");
    setProducts(data.products || []);
  };

  const fetchOrders = async () => {
    const data = await apiFetch("/api/orders/admin/all");
    setOrders(data.orders || []);
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    if (userInfo.role !== "admin") {
      navigate("/");
      return;
    }
    Promise.all([fetchProducts(), fetchOrders()]).catch((err) =>
      setError(err.message)
    );
  }, [userInfo, navigate]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setPreview("");
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      isActive: String(product.isActive),
    });
    setPreview(getImageUrl(product.image));
    setImageFile(null);
    setTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      setError("Please select a product image");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append("stock", form.stock);
      formData.append("isActive", form.isActive);
      if (imageFile) formData.append("image", imageFile);

      if (editingId) {
        await apiFetch(`/api/products/${editingId}`, {
          method: "PUT",
          body: formData,
        });
        setMessage("Product updated successfully!");
      } else {
        await apiFetch("/api/products", { method: "POST", body: formData });
        setMessage("Product added successfully!");
      }

      resetForm();
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await apiFetch(`/api/products/${id}`, { method: "DELETE" });
      setMessage("Product deleted.");
      if (editingId === id) resetForm();
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateOrder = async (orderId, field, value) => {
    try {
      const body = field === "status" ? { status: value } : { paymentStatus: value };
      await apiFetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      await fetchOrders();
      setMessage("Order updated.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order permanently?")) return;
    try {
      await apiFetch(`/api/orders/${orderId}`, { method: "DELETE" });
      await fetchOrders();
      setMessage("Order deleted.");
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredOrders =
    orderFilter === "all"
      ? orders
      : orders.filter((o) => o.status === orderFilter);

  if (!userInfo || userInfo.role !== "admin") return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setTab("products")}
          className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest ${
            tab === "products" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
            tab === "orders" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          <Package className="w-4 h-4" /> Orders ({orders.length})
        </button>
      </div>

      {(error || message) && (
        <div className="mb-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
        </div>
      )}

      {tab === "products" && (
        <div className="grid lg:grid-cols-2 gap-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                {editingId ? (
                  <><Pencil className="w-5 h-5 text-indigo-600" /> Edit Product</>
                ) : (
                  <><Plus className="w-5 h-5 text-indigo-600" /> Add Product</>
                )}
              </h2>
              {editingId && (
                <button type="button" onClick={resetForm} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <input name="name" value={form.name} onChange={handleChange} placeholder="Product name" required className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required rows={3} className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
            <div className="grid grid-cols-2 gap-3">
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Price" required className="px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
              <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" required className="px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select name="category" value={form.category} onChange={handleChange} className="px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none">
                <option value="general">General</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
              </select>
              <select name="isActive" value={form.isActive} onChange={handleChange} className="px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none">
                <option value="true">Active</option>
                <option value="false">Hidden</option>
              </select>
            </div>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 rounded-2xl p-6 cursor-pointer hover:bg-indigo-50/50">
              <Upload className="w-8 h-8 text-indigo-400 mb-2" />
              <span className="text-xs font-bold text-indigo-600 uppercase">
                {editingId ? "Change image (optional)" : "Upload product image"}
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            {preview && (
              <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-xl mx-auto" />
            )}

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50">
              {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
            </button>
          </form>

          <div>
            <h2 className="font-bold text-gray-900 mb-4">All Products ({products.length})</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {products.map((product) => (
                <div key={product._id} className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-3">
                  <img src={getImageUrl(product.image)} alt={product.name} className="w-14 h-14 object-cover rounded-lg bg-gray-50" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{product.name}</p>
                    <p className="text-indigo-600 text-sm font-black">
                      ${product.price.toFixed(2)} · Stock: {product.stock}
                      {!product.isActive && <span className="text-red-500 ml-2">(hidden)</span>}
                    </p>
                  </div>
                  <button onClick={() => startEdit(product)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div>
          <h2 className="font-bold text-gray-900 mb-4">Manage All Orders</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", ...ORDER_STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setOrderFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
                  orderFilter === s
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="space-y-4">
          {filteredOrders.length === 0 && <p className="text-gray-500">No orders found.</p>}
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-wrap justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="font-black text-indigo-600 text-lg">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.user?.fullName || order.user?.username} · {order.user?.email}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Status</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrder(order._id, "status", e.target.value)}
                      className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-bold outline-none"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Payment</label>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => updateOrder(order._id, "payment", e.target.value)}
                      className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-bold outline-none"
                    >
                      {PAYMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {order.products?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs bg-gray-50 rounded-lg px-3 py-2">
                    {item.product?.image && (
                      <img src={getImageUrl(item.product.image)} alt="" className="w-8 h-8 rounded object-cover" />
                    )}
                    <span>{item.product?.name} × {item.quantity}</span>
                  </div>
                ))}
              </div>
              {order.shippingAddress && (
                <p className="text-xs text-gray-500 mt-3">
                  Ship to: {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.district || ""} {order.shippingAddress.country}
                </p>
              )}
              <button
                onClick={() => handleDeleteOrder(order._id)}
                className="mt-3 flex items-center gap-1 text-red-600 text-xs font-bold hover:underline"
              >
                <Trash2 className="w-3 h-3" /> Delete order
              </button>
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
