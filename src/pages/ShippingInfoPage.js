import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CubeIcon,
  GlobeAsiaAustraliaIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const ShippingInfoPage = () => {
  const couriers = [
    { name: 'JNE', types: ['REG (2-4 hari)', 'YES (1 hari)', 'OKE (3-5 hari)'], logo: '📦', color: 'from-red-500 to-rose-600' },
    { name: 'J&T Express', types: ['EZ (2-4 hari)', 'Express (1-2 hari)'], logo: '🚛', color: 'from-red-600 to-orange-600' },
    { name: 'SiCepat', types: ['REG (2-3 hari)', 'BEST (1-2 hari)', 'GOKIL (ekonomi)'], logo: '⚡', color: 'from-amber-500 to-yellow-600' },
    { name: 'AnterAja', types: ['Regular (2-4 hari)', 'Next Day (1 hari)', 'Same Day'], logo: '🏃', color: 'from-green-500 to-emerald-600' },
    { name: 'Pos Indonesia', types: ['Kilat Khusus (3-5 hari)', 'Express (2-3 hari)'], logo: '🏤', color: 'from-orange-600 to-red-600' },
    { name: 'TIKI', types: ['REG (3-5 hari)', 'ONS (1 hari)', 'ECO (5-7 hari)'], logo: '📬', color: 'from-blue-500 to-indigo-600' },
  ];

  const steps = [
    { step: '1', title: 'Pesanan Dibayar', desc: 'Setelah pembayaran terkonfirmasi, pesanan masuk ke penjual.', icon: '💳', status: 'Paid' },
    { step: '2', title: 'Diproses Penjual', desc: 'Penjual menyiapkan dan mengemas produk Anda.', icon: '📋', status: 'Processed' },
    { step: '3', title: 'Dikirim', desc: 'Paket diserahkan ke kurir dan nomor resi tersedia.', icon: '🚚', status: 'Shipped' },
    { step: '4', title: 'Diterima', desc: 'Paket tiba di alamat Anda. Konfirmasi penerimaan.', icon: '🏠', status: 'Completed' },
  ];

  const packagingInfo = [
    { title: 'Bubble Wrap', desc: 'Untuk produk keramik, kaca, dan kerajinan rapuh.', icon: '🫧' },
    { title: 'Kardus Khusus', desc: 'Packaging tebal untuk perlindungan ekstra saat pengiriman.', icon: '📦' },
    { title: 'Vacuum Seal', desc: 'Untuk produk makanan agar tetap segar dan tahan lama.', icon: '🔒' },
    { title: 'Label Fragile', desc: 'Stiker khusus agar kurir berhati-hati saat handling.', icon: '⚠️' },
  ];

  const estimations = [
    { area: 'Dalam Kota', regular: '1-2 hari', express: 'Same Day', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    { area: 'Pulau Jawa', regular: '2-4 hari', express: '1-2 hari', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { area: 'Sumatera & Bali', regular: '3-5 hari', express: '2-3 hari', color: 'bg-purple-50 border-purple-200 text-purple-700' },
    { area: 'Kalimantan & Sulawesi', regular: '4-6 hari', express: '2-4 hari', color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { area: 'Papua & Maluku', regular: '5-10 hari', express: '3-5 hari', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  ];

  const faqs = [
    { q: 'Bagaimana cara menghitung ongkos kirim?', a: 'Ongkos kirim dihitung otomatis berdasarkan berat produk, dimensi paket, dan alamat tujuan. Anda bisa melihat estimasi ongkir di halaman checkout sebelum melakukan pembayaran.' },
    { q: 'Apakah ada gratis ongkir?', a: 'Program gratis ongkir tersedia secara berkala untuk produk-produk tertentu. Pantau promo di halaman utama atau ikuti notifikasi untuk info terbaru.' },
    { q: 'Bagaimana cara melacak paket saya?', a: 'Setelah penjual mengirim pesanan, nomor resi akan muncul di halaman Transaksi. Gunakan nomor resi tersebut untuk tracking di website kurir terkait.' },
    { q: 'Bagaimana jika paket saya hilang atau rusak?', a: 'Segera hubungi penjual melalui fitur pesan dan lampirkan bukti foto. Untuk paket hilang, kami akan membantu klaim asuransi ke pihak kurir.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <Header />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#1e40af] to-[#3b82f6]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute top-24 left-32 w-3 h-3 bg-blue-300/40 rounded-full animate-ping" />
        <div className="absolute bottom-20 right-24 w-2 h-2 bg-sky-300/40 rounded-full animate-ping delay-1000" />

        <div className="relative container mx-auto px-4 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <TruckIcon className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-medium text-blue-200">Informasi Pengiriman</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Pengiriman
              <span className="block bg-gradient-to-r from-blue-300 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
                Cepat & Terpercaya
              </span>
            </h1>
            <p className="text-lg text-blue-100/80 mb-6 max-w-lg mx-auto leading-relaxed">
              Kami bekerja sama dengan kurir terbaik untuk memastikan produk sampai ke tangan Anda dengan aman.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,40 1440,40 L1440,80 L0,80 Z" fill="rgb(248 250 252)" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ COURIERS ═══════════════════ */}
      <section className="container mx-auto px-4 py-14">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/30">
            Jasa Kurir
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Partner Pengiriman Kami</h2>
          <p className="text-gray-500 max-w-lg mx-auto">Pilih kurir favorit Anda saat checkout.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {couriers.map((courier, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className={`px-5 py-3.5 bg-gradient-to-r ${courier.color} flex items-center gap-3`}>
                <span className="text-2xl">{courier.logo}</span>
                <h3 className="font-bold text-white">{courier.name}</h3>
              </div>
              <div className="p-5">
                <ul className="space-y-2">
                  {courier.types.map((type, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ ESTIMATION TABLE ═══════════════════ */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/30">
              Estimasi Waktu
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Berapa Lama Sampai?</h2>
            <p className="text-gray-500 max-w-md mx-auto">Estimasi waktu pengiriman ke berbagai wilayah Indonesia.</p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold">
              <div className="flex items-center gap-2"><GlobeAsiaAustraliaIcon className="w-4 h-4" /> Wilayah</div>
              <div className="text-center">Reguler</div>
              <div className="text-center">Express</div>
            </div>
            {/* Table Rows */}
            {estimations.map((est, i) => (
              <div key={i} className={`grid grid-cols-3 gap-4 px-6 py-4 items-center ${i < estimations.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                <div className="font-medium text-gray-900 text-sm">{est.area}</div>
                <div className="text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${est.color}`}>
                    {est.regular}
                  </span>
                </div>
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-50 border border-blue-200 text-blue-700">
                    {est.express}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">* Estimasi waktu bisa berbeda tergantung kondisi cuaca, hari libur, dan lokasi spesifik.</p>
        </div>
      </section>

      {/* ═══════════════════ TRACKING STEPS ═══════════════════ */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/30">
            Status Pengiriman
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Lacak Pesanan Anda</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, i) => (
              <div key={i} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] right-0 border-t-2 border-dashed border-blue-200 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mb-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <span className="inline-block px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-full mb-2">
                    {item.status}
                  </span>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PACKAGING ═══════════════════ */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg shadow-blue-500/30">
              Packaging
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Dikemas dengan Aman</h2>
            <p className="text-gray-500 max-w-md mx-auto">Setiap produk dikemas sesuai jenisnya untuk perlindungan maksimal.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {packagingInfo.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group">
                <div className="w-14 h-14 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section className="bg-gradient-to-br from-[#1e3a5f] via-[#1e40af] to-[#3b82f6] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Pertanyaan Seputar Pengiriman</h2>
            <p className="text-blue-200/70 max-w-md mx-auto">Jawaban cepat untuk pertanyaan yang sering diajukan.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                  <span className="font-medium text-white text-sm pr-4">{faq.q}</span>
                  <span className="text-blue-300 group-open:rotate-180 transition-transform duration-300 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-sm text-blue-100/70 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/faq" className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm font-medium transition-colors">
              Lihat semua FAQ <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShippingInfoPage;
