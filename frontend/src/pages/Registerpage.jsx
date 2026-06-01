import { User, Mail, Lock, ArrowRight, AtSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../Redux/userSlice';
import heroImage from '../assets/hero.png';

function Registerpage() {
  const dispatch = useDispatch();
const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    address: {
      country: '',
      city: '',
      state: '',
      street: '',
    },
  });

  // normal inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // address inputs
  const handleAddressChange = (e) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [e.target.name]: e.target.value,
      },
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      address: {
        country: formData.address.country,
        city: formData.address.city,
        district: formData.address.state,
        street: formData.address.street,
      },
    };

    await dispatch(registerUser(payload));
  };

    useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex items-center justify-center bg-gray-100 p-2 md:p-6 font-sans ">
      <div className="flex w-full max-w-[850px] bg-white rounded-[1.5rem] shadow-2xl overflow-hidden border border-gray-50 flex-col md:flex-row max-h-[98vh] md:max-h-[90vh]">

        {/* LEFT SIDE */}
        <div className="hidden md:block w-[35%] relative">
          <img
            src={heroImage}
            alt="Shopping"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-indigo-900/40 flex items-center justify-center p-4 backdrop-blur-[1px]">
            <h1 className="text-3xl font-black text-white italic tracking-tighter">
              SOM<span className="text-indigo-200">CART</span>
            </h1>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-[65%] p-5 md:p-8 flex flex-col justify-center overflow-y-auto">

          {/* Header */}
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b pb-2 gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">
                Create Account
              </h2>

              <p className="text-[11px] text-gray-400 font-medium tracking-tight">
                Please fill in your details to get started.
              </p>
            </div>

            <Link
              to="/login"
              className="text-indigo-600 font-bold text-[11px] hover:underline"
            >
              Already have an account?
            </Link>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Full Name + Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* Full Name */}
              <div className="relative group">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full pl-9 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none text-xs text-gray-700"
                />
              </div>

              {/* Username */}
              <div className="relative group">
                <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full pl-9 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none text-xs text-gray-700"
                />
              </div>
            </div>

            {/* Email + Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* Email */}
              <div className="relative group">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />

                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full pl-9 py-2 bg-indigo-50/50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none text-xs"
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-9 py-2 bg-indigo-50/50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none text-xs"
                />
              </div>
            </div>

            {/* Address */}
            <div className="p-3 bg-gray-50/50 rounded-2xl border border-gray-100">

              <p className="text-[10px] font-black text-indigo-600 uppercase mb-2 tracking-widest flex items-center gap-1">
                <span className="w-4 h-[1px] bg-indigo-600"></span>
                Shipping Address
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">

                {/* Country */}
                <input
                  type="text"
                  name="country"
                  value={formData.address.country}
                  onChange={handleAddressChange}
                  placeholder="Country"
                  className="w-full px-3 py-1.5 bg-white rounded-lg border-none focus:ring-1 focus:ring-indigo-200 outline-none text-[10px]"
                />

                {/* City */}
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  placeholder="City"
                  className="w-full px-3 py-1.5 bg-white rounded-lg border-none focus:ring-1 focus:ring-indigo-200 outline-none text-[10px]"
                />

                {/* State */}
                <input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  placeholder="State/Prov"
                  className="w-full px-3 py-1.5 bg-white rounded-lg border-none focus:ring-1 focus:ring-indigo-200 outline-none text-[10px]"
                />

                {/* Street */}
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  placeholder="Street"
                  className="w-full px-3 py-1.5 bg-white rounded-lg border-none focus:ring-1 focus:ring-indigo-200 outline-none text-[10px]"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            {/* Success */}
            {userInfo && (
              <p className="text-green-600 text-sm text-center">
                Registration Successful
              </p>
            )}

            {/* Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest group"
              >
                {loading ? 'Loading...' : 'Complete Registration'}

                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Registerpage;