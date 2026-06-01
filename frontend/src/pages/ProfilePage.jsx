import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Package, Upload, User, Lock } from "lucide-react";
import {
  clearUserInfo,
  fetchProfile,
  updateProfile,
  uploadProfilePic,
  changePassword,
  logoutUser,
} from "../Redux/userSlice";
import { clearWishlist } from "../Redux/wishlistSlice";
import { apiFetch } from "../utils/api";
import { getImageUrl } from "../utils/imageUrl";

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, error, passwordMessage } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    address: { country: "", city: "", district: "", street: "" },
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    dispatch(fetchProfile());
    apiFetch("/api/orders/myorders")
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [userInfo, navigate, dispatch]);

  useEffect(() => {
    if (userInfo) {
      setProfileForm({
        fullName: userInfo.fullName || "",
        phone: userInfo.phone || "",
        address: {
          country: userInfo.address?.country || "",
          city: userInfo.address?.city || "",
          district: userInfo.address?.district || "",
          street: userInfo.address?.street || "",
        },
      });
    }
  }, [userInfo]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearUserInfo());
    dispatch(clearWishlist());
    navigate("/login");
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await dispatch(updateProfile(profileForm)).unwrap();
      setMessage("Profile saved successfully.");
    } catch (err) {
      setMessage(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    try {
      await dispatch(uploadProfilePic(file)).unwrap();
      setMessage("Profile picture updated.");
    } catch (err) {
      setMessage(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await dispatch(
        changePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
      ).unwrap();
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully.");
    } catch (err) {
      setMessage(err);
    } finally {
      setSaving(false);
    }
  };

  if (!userInfo) return null;

  const avatarSrc = userInfo.profilePic
    ? getImageUrl(userInfo.profilePic)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.fullName || userInfo.username)}&background=4f46e5&color=fff`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="relative">
            <img
              src={avatarSrc}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
            />
            <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 shadow-lg">
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-black text-gray-900">
              {userInfo.fullName || userInfo.username}
            </h1>
            <p className="text-gray-500 text-sm">@{userInfo.username} · {userInfo.email}</p>
            {userInfo.role === "admin" && (
              <Link to="/admin" className="inline-block mt-2 text-indigo-600 font-bold text-sm hover:underline">
                Admin Dashboard →
              </Link>
            )}
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-bold text-sm hover:underline">
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>

      {message && <p className="mb-4 text-sm text-center text-indigo-600 font-medium">{message}</p>}
      {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}
      {passwordMessage && <p className="mb-4 text-sm text-center text-green-600">{passwordMessage}</p>}

      <form onSubmit={handleProfileSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6 space-y-4">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-600" /> Edit Profile
        </h2>
        <input
          value={profileForm.fullName}
          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
          placeholder="Full name"
          className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <input
          value={profileForm.phone}
          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
          placeholder="Phone"
          className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
        />
        <div className="grid grid-cols-2 gap-3">
          {["country", "city", "district", "street"].map((field) => (
            <input
              key={field}
              value={profileForm.address[field]}
              onChange={(e) =>
                setProfileForm({
                  ...profileForm,
                  address: { ...profileForm.address, [field]: e.target.value },
                })
              }
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
            />
          ))}
        </div>
        <button type="submit" disabled={saving} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50">
          Save Profile
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8 space-y-4">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-600" /> Change Password
        </h2>
        <input
          type="password"
          value={passwordForm.currentPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
          placeholder="Current password"
          required
          className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none"
        />
        <input
          type="password"
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
          placeholder="New password"
          required
          minLength={6}
          className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none"
        />
        <input
          type="password"
          value={passwordForm.confirmPassword}
          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
          placeholder="Confirm new password"
          required
          className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none"
        />
        <button type="submit" disabled={saving} className="w-full border border-indigo-600 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 disabled:opacity-50">
          Update Password
        </button>
      </form>

      <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-indigo-600" /> My Orders
      </h2>

      {loading && <p className="text-gray-500">Loading orders...</p>}
      {!loading && orders.length === 0 && <p className="text-gray-500 text-sm">No orders yet.</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="font-black text-indigo-600">${order.totalPrice.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg block mb-1">
                  {order.status}
                </span>
                <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {order.products?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                  {item.product?.image && (
                    <img src={getImageUrl(item.product.image)} alt="" className="w-8 h-8 rounded object-cover" />
                  )}
                  <span>{item.product?.name || "Product"} × {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
