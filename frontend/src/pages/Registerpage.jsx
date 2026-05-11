import { User, Mail, Lock, ArrowRight, AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';

function Registerpage() {
  return (
    <div className="flex items-center justify-center bg-gray-100 p-2 md:p-6 font-sans">
      <div className="flex w-full max-w-[850px] bg-white rounded-[1.5rem] shadow-2xl overflow-hidden border border-gray-50 flex-col md:flex-row max-h-[98vh] md:max-h-[90vh]">
        
        {/* LEFT SIDE: Brand Image */}
        <div className="hidden md:block w-[35%] relative">
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1000" 
            alt="Shopping" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/40 flex items-center justify-center p-4 backdrop-blur-[1px]">
            <h1 className="text-3xl font-black text-white italic tracking-tighter">
              SOM<span className="text-indigo-200">CART</span>
            </h1>
          </div>
        </div>

        {/* RIGHT SIDE: Registration Form */}
        <div className="w-full md:w-[65%] p-5 md:p-8 flex flex-col justify-center overflow-y-auto">
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b pb-2 gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Create Account</h2>
              <p className="text-[11px] text-gray-400 font-medium tracking-tight">Please fill in your details to get started.</p>
            </div>
            <Link to="/login" className="text-indigo-600 font-bold text-[11px] hover:underline">Already have an account?</Link>
          </div>

          <form className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative group">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                <input type="text" placeholder="Full Name" className="w-full pl-9 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none text-xs text-gray-700" />
              </div>
              <div className="relative group">
                <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                <input type="text" placeholder="Username" className="w-full pl-9 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none text-xs text-gray-700" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative group">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                <input type="email" placeholder="Email Address" className="w-full pl-9 py-2 bg-indigo-50/50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none text-xs" />
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                <input type="password" placeholder="Password" className="w-full pl-9 py-2 bg-indigo-50/50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none text-xs" />
              </div>
            </div>

            {/* Address Section */}
            <div className="p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-indigo-600 uppercase mb-2 tracking-widest flex items-center gap-1">
                <span className="w-4 h-[1px] bg-indigo-600"></span> Shipping Address
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <input type="text" placeholder="Country" className="w-full px-3 py-1.5 bg-white rounded-lg border-none focus:ring-1 focus:ring-indigo-200 outline-none text-[10px]" />
                <input type="text" placeholder="City" className="w-full px-3 py-1.5 bg-white rounded-lg border-none focus:ring-1 focus:ring-indigo-200 outline-none text-[10px]" />
                <input type="text" placeholder="State/Prov" className="w-full px-3 py-1.5 bg-white rounded-lg border-none focus:ring-1 focus:ring-indigo-200 outline-none text-[10px]" />
                <input type="text" placeholder="Street" className="w-full px-3 py-1.5 bg-white rounded-lg border-none focus:ring-1 focus:ring-indigo-200 outline-none text-[10px]" />
              </div>
            </div>

            <div className="pt-2">
              <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest group">
                Complete Registration
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

























