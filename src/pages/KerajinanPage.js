import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import {
  MapPinIcon,
  ShoppingCartIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  HandRaisedIcon,
} from '@heroicons/react/24/outline';

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

const KerajinanPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Semua');

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiUrl}/category`);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedCategory === 'Semua') {
          response = await axios.get(`${apiUrl}/product/public`);
        } else {
          response = await axios.get(`${apiUrl}/category/${selectedCategory}`);
        }
        let data = response.data.products || [];

        if (searchTerm) {
          data = data.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        setProducts(
          data.map(p => ({
            ...p,
            cover: p.cover ? { ...p.cover, url: normalizeUrl(p.cover.url) } : null,
          }))
        );
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [selectedCategory, searchTerm, normalizeUrl]);

  const craftsHighlights = [
    { name: 'Batik', icon: '🎨', desc: 'Seni corak kain tradisional', color: 'from-indigo-500 to-purple-600' },
    { name: 'Tenun', icon: '🧶', desc: 'Kain tenun khas daerah', color: 'from-rose-500 to-pink-600' },
    { name: 'Ukiran', icon: '🪵', desc: 'Ukiran kayu & logam', color: 'from-amber-600 to-yellow-600' },
    { name: 'Anyaman', icon: '🧺', desc: 'Anyaman rotan & bambu', color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <Header />

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#4c1d95] to-[#7c3aed]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTQwIDBMODAgNDBMNDAgODBMMCA0MHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="absolute top-10 right-10 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <SparklesIcon className="w-4 h-4 text-purple-300" />
              <span className="text-sm font-medium text-purple-200">Karya Terbaik Pengrajin Lokal</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Kerajinan Tangan
              <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                Tradisional
              </span>
            </h1>
            <p className="text-lg text-purple-200/80 mb-10 max-w-xl mx-auto leading-relaxed">
              Temukan koleksi kerajinan tangan berkualitas tinggi yang dibuat dengan cinta oleh para pengrajin lokal terbaik Indonesia.
            </p>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto">
              <div className="relative group">
                <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Cari kerajinan yang kamu suka..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl shadow-2xl shadow-purple-900/20 border-0 focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 placeholder-gray-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,40 1440,40 L1440,80 L0,80 Z" fill="rgb(248 250 252)" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ CRAFT HIGHLIGHTS ═══════════════════ */}
      <section className="container mx-auto px-4 -mt-6 mb-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {craftsHighlights.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg border border-gray-100 hover:border-purple-200 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ CATEGORY FILTER ═══════════════════ */}
      <section className="container mx-auto px-4 mb-10">
        <div className="flex flex-wrap items-center gap-2 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('Semua')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              selectedCategory === 'Semua'
                ? 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white shadow-lg shadow-purple-500/30'
                : 'text-gray-600 hover:bg-purple-50'
            }`}
          >
            Semua Koleksi
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                selectedCategory === cat._id
                  ? 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white shadow-lg shadow-purple-500/30'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════════ PRODUCTS GRID ═══════════════════ */}
      <section className="container mx-auto px-4 pb-20">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto bg-purple-50 rounded-full flex items-center justify-center mb-6">
              <HandRaisedIcon className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Koleksi tidak ditemukan</h3>
            <p className="text-gray-500 mb-6">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('Semua'); }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white rounded-xl font-medium shadow-lg shadow-purple-500/30"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const price = product.price ? product.price.toLocaleString() : '0';
              const shopAddress = product.shopId?.address;
              const fullAddress = shopAddress ? `${shopAddress.province}` : 'Indonesia';

              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-purple-200 group cursor-pointer hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.cover?.url || 'https://dummyimage.com/400x300/e2e8f0/64748b.png&text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {product.discount && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg">
                        {product.discount}% OFF
                      </span>
                    )}

                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                      >
                        <HeartIcon className="w-4 h-4 text-gray-500 hover:text-red-500" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-purple-50 transition-colors"
                      >
                        <ShoppingCartIcon className="w-4 h-4 text-gray-500 hover:text-purple-600" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                      <MapPinIcon className="w-3 h-3" />
                      <span className="truncate">{fullAddress}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-1">{product.shopId?.name}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.originalPrice && (
                          <p className="text-xs text-gray-400 line-through">Rp {product.originalPrice.toLocaleString()}</p>
                        )}
                        <p className="text-sm font-bold text-gray-900">Rp {price}</p>
                      </div>
                      <span className="text-xs text-gray-400">Stok: {product.stock}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default KerajinanPage;
