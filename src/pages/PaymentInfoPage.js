import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import {
  CreditCardIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  BanknotesIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const PaymentInfoPage = () => {
  const paymentMethods = [
    {
      category: 'Transfer Bank',
      icon: BuildingLibraryIcon,
      color: 'from-blue-500 to-indigo-600',
      methods: [
        { name: 'BCA', desc: 'Virtual Account', logo: '🏦' },
        { name: 'BNI', desc: 'Virtual Account', logo: '🏦' },
        { name: 'BRI', desc: 'Virtual Account', logo: '🏦' },
        { name: 'Mandiri', desc: 'Virtual Account', logo: '🏦' },
        { name: 'Permata', desc: 'Virtual Account', logo: '🏦' },
      ],
    },
    {
      category: 'E-Wallet',
      icon: DevicePhoneMobileIcon,
      color: 'from-emerald-500 to-green-600',
      methods: [
        { name: 'GoPay', desc: 'Bayar via GoPay', logo: '💚' },
        { name: 'OVO', desc: 'Bayar via OVO', logo: '💜' },
        { name: 'DANA', desc: 'Bayar via DANA', logo: '💙' },
        { name: 'ShopeePay', desc: 'Bayar via ShopeePay', logo: '🧡' },
      ],
    },
    {
      category: 'Kartu Kredit / Debit',
      icon: CreditCardIcon,
      color: 'from-purple-500 to-violet-600',
      methods: [
        { name: 'Visa', desc: 'Credit & Debit', logo: '💳' },
        { name: 'Mastercard', desc: 'Credit & Debit', logo: '💳' },
        { name: 'JCB', desc: 'Credit & Debit', logo: '💳' },
      ],
    },
    {
      category: 'Minimarket',
      icon: BanknotesIcon,
      color: 'from-orange-500 to-amber-600',
      methods: [
        { name: 'Indomaret', desc: 'Bayar di kasir', logo: '🏪' },
        { name: 'Alfamart', desc: 'Bayar di kasir', logo: '🏪' },
      ],
    },
  ];

  const steps = [
    { step: '1', title: 'Pilih Produk', desc: 'Tambahkan produk ke keranjang belanja Anda.', icon: '🛒' },
    { step: '2', title: 'Checkout', desc: 'Pilih alamat pengiriman dan kurir yang diinginkan.', icon: '📋' },
    { step: '3', title: 'Pilih Pembayaran', desc: 'Pilih metode pembayaran yang paling nyaman untuk Anda.', icon: '💳' },
    { step: '4', title: 'Konfirmasi', desc: 'Lakukan pembayaran sesuai instruksi dan tunggu konfirmasi otomatis.', icon: '✅' },
  ];

  const securityFeatures = [
    { icon: LockClosedIcon, title: 'Enkripsi SSL 256-bit', desc: 'Seluruh data transaksi dilindungi dengan enkripsi standar perbankan internasional.' },
    { icon: ShieldCheckIcon, title: 'Sertifikasi PCI-DSS', desc: 'Payment gateway Midtrans telah bersertifikat PCI-DSS Level 1, standar keamanan pembayaran tertinggi.' },
    { icon: CheckCircleIcon, title: 'Diawasi Bank Indonesia', desc: 'Seluruh proses pembayaran diawasi dan diregulasi oleh Bank Indonesia.' },
  ];

  const faqs = [
    { q: 'Berapa lama batas waktu pembayaran?', a: 'Transfer bank: 24 jam. E-wallet: 15 menit. Minimarket: 24 jam. Pesanan otomatis dibatalkan jika melewati batas waktu.' },
    { q: 'Bagaimana jika pembayaran gagal?', a: 'Anda bisa mencoba membayar ulang dari halaman Transaksi. Jika saldo terpotong tapi status belum berubah, tunggu 5-10 menit untuk verifikasi otomatis.' },
    { q: 'Apakah bisa membayar dengan cicilan?', a: 'Ya, untuk kartu kredit tersedia opsi cicilan 3, 6, dan 12 bulan (tergantung bank penerbit kartu).' },
    { q: 'Apakah ada biaya tambahan?', a: 'Tidak ada biaya tambahan untuk transfer bank dan e-wallet. Untuk kartu kredit, mungkin ada biaya admin sesuai kebijakan bank.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20">
      <Header />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute top-20 left-20 w-3 h-3 bg-emerald-300/40 rounded-full animate-ping" />
        <div className="absolute top-32 right-40 w-2 h-2 bg-green-300/40 rounded-full animate-ping delay-700" />

        <div className="relative container mx-auto px-4 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <CreditCardIcon className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-medium text-emerald-200">Informasi Pembayaran</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Pembayaran
              <span className="block bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
                Mudah & Aman
              </span>
            </h1>
            <p className="text-lg text-emerald-100/80 mb-6 max-w-lg mx-auto leading-relaxed">
              Nikmati kemudahan pembayaran dengan berbagai metode yang aman dan terpercaya.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,40 1440,40 L1440,80 L0,80 Z" fill="rgb(248 250 252)" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ PAYMENT METHODS ═══════════════════ */}
      <section className="container mx-auto px-4 py-14">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full shadow-lg shadow-emerald-500/30">
            Metode Pembayaran
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Pilih yang Paling Nyaman</h2>
          <p className="text-gray-500 max-w-lg mx-auto">Kami mendukung berbagai metode pembayaran populer di Indonesia melalui Midtrans.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {paymentMethods.map((group, i) => {
            const Icon = group.icon;
            return (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className={`px-6 py-4 bg-gradient-to-r ${group.color} flex items-center gap-3`}>
                  <Icon className="w-6 h-6 text-white" />
                  <h3 className="font-bold text-white">{group.category}</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {group.methods.map((method, j) => (
                      <div key={j} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <span className="text-2xl">{method.logo}</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{method.name}</p>
                          <p className="text-xs text-gray-500">{method.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════ HOW TO PAY ═══════════════════ */}
      <section className="bg-gradient-to-br from-gray-50 to-emerald-50/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full shadow-lg shadow-emerald-500/30">
              Cara Bayar
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Langkah Pembayaran</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((item, i) => (
              <div key={i} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] right-0 border-t-2 border-dashed border-emerald-200 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mb-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <span className="inline-block px-3 py-1 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-full mb-2">
                    Langkah {item.step}
                  </span>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECURITY ═══════════════════ */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full shadow-lg shadow-emerald-500/30">
            Keamanan
          </span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Transaksi Anda Terlindungi</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {securityFeatures.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-center">
                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Midtrans badge */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            <ShieldCheckIcon className="w-6 h-6 text-emerald-500" />
            <span className="text-sm text-gray-600">Dipercaya oleh <strong className="text-gray-900">Midtrans</strong> Payment Gateway</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FAQ ═══════════════════ */}
      <section className="bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Pertanyaan Seputar Pembayaran</h2>
            <p className="text-emerald-200/70 max-w-md mx-auto">Jawaban cepat untuk pertanyaan yang sering diajukan.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                  <span className="font-medium text-white text-sm pr-4">{faq.q}</span>
                  <span className="text-emerald-300 group-open:rotate-180 transition-transform duration-300 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-sm text-emerald-100/70 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/faq" className="inline-flex items-center gap-2 text-emerald-300 hover:text-white text-sm font-medium transition-colors">
              Lihat semua FAQ <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PaymentInfoPage;
