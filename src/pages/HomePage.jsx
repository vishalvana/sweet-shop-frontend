import React, { useState, useEffect, useContext } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, Star, Menu, X, ArrowRight, ChevronRight, MapPin, Phone, Instagram } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';

// --- Data Configuration ---
const PRODUCTS = [
  {
    id: 1,
    name: "Royal Kaju Katli",
    desc: "Finest cashews blended with pure silver leaf.",
    price: "₹950/kg",
    image: "https://imgs.search.brave.com/mme1PAkA-MSaxEgjunKgb9LxBg5sqWp936tDyyOfsxo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL1Mv/YXBsdXMtbWVkaWEt/bGlicmFyeS1zZXJ2/aWNlLW1lZGlhLzI1/YWUxZjEyLTRkOTAt/NDNiMi1hODYwLTU4/Mjk3N2ExN2Y0Ny5f/X0NSMCwwLDk3MCw2/MDBfUFQwX1NYOTcw/X1YxX19fLnBuZw",
    tag: "Bestseller"
  },
  {
    id: 2,
    name: "Saffron Rasmalai",
    desc: "Soft cottage cheese dumplings in saffron milk.",
    price: "₹450/box",
    image: "https://imgs.search.brave.com/YBsaNPDsx8Gv5BhdfH8AZX4USS7jI_jYZ6aQEg-3Bhs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQx/MTc4NjUyNi9waG90/by9yYXNtYWxhaS5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/MFd6RXB3QkFtWjZI/b2lBZEg1aDFNeXdr/c0tEVmxJb3RudFVq/OGUyd3h6MD0",
    tag: "Signature"
  },
  {
    id: 3,
    name: "Desi Ghee Motichoor",
    desc: "Tiny chickpea flour pearls fried in pure ghee.",
    price: "₹600/kg",
    image: "https://imgs.search.brave.com/W-ZbMbm_CodfPFLKaEGmxqhj_VQ_0-MyoeIl1XVJGmA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aWlt/Zy50aXN0YXRpYy5j/b20vZnAvMS8wMDUv/NDEwL2Rlc2ktZ2hl/ZS1tb3RpY2hvb3It/bGFkb28tNjk1Lmpw/Zw",
    tag: "Traditional"
  },
  {
    id: 4,
    name: "Pistachio Barfi",
    desc: "Rich creamy fudge loaded with Iranian pistachios.",
    price: "₹1200/kg",
    image: "https://imgs.search.brave.com/SPXrc_bDvXC31P4-rhwTBtkCjhTUWdQGias9vAq26Bs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly95ZXNh/cHBsZXMuY29tL2Nk/bi9zaG9wL2FydGlj/bGVzL0FwcGxlX0Jh/cmZpX2NvcHkuanBn/P3Y9MTY2ODcyMTAx/OCZ3aWR0aD0xMTAw",
    tag: "Premium"
  }
];

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass = (isActive) =>
    `text-sm font-medium hover:text-orange-500 transition-colors ${scrolled ? 'text-gray-800' : 'text-white/90'} ${isActive ? 'text-orange-600 font-semibold' : ''}`;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-2xl font-serif font-bold tracking-wider ${scrolled ? 'text-orange-900' : 'text-white'}`}
        >
          MITHAI & CO.
        </motion.div>

        <div className="hidden md:flex space-x-8 items-center">
          <NavLink to="/" className={({ isActive }) => linkClass(isActive)}>
            Home
          </NavLink>

          <NavLink to="/shop" className={({ isActive }) => linkClass(isActive)}>
            Shop
          </NavLink>

          {token && (
            <NavLink to="/dashboard" className={({ isActive }) => linkClass(isActive)}>
              Dashboard
            </NavLink>
          )}

          {!token ? (
            <NavLink to="/login" className={({ isActive }) => linkClass(isActive)}>
              Login
            </NavLink>
          ) : (
            <NavLink to="/logout" className={({ isActive }) => linkClass(isActive)}>
              Logout
            </NavLink>
          )}

          <NavLink to="/shop" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-transform transform hover:scale-105 shadow-orange-500/50 shadow-lg flex items-center gap-2">
            <ShoppingBag size={16} /> Order Now
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Parallax */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-10" />
        <img 
          src="/hero.png" 
          alt="Indian Sweets Background" 
          className="w-full h-3/4 object-cover scale-110"
        />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-100">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-orange-600 text-white rounded-full font-semibold shadow-2xl shadow-orange-600/40 flex items-center justify-center gap-2 group"
            >
              Explore Menu <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20}/>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-semibold hover:bg-white/20 transition-all"
            >
              Our Heritage
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const FeatureSection = () => {
  return (
    <div className="py-20 bg-[#FFFBF2]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { title: "100% Pure Ghee", desc: "No vegetable oils. Only the finest A2 cow ghee." },
            { title: "Freshly Made", desc: "Prepared daily in our kitchen, never stored for weeks." },
            { title: "Premium Ingredients", desc: "Saffron, dry fruits, and silver leaf of the highest grade." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="p-8 bg-white rounded-2xl shadow-xl shadow-orange-900/5 hover:-translate-y-2 transition-transform duration-300 border border-orange-100"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                <Star fill="currentColor" size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-72 overflow-hidden">
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-orange-800">
          {product.tag}
        </div>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <button className="w-full bg-white text-orange-900 font-bold py-3 rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2">
            Add to Cart <ShoppingBag size={18} />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-serif font-bold text-gray-900">{product.name}</h3>
          <span className="font-bold text-orange-600 text-lg">{product.price}</span>
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.desc}</p>
        <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <span className="text-gray-400 ml-1">(45 reviews)</span>
        </div>
      </div>
    </motion.div>
  );
};

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        const res = await fetch("/api/sweets");
        if (!res.ok) throw new Error("Failed to fetch sweets");
        const data = await res.json();

        // Normalize backend response
        const normalized = data.map((item) => ({
          id: item._id || item.id,
          name: item.name,
          desc: item.description || item.desc || "Delicious handcrafted sweet",
          price: item.price ? `₹${item.price}` : "₹—",
          image:
            item.imageUrl ||
            item.image ||
            "https://via.placeholder.com/400x400?text=Mithai",
          tag: item.tag || "Popular",
        }));

        setProducts(normalized);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSweets();
  }, []);

  return (
    <div className="py-24 bg-white relative overflow-hidden" id="collections">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">
              Curated Selection
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mt-2">
              Bestselling Delicacies
            </h2>
          </div>
        </div>

        {/* 🔄 Loading State */}
        {loading && (
          <div className="text-center text-gray-500 text-lg">
            Loading sweets...
          </div>
        )}

        {/* ❌ Error State */}
        {error && (
          <div className="text-center text-red-500 text-lg">
            {error}
          </div>
        )}

        {/* ✅ Products */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


const Banner = () => {
  return (
    <div className="py-20 relative bg-orange-900 overflow-hidden flex items-center">
       <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
       <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-white max-w-xl">
             <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Celebrations incomplete without sweetness?</h2>
             <p className="text-orange-100 text-lg mb-8">Order our exclusive Diwali & Wedding Gift Hampers. Customizable boxes with premium dry fruits and sweets.</p>
             <button className="bg-white text-orange-900 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors">
               Customize Hamper
             </button>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 rounded-full"></div>
             <img src="https://images.unsplash.com/photo-1517260739837-14050b6a9df5?q=80&w=600&auto=format&fit=crop" alt="Gift Hamper" className="relative z-10 rounded-2xl shadow-2xl rotate-3 border-4 border-white/10 w-80 h-80 object-cover" />
          </div>
       </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-gray-800 pb-12">
          <div className="md:col-span-1">
            <h2 className="text-3xl font-serif font-bold mb-6">MITHAI & CO.</h2>
            <p className="text-gray-400 leading-relaxed mb-6">Bringing the authentic taste of royal Indian kitchens to your doorstep. Sweetness delivered with love.</p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer"><Instagram size={18}/></div>
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer"><Phone size={18}/></div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="hover:text-orange-500 cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-orange-500 cursor-pointer transition-colors">Our Menu</li>
              <li className="hover:text-orange-500 cursor-pointer transition-colors">Bulk Orders</li>
              <li className="hover:text-orange-500 cursor-pointer transition-colors">Track Order</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Our Specialties</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="hover:text-orange-500 cursor-pointer transition-colors">Bengali Sweets</li>
              <li className="hover:text-orange-500 cursor-pointer transition-colors">Desi Ghee Laddoos</li>
              <li className="hover:text-orange-500 cursor-pointer transition-colors">Sugar-Free Range</li>
              <li className="hover:text-orange-500 cursor-pointer transition-colors">Savory Snacks</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex gap-3 items-start">
                <MapPin className="text-orange-500 shrink-0" size={20} />
                <span>12, Royal Market, Civil Lines,<br/>Jaipur, Rajasthan 302006</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="text-orange-500 shrink-0" size={20} />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Mithai & Co. All rights reserved. Designed with ❤️ in India.
        </div>
      </div>
    </footer>
  );
};

export default function HomePage() {
  return (
    <div className="font-sans antialiased text-gray-900 bg-white selection:bg-orange-100 selection:text-orange-900">
      <Navbar />
      <Hero />
      <FeatureSection />
      <ProductSection />
     
      <Footer />
    </div>
  );
}