import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  ShoppingBag,
  RotateCcw,
  LogOut,
  Search,
  Package,
  X
} from "lucide-react";

import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

const isAdmin = (role) => role?.toUpperCase() === "ADMIN";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [allSweets, setAllSweets] = useState([]);
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [searchText, setSearchText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    imageUrl: "",
    quantity: 0,
    desc: "",
  });

  /* ---------------- Auth ---------------- */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
    fetchSweets();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
    } catch {
      logout();
      navigate("/login");
    }
  };

  /* ---------------- APIs ---------------- */
  const fetchSweets = async () => {
    setLoading(true);
    const res = await api.get("/api/sweets");
    setAllSweets(res.data || []);
    setSweets(res.data || []);
    setLoading(false);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    if (!value.trim()) {
      setSweets(allSweets);
      return;
    }
    const filtered = allSweets.filter((sweet) =>
      sweet.name.toLowerCase().includes(value.toLowerCase())
    );
    setSweets(filtered);
  };

  /* ---------------- Cart Logic ---------------- */
  const addToCart = (sweet) => {
    setCart((prev) => {
      const currentQty = prev[sweet.id] || 0;
      if (currentQty >= sweet.quantity) {
        alert("Cannot add more than available stock");
        return prev;
      }
      return { ...prev, [sweet.id]: currentQty + 1 };
    });
  };

  const purchaseSweet = async (sweet) => {
    const qtyInCart = cart[sweet.id];
    if (!qtyInCart) {
      alert("Add item to cart first");
      return;
    }
    try {
      const res = await api.post(
        `/api/sweets/${sweet.id}/purchase`,
        { quantity: qtyInCart }
      );
      setAllSweets((prev) =>
        prev.map((s) =>
          s.id === sweet.id ? { ...s, quantity: res.data.quantity } : s
        )
      );
      setSweets((prev) =>
        prev.map((s) =>
          s.id === sweet.id ? { ...s, quantity: res.data.quantity } : s
        )
      );
      setCart((prev) => {
        const copy = { ...prev };
        delete copy[sweet.id];
        return copy;
      });
      alert("Purchase successful 🎉");
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  /* ---------------- Admin ---------------- */
  const restockSweet = async (id) => {
    const qty = parseInt(prompt("Restock quantity", "10"), 10);
    if (!qty) return;
    const res = await api.post(`/api/sweets/${id}/restock`, { quantity: qty });
    setAllSweets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, quantity: res.data.quantity } : s))
    );
    setSweets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, quantity: res.data.quantity } : s))
    );
  };

  const saveSweet = async (e) => {
    e.preventDefault();
    if (editingSweet) {
      const res = await api.put(`/api/sweets/${editingSweet.id}`, form);
      setAllSweets((prev) =>
        prev.map((s) => (s.id === editingSweet.id ? res.data : s))
      );
    } else {
      const res = await api.post("/api/sweets", form);
      setAllSweets((prev) => [res.data, ...prev]);
    }
    setSweets(allSweets); // Ideally re-filter here
    setShowForm(false);
    setEditingSweet(null);
  };

  const deleteSweet = async (id) => {
    if (!window.confirm("Delete this sweet?")) return;
    await api.delete(`/api/sweets/${id}`);
    setAllSweets((prev) => prev.filter((s) => s.id !== id));
    setSweets((prev) => prev.filter((s) => s.id !== id));
  };

  /* ---------------- UI Components ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 font-sans text-slate-800">
      
      {/* --- Glass Header --- */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/60 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <ShoppingBag size={20} />
             </div>
             <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-amber-600">
                   SweetDelights
                </h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                  {user?.role === "ADMIN" ? "Admin Dashboard" : "Customer Store"}
                </p>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700">{user?.email}</span>
              <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                {user?.role}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { logout(); navigate("/login"); }}
              className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
            <input
              placeholder="Search for delicious sweets..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-0 shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-400"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {isAdmin(user?.role) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingSweet(null);
                setForm({ name: "", category: "", price: "", imageUrl: "", quantity: 0, desc: "" });
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-orange-500/30 flex items-center gap-2"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span>Add Product</span>
            </motion.button>
          )}
        </div>

        {/* Grid System */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
               className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full"
            />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {sweets.map((s) => (
                <motion.div
                  key={s.id}
                  layout
                  variants={cardVariants}
                  className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-shadow duration-300 flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={s.imageUrl || "https://via.placeholder.com/400x300?text=Sweet"}
                      alt={s.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                        s.quantity > 0 ? "bg-white/90 text-green-700" : "bg-red-50 text-red-700"
                      }`}>
                        {s.quantity > 0 ? `${s.quantity} Left` : "Sold Out"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider">{s.category}</p>
                            <h3 className="text-xl font-bold text-slate-800 leading-tight">{s.name}</h3>
                        </div>
                        <span className="text-lg font-bold text-slate-700">₹{s.price}</span>
                    </div>
                    
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">
                        {s.desc || "A delightful traditional sweet delicacy made with pure ingredients."}
                    </p>

                    {/* Action Area */}
                    <div className="space-y-3 mt-auto">
                        {/* Add to Cart / Quantity Control */}
                        {s.quantity > 0 ? (
                           <div className="flex gap-2">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addToCart(s)}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <ShoppingBag size={18} />
                                    {cart[s.id] ? `Added (${cart[s.id]})` : "Add"}
                                </motion.button>
                                
                                {cart[s.id] && (
                                    <motion.button
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => purchaseSweet(s)}
                                        className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-2.5 rounded-xl font-medium shadow-md shadow-orange-200"
                                    >
                                        Buy Now
                                    </motion.button>
                                )}
                           </div>
                        ) : (
                           <button disabled className="w-full bg-slate-100 text-slate-400 py-2.5 rounded-xl text-sm font-medium cursor-not-allowed">
                               Currently Unavailable
                           </button>
                        )}

                        {/* Admin Controls */}
                        {isAdmin(user?.role) && (
                            <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center px-1">
                                <button onClick={() => restockSweet(s.id)} className="text-green-600 hover:bg-green-50 p-2 rounded-full transition-colors" title="Restock">
                                    <RotateCcw size={18} />
                                </button>
                                <div className="flex gap-1">
                                    <button onClick={() => { setEditingSweet(s); setForm(s); setShowForm(true); }} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => deleteSweet(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* --- Elegant Modal --- */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Package size={24} />
                    {editingSweet ? "Edit Delicacy" : "New Sweet"}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors">
                    <X size={20} />
                  </button>
              </div>

              <form onSubmit={saveSweet} className="p-8 space-y-5">
                 <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
                        <input
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                            placeholder="e.g. Rasgulla"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                        <input
                            required
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                            placeholder="e.g. Milk Based"
                        />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Price (₹)</label>
                        <input
                            required
                            type="number"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Quantity</label>
                        <input
                            required
                            type="number"
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                        />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Image URL</label>
                    <input
                        required
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                        placeholder="https://..."
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                    <textarea
                        rows="3"
                        value={form.desc}
                        onChange={(e) => setForm({ ...form, desc: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
                        placeholder="Describe the taste..."
                    />
                 </div>

                 <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-6 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button className="px-6 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 shadow-lg shadow-slate-300 font-medium transition-colors">
                        Save Changes
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}