import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import { CalendarIcon, MagnifyingGlassIcon, TagIcon, ArrowRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { CalendarIcon as CalendarSolid, FireIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const cdnUrl = process.env.REACT_APP_CDN_BASE_URL;

  const normalizeUrl = useCallback(
    (url) => {
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
    },
    [cdnUrl]
  );

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${apiUrl}/article/list`);
        if (response.data.success) {
          const allArticles = response.data.data;
          setFeaturedArticles(allArticles.slice(0, 3));
          setArticles(allArticles);

          // Extract unique categories
          const uniqueCategories = [];
          const seen = new Set();
          allArticles.forEach(a => {
            if (a.categoryId && !seen.has(a.categoryId._id)) {
              seen.add(a.categoryId._id);
              uniqueCategories.push(a.categoryId);
            }
          });
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, [apiUrl]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeFilter === 'all' || article.categoryId?._id === activeFilter;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'd MMMM yyyy', { locale: id });
    } catch {
      return '';
    }
  };

  const formatShortDate = (date) => {
    try {
      return format(new Date(date), 'd MMM yyyy', { locale: id });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Header />

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4F46E5]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full" />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <BookOpenIcon className="w-4 h-4 text-indigo-300" />
              <span className="text-sm font-medium text-indigo-200">Blog & Artikel</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Cerita Inspiratif dari
              <span className="block bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Nusantara
              </span>
            </h1>
            <p className="text-lg text-indigo-200/80 mb-10 max-w-xl mx-auto leading-relaxed">
              Temukan wawasan menarik seputar kerajinan tangan, kuliner tradisional, dan budaya Indonesia.
            </p>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto">
              <div className="relative group">
                <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#4F46E5] transition-colors" />
                <input
                  type="text"
                  placeholder="Cari artikel yang menarik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl shadow-2xl shadow-indigo-500/20 border-0 focus:ring-2 focus:ring-[#4F46E5] outline-none text-gray-800 placeholder-gray-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,40 1440,40 L1440,80 L0,80 Z" fill="rgb(248 250 252)" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ FEATURED SLIDER ═══════════════════ */}
      {featuredArticles.length > 0 && (
        <section className="container mx-auto px-4 -mt-4 mb-16 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <FireIcon className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-bold text-gray-900">Artikel Populer</h2>
          </div>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={24}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="featured-blog-swiper !pb-12"
          >
            {featuredArticles.map((article) => (
              <SwiperSlide key={article._id}>
                <Link to={`/articleview/${article._id}`} className="block group">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-80">
                    <img
                      src={normalizeUrl(article.cover?.url) || 'https://dummyimage.com/600x400/e2e8f0/64748b.png&text=No+Image'}
                      alt={article.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/30">
                        {article.categoryId?.name || 'Artikel'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 text-white/70 text-xs mb-2">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{formatShortDate(article.createdAt)}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-200 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{article.userId?.name?.[0]}</span>
                        </div>
                        <span className="text-white/80 text-xs">{article.userId?.name || 'Anonim'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* ═══════════════════ FILTER TABS ═══════════════════ */}
      <section className="container mx-auto px-4 mb-10">
        <div className="flex flex-wrap items-center gap-2 bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-indigo-500/30'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setActiveFilter(cat._id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeFilter === cat._id
                  ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-indigo-500/30'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
          <div className="ml-auto text-sm text-gray-500">
            {filteredArticles.length} artikel ditemukan
          </div>
        </div>
      </section>

      {/* ═══════════════════ ARTICLES GRID ═══════════════════ */}
      <section className="container mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-52 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <BookOpenIcon className="w-10 h-10 text-[#4F46E5]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak ada artikel ditemukan</h3>
            <p className="text-gray-500 mb-6">Coba ubah kata kunci pencarian atau filter kategori.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl font-medium shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <Link
                key={article._id}
                to={`/articleview/${article._id}`}
                className="group block"
              >
                <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-indigo-100 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={normalizeUrl(article.cover?.url) || 'https://dummyimage.com/600x400/e2e8f0/64748b.png&text=No+Image'}
                      alt={article.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#4F46E5] text-xs font-semibold rounded-full shadow-sm">
                        {article.categoryId?.name || 'Artikel'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{formatShortDate(article.createdAt)}</span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#4F46E5] transition-colors duration-300">
                      {article.title}
                    </h3>

                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                      {article.content}
                    </p>

                    {/* Author */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] p-[2px]">
                          <div className="w-full h-full rounded-full overflow-hidden bg-white">
                            <img
                              src={article.userId?.profileImage || 'https://i.pravatar.cc/100'}
                              alt={article.userId?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{article.userId?.name || 'Anonim'}</p>
                          <p className="text-xs text-gray-400">Penulis</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#4F46E5] flex items-center justify-center transition-colors duration-300">
                        <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
