import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";
import { ShoppingBag } from "lucide-react";

import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      console.log('Login response:', res);
      // Accept common token shapes from different backends
      const tokenFromBody = res?.data?.token || res?.data?.accessToken || res?.data?.data?.token || null;
      // If backend returned the token as the root (res.data is string), handle that too
      const maybeTokenString = typeof res?.data === 'string' ? res.data : tokenFromBody;
      if (res?.data?.token) {
        login(res.data.token);
        alert("Login successful");
        navigate("/dashboard");
      } else {
        if (maybeTokenString) {
          login(maybeTokenString);
          alert('Login successful');
          navigate('/dashboard');
        } else {
          alert("Login failed: no token returned");
        }
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FDF8F3] p-4 font-sans">
      {/* Main Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden min-h-[600px]"
      >
        
        {/* Left Side - Visual / Image */}
        <div className="hidden lg:flex w-1/2 relative bg-orange-900 overflow-hidden items-center justify-center">
          {/* Background Image - Replace '/sweets-banner.jpg' with your actual image path from public folder */}
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            src="/sweets-banner.jpg" // <--- YOUR PUBLIC IMAGE HERE
            alt="Mithai Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-orange-900/40 to-transparent" />

          <div className="relative z-10 p-12 text-white">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-serif font-bold mb-6 leading-tight"
            >
              Taste the <br/> <span className="text-orange-300">Tradition</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-orange-100 text-lg font-light leading-relaxed max-w-md"
            >
              Log in to track your orders, save your favorite mithai boxes, and get exclusive festive offers.
            </motion.p>
          </div>

          {/* Decorative Circles */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          
          <div className="max-w-md mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-3xl font-serif font-bold text-gray-900 mb-2">Welcome Back</h3>
              <p className="text-gray-500 mb-8">Please enter your details to sign in.</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Email Input */}
              <div className="relative group">
                <label className={`absolute left-0 transition-all duration-300 ${focusedInput === 'email' || email ? '-top-6 text-xs text-orange-600 font-bold' : 'top-3 text-gray-400'}`}>
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className={`absolute left-0 w-5 h-5 transition-colors ${focusedInput === 'email' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full py-3 pl-8 bg-transparent border-b-2 border-gray-200 focus:border-orange-600 outline-none transition-colors text-gray-800 font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative group mt-8">
                <label className={`absolute left-0 transition-all duration-300 ${focusedInput === 'password' || password ? '-top-6 text-xs text-orange-600 font-bold' : 'top-3 text-gray-400'}`}>
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className={`absolute left-0 w-5 h-5 transition-colors ${focusedInput === 'password' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full py-3 pl-8 pr-10 bg-transparent border-b-2 border-gray-200 focus:border-orange-600 outline-none transition-colors text-gray-800 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 text-gray-400 hover:text-orange-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm mt-4">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300" />
                  Remember me
                </label>
                <a href="#" className="text-orange-600 font-medium hover:text-orange-700 hover:underline">Forgot Password?</a>
              </div>

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 mt-8"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>Sign In <ArrowRight size={20} /></>
                )}
              </motion.button>
            </form>

            <div className="mt-8 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <span className="relative z-10 bg-white px-4 text-sm text-gray-400 bg-white">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                 Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
                Facebook
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm mt-8">
              Don't have an account? <NavLink to="/register" className="text-orange-600 font-medium hover:underline">
              Register
            </NavLink></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;