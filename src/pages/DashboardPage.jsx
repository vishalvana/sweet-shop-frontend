import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash,
  ShoppingCart,
  ArrowUpCircle,
  LogOut,
} from "lucide-react";

import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

/* -------------------- Helpers -------------------- */

const isAdminRole = (role) => role?.toUpperCase() === "ADMIN";

/* -------------------- Component -------------------- */

export default function DashboardPage() {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    quantity: 0,
    desc: "",
  });

  /* -------------------- Auth Guard -------------------- */

  useEffect(() => {
    if (!token) navigate("/login");
    fetchProfile();
    fetchSweets();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUser(res.data);
    } catch {
      logout();
      navigate("/login");
    }
  };

  /* -------------------- Sweets APIs -------------------- */

  const fetchSweets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/sweets");
      setSweets(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const searchSweets = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get("/api/sweets/search", { params: search });
      setSweets(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const saveSweet = async (e) => {
    e.preventDefault();

    if (editingSweet) {
      const res = await api.put(`/api/sweets/${editingSweet.id}`, form);
      setSweets((prev) =>
        prev.map((s) => (s.id === editingSweet.id ? res.data : s))
      );
    } else {
      const res = await api.post("/api/sweets", form);
      setSweets((prev) => [res.data, ...prev]);
    }

    closeForm();
  };

  const deleteSweet = async (id) => {
    if (!window.confirm("Delete this sweet?")) return;
    await api.delete(`/api/sweets/${id}`);
    setSweets((prev) => prev.filter((s) => s.id !== id));
  };

  const purchaseSweet = async (id) => {
    const res = await api.post(`/api/sweets/${id}/purchase`, { quantity: 1 });
    setSweets((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, quantity: res.data.quantity } : s
      )
    );
  };

  const restockSweet = async (id) => {
    const qty = parseInt(prompt("Restock quantity", "10"), 10);
    if (!qty) return;

    const res = await api.post(`/api/sweets/${id}/restock`, { quantity: qty });
    setSweets((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, quantity: res.data.quantity } : s
      )
    );
  };

  /* -------------------- Form Helpers -------------------- */

  const openAddForm = () => {
    setEditingSweet(null);
    setForm({
      name: "",
      category: "",
      price: "",
      image: "",
      quantity: 0,
      desc: "",
    });
    setShowForm(true);
  };

  const openEditForm = (sweet) => {
    setEditingSweet(sweet);
    setForm(sweet);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSweet(null);
  };

  /* -------------------- UI -------------------- */

  const isAdmin = isAdminRole(user?.role);

  return (
    <div className="min-h-screen bg-[#FDF8F3] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Namaste, {user?.email} 🙏
          </h1>
          <p className="text-gray-500">
            Role: <b>{user?.role}</b>
          </p>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-2 text-red-600"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Search */}
      <form
        onSubmit={searchSweets}
        className="flex gap-2 mb-6 flex-wrap"
      >
        <input
          placeholder="Name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Category"
          value={search.category}
          onChange={(e) =>
            setSearch({ ...search, category: e.target.value })
          }
          className="border px-3 py-2 rounded"
        />
        <input
          placeholder="Min ₹"
          value={search.minPrice}
          onChange={(e) =>
            setSearch({ ...search, minPrice: e.target.value })
          }
          className="border px-3 py-2 rounded w-24"
        />
        <input
          placeholder="Max ₹"
          value={search.maxPrice}
          onChange={(e) =>
            setSearch({ ...search, maxPrice: e.target.value })
          }
          className="border px-3 py-2 rounded w-24"
        />

        <button className="bg-orange-600 text-white px-4 rounded">
          Search
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={openAddForm}
            className="bg-green-600 text-white px-4 rounded flex items-center gap-1"
          >
            <Plus size={16} /> Add Sweet
          </button>
        )}
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-orange-50">
            <tr>
              <th className="p-3">Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : sweets.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  No sweets found
                </td>
              </tr>
            ) : (
              sweets.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td>{s.category}</td>
                  <td>₹{s.price}</td>
                  <td>{s.quantity}</td>
                  <td className="flex gap-2 p-3">
                    <button
                      onClick={() => purchaseSweet(s.id)}
                      className="text-orange-600 flex items-center gap-1"
                    >
                      <ShoppingCart size={16} /> Buy
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => openEditForm(s)}
                          className="text-blue-600"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => deleteSweet(s.id)}
                          className="text-red-600"
                        >
                          <Trash size={16} />
                        </button>

                        <button
                          onClick={() => restockSweet(s.id)}
                          className="text-green-600"
                        >
                          <ArrowUpCircle size={16} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form
            onSubmit={saveSweet}
            className="bg-white p-6 rounded-xl w-full max-w-lg space-y-3"
          >
            <h2 className="text-xl font-bold">
              {editingSweet ? "Edit Sweet" : "Add Sweet"}
            </h2>

            {["name", "category", "price", "image", "quantity"].map((f) => (
              <input
                key={f}
                placeholder={f}
                value={form[f]}
                onChange={(e) =>
                  setForm({ ...form, [f]: e.target.value })
                }
                className="border w-full px-3 py-2 rounded"
                required
              />
            ))}

            <textarea
              placeholder="Description"
              value={form.desc}
              onChange={(e) =>
                setForm({ ...form, desc: e.target.value })
              }
              className="border w-full px-3 py-2 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button className="bg-orange-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
