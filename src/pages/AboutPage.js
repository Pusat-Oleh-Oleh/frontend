import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import {
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
  UserGroupIcon,
  GlobeAsiaAustraliaIcon,
  SparklesIcon,
  HeartIcon,
  BuildingStorefrontIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const AboutPage = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Pengrajin Lokal', value: '500+', icon: UserGroupIcon },
    { label: 'Produk Tersedia', value: '10.000+', icon: BuildingStorefrontIcon },
    { label: 'Daerah Terjangkau', value: '34', icon: GlobeAsiaAustraliaIcon },
    { label: 'Pembeli Puas', value: '50.000+', icon: HeartIcon },
  ];

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Kualitas Terjamin',
      description: 'Setiap produk melewati proses seleksi ketat dari tim kami untuk memastikan keaslian dan kualitas terbaik.',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: TruckIcon,
      title: 'Pengiriman Cepat',
      description: 'Layanan pengiriman cepat dan aman ke seluruh Indonesia dengan packaging khusus anti pecah.',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: CreditCardIcon,
      title: 'Pembayaran Aman',
      description: 'Berbagai metode pembayaran yang aman dan terpercaya, didukung oleh Midtrans payment gateway.',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Layanan Pelanggan',
      description: 'Tim support kami siap membantu Anda 24/7 melalui chat dan pesan langsung ke penjual.',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Temukan Produk',
      description: 'Jelajahi ribuan produk kerajinan dan oleh-oleh khas daerah dari seluruh Indonesia.',
      icon: '🔍',
    },
    {
      step: '02',
      title: 'Pilih & Pesan',
      description: 'Tambahkan ke keranjang, pilih metode pengiriman dan pembayaran yang sesuai.',
      icon: '🛒',
    },
    {
      step: '03',
      title: 'Bayar Aman',
      description: 'Lakukan pembayaran dengan metode yang Anda percaya. Transaksi dijamin keamanannya.',
      icon: '💳',
    },
    {
      step: '04',
      title: 'Terima di Rumah',
      description: 'Produk dikemas dengan aman dan dikirim langsung ke alamat Anda.',
      icon: '📦',
    },
  ];

  const values = [
    { title: 'Mendukung UMKM Lokal', desc: 'Kami berkomitmen membantu pengrajin dan UMKM lokal menjangkau pasar yang lebih luas.' },
    { title: 'Melestarikan Budaya', desc: 'Setiap pembelian Anda turut menjaga kelestarian seni dan budaya tradisional Indonesia.' },
    { title: 'Keaslian Produk', desc: 'Produk langsung dari pengrajin asli, bukan imitasi. Kualitas dan keaslian terjamin.' },
    { title: 'Harga Adil', desc: 'Tanpa perantara berlebih, sehingga pengrajin mendapat keuntungan layak dan pembeli mendapat harga wajar.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-20 w-3 h-3 bg-purple-400/40 rounded-full animate-ping" />
        <div className="absolute top-40 right-32 w-2 h-2 bg-indigo-400/40 rounded-full animate-ping delay-1000" />
        <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-violet-400/40 rounded-full animate-ping delay-500" />

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <SparklesIcon className="w-4 h-4 text-indigo-300" />
              <span className="text-sm font-medium text-indigo-200">Tentang Kami</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Menghubungkan
              <span className="block bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Nusantara
              </span>
            </h1>
            <p className="text-xl text-indigo-200/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Pusat Oleh-Oleh adalah marketplace yang menghubungkan pengrajin lokal Indonesia dengan pecinta produk tradisional berkualitas.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/all-products')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#4F46E5] font-semibold rounded-2xl shadow-2xl shadow-indigo-500/20 hover:shadow-3xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Mulai Belanja
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,40 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ STATS ═══════════════════ */}
      <section className="container mx-auto px-4 -mt-6 mb-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════ MISSION ═══════════════════ */}
      <section className="container mx-auto px-4 mb-24">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full shadow-lg shadow-indigo-500/30">
            Misi Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            Memajukan Pengrajin Lokal,<br />Melestarikan Budaya Indonesia
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Kami percaya bahwa kerajinan tangan dan oleh-oleh khas daerah adalah cerminan kekayaan budaya Indonesia.
            Melalui platform ini, kami ingin membantu para pengrajin lokal menjangkau pasar yang lebih luas,
            sementara memberikan kemudahan bagi Anda untuk menemukan produk tradisional berkualitas dari seluruh Nusantara.
          </p>
        </div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section className="bg-gradient-to-br from-slate-50 to-indigo-50/30 py-20 mb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full shadow-lg shadow-indigo-500/30">
              Mengapa Kami
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Keunggulan Pusat Oleh-Oleh
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Kami berkomitmen memberikan pengalaman belanja terbaik untuk Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 group hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="container mx-auto px-4 mb-24">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full shadow-lg shadow-indigo-500/30">
            Cara Kerja
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mudah, Cepat, dan Aman
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Belanja produk tradisional Nusantara hanya dalam beberapa langkah sederhana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((item, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < howItWorks.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] right-0 border-t-2 border-dashed border-gray-200 z-0" />
              )}

              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 flex items-center justify-center mb-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <span className="inline-block px-3 py-1 text-xs font-bold text-[#4F46E5] bg-indigo-50 rounded-full mb-3">
                  Langkah {item.step}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ VALUES ═══════════════════ */}
      <section className="bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] py-20 mb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-indigo-200/80 max-w-xl mx-auto">
              Prinsip yang melandasi setiap keputusan dan layanan kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((val, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{val.title}</h3>
                    <p className="text-sm text-indigo-200/70 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="container mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-3xl p-10 md:p-16 text-center shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Siap Menjelajahi Nusantara?
            </h2>
            <p className="text-indigo-100 mb-8 max-w-xl mx-auto text-lg">
              Mulai belanja dan dukung pengrajin lokal Indonesia. Temukan produk unik yang tidak ada di tempat lain!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/all-products')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#4F46E5] font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Lihat Semua Produk
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/articlehomepage')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Baca Blog Kami
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
