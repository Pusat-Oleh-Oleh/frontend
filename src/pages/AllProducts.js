import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from 'axios';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon, 
  ShoppingCartIcon, 
  HeartIcon, 
  XMarkIcon 
} from "@heroicons/react/24/outline";
import Header from "../components/section/header"; // Asumsi path header kamu
import Footer from "../components/section/footer"; // Asumsi path footer kamu

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // State untuk Filter & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // newest, price-low, price-high

  const navigate = useNavigate();

  // --- Utility: Normalize URL (Sama seperti di products.js) ---
  const normalizeUrl = useCallback((url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url.replace(/\\/g, "/"));
      const pathname = urlObj.pathname;
      return new URL(pathname, cdnUrl).toString();
    } catch (e) {
      const cleanPath = url
        .replace(/^(?:https?:)?(?:\/\/)?[^/]+/, '')
        .replace(/\\/g, "/")
        .replace(/^\/+/, '/');
      return `${cdnUrl}${cleanPath}`;
    }
  }, []);

  // --- Fetch Categories ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/category`);
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // --- Fetch Products dengan Logic Filter Sederhana (Client Side) ---
  // Catatan: Idealnya filter dilakukan di Backend, tapi ini simulasi filter di frontend
  useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let response;
      let productsData = [];

      if (selectedCategory === "All") {
        // ✅ SEMUA PRODUK (SAMA SEPERTI LANDING)
        response = await axios.get(`${apiUrl}/product/public`);
        productsData = response.data.products || [];
      } else {
        // ✅ PRODUK PER KATEGORI
        response = await axios.get(`${apiUrl}/category/${selectedCategory}`);
        productsData = response.data.products || [];
      }

      // 🔍 SEARCH
      if (searchTerm) {
        productsData = productsData.filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // 🔃 SORT
      if (sortBy === "price-low") {
        productsData.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        productsData.sort((a, b) => b.price - a.price);
      } else {
        productsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }

      // 🖼️ NORMALIZE IMAGE
      setProducts(
        productsData.map(p => ({
          ...p,
          cover: {
            ...p.cover,
            url: normalizeUrl(p.cover?.url)
          }
        }))
      );

    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const timeout = setTimeout(fetchProducts, 400);
  return () => clearTimeout(timeout);

}, [selectedCategory, searchTerm, sortBy, normalizeUrl]);



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* --- Banner Title --- */}
      <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Jelajahi Semua Produk</h1>
          <p className="text-indigo-100 max-w-2xl mx-auto">
            Temukan kerajinan tangan, makanan khas, dan karya terbaik dari seluruh nusantara.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- Sidebar Filters (Desktop) & Mobile Drawer Toggle --- */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            
            {/* Mobile Filter Button */}
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden w-full mb-4 flex items-center justify-center gap-2 bg-white p-3 rounded-xl shadow-sm border border-gray-200 text-gray-700 font-medium"
            >
              <FunnelIcon className="h-5 w-5" /> Filter & Kategori
            </button>

            {/* Sidebar Content */}
            <div className={`fixed inset-0 z-50 bg-black/50 lg:static lg:bg-transparent lg:z-auto transition-opacity duration-300 ${isFilterOpen ? 'opacity-100 visible' : 'opacity-0 invisible lg:opacity-100 lg:visible'}`}>
              <div className={`absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-2xl lg:static lg:h-auto lg:w-full lg:shadow-none lg:bg-transparent lg:p-0 transform transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                
                <div className="flex justify-between items-center lg:hidden mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filter</h3>
                  <button onClick={() => setIsFilterOpen(false)}><XMarkIcon className="h-6 w-6 text-gray-500"/></button>
                </div>

                {/* Search Widget */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Pencarian</h3>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Cari produk..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] outline-none text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Categories Widget */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3">Kategori</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category" 
                        className="peer hidden"
                        checked={selectedCategory === "All"}
                        onChange={() => setSelectedCategory("All")}
                      />
                      <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-[#4F46E5] peer-checked:bg-[#4F46E5] relative flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                      </div>
                      <span className="text-gray-600 group-hover:text-[#4F46E5] transition-colors text-sm">Semua Kategori</span>
                    </label>
                    
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="category" 
                          className="peer hidden"
                          checked={selectedCategory === cat._id}
                          onChange={() => setSelectedCategory(cat._id)}
                        />
                        <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:border-[#4F46E5] peer-checked:bg-[#4F46E5] relative flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100"></div>
                        </div>
                        <span className="text-gray-600 group-hover:text-[#4F46E5] transition-colors text-sm">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
              {/* Overlay Click to Close */}
              <div className="absolute inset-0 -z-10 lg:hidden" onClick={() => setIsFilterOpen(false)}></div>
            </div>
          </div>

          {/* --- Main Content (Product Grid) --- */}
          <div className="w-full lg:w-3/4">
            
            {/* Top Bar: Results Count & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <span className="text-gray-600 text-sm mb-2 sm:mb-0">
                Menampilkan <strong>{products.length}</strong> produk
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Urutkan:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border-none focus:ring-0 font-medium text-gray-900 cursor-pointer bg-transparent"
                >
                  <option value="newest">Terbaru</option>
                  <option value="price-low">Harga Terendah</option>
                  <option value="price-high">Harga Tertinggi</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4F46E5]"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  // Menggunakan Inline Component atau import ProductCard yang sama
                  <div 
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-t-xl">
                      <img
                        src={product.cover?.url || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.discount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                          {product.discount}%
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-[#4F46E5] font-medium mb-1">{product.categoryId?.name || 'Umum'}</p>
                      <h3 className="font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-[#4F46E5] transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-end justify-between mt-2">
                        <div>
                           {product.originalPrice && (
                            <p className="text-xs text-gray-400 line-through">Rp {product.originalPrice.toLocaleString()}</p>
                           )}
                           <p className="text-sm sm:text-base font-bold text-gray-900">
                             Rp {product.price ? product.price.toLocaleString() : '0'}
                           </p>
                        </div>
                        <button className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-[#4F46E5] hover:text-white transition-colors">
                          <ShoppingCartIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">Tidak ada produk yang ditemukan.</p>
                <button 
                  onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
                  className="mt-4 text-[#4F46E5] font-medium hover:underline"
                >
                  Reset Filter
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AllProducts;