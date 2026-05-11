import { Lock, ArrowRight, AtSign } from 'lucide-react';
import { Link } from 'react-router-dom';

function Loginpage() {
  return (
    <div className=" flex items-center justify-center bg-gray-100 p-3 md:p-6 font-sans">
      <div className="flex w-full max-w-[850px] bg-white rounded-[1.5rem] shadow-2xl overflow-hidden border border-gray-50 flex-col md:flex-row max-h-[95vh]">
        
        {/* LEFT SIDE: Brand Image */}
        <div className="hidden md:block w-[35%] relative">
          <img 
            // src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1000" 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
            alt="SomCart Shopping" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/40 flex items-center justify-center p-4 backdrop-blur-[1px]">
            <h1 className="text-3xl font-black text-white italic tracking-tighter">
              SOM<span className="text-indigo-200">CART</span>
            </h1>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full md:w-[65%] p-3 md:p-10 flex flex-col justify-center">
          <div className="mb-6 border-b pb-3">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-[12px] text-gray-400 font-medium">Please enter your credentials to access your account.</p>
          </div>

          <form className="space-y-2">
            {/* Username */}
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Username</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Enter your username" 
                  className="w-full pl-10 py-2.5 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none text-xs text-gray-700 font-medium" 
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Password</label>
                <a href="#" className="text-[10px] text-indigo-600 font-bold hover:underline tracking-tight">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-10 py-2.5 bg-indigo-50/50 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 outline-none text-xs text-gray-700" 
                />
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-4">
              <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-50 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest group">
                Sign In
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-[12px] text-gray-500">
                Don't have an account? <Link to="/register" className="text-indigo-600 font-black hover:underline ml-1">Create one now</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


export default Loginpage;




















