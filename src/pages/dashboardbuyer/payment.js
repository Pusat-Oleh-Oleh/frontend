import React from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import {
  CreditCardIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  ShoppingCartIcon,
  MapPinIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import {
  CreditCardIcon as CreditCardSolid,
  BuildingLibraryIcon as BankSolid,
  DevicePhoneMobileIcon as PhoneSolid,
  BanknotesIcon as CashSolid,
} from '@heroicons/react/24/solid';

const paymentGroups = [
  {
    category: 'Transfer Bank — Virtual Account',
    icon: BuildingLibraryIcon,
    solidIcon: BankSolid,
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    desc: 'Bayar melalui ATM, mobile banking, atau internet banking.',
    methods: [
      { name: 'BCA', desc: 'BCA Virtual Account' },
      { name: 'BNI', desc: 'BNI Virtual Account' },
      { name: 'BRI', desc: 'BRI Virtual Account' },
      { name: 'Mandiri', desc: 'Mandiri Bill Payment' },
      { name: 'Permata', desc: 'Permata Virtual Account' },
    ],
  },
  {
    category: 'Dompet Digital (E-Wallet)',
    icon: DevicePhoneMobileIcon,
    solidIcon: PhoneSolid,
    color: 'from-emerald-500 to-green-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    desc: 'Bayar cepat dengan dompet digital favorit Anda.',
    methods: [
      { name: 'GoPay',      desc: 'Scan QR atau via aplikasi Gojek' },
      { name: 'ShopeePay', desc: 'Scan QR atau via aplikasi Shopee' },
      { name: 'OVO',       desc: 'Bayar langsung dari saldo OVO' },
      { name: 'DANA',      desc: 'Bayar dengan aplikasi DANA' },
      { name: 'QRIS',      desc: 'Scan QR universal semua e-wallet' },
    ],
  },
  {
    category: 'Kartu Kredit / Debit',
    icon: CreditCardIcon,
    solidIcon: CreditCardSolid,
    color: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
    textColor: 'text-violet-600',
    desc: 'Bayar menggunakan kartu kredit atau debit Visa / Mastercard.',
    methods: [
      { name: 'Visa', desc: 'Kredit & Debit' },
      { name: 'Mastercard', desc: 'Kredit & Debit' },
      { name: 'JCB', desc: 'Kredit & Debit' },
    ],
  },
  {
    category: 'Minimarket',
    icon: BanknotesIcon,
    solidIcon: CashSolid,
    color: 'from-orange-500 to-amber-600',
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-600',
    desc: 'Bayar tunai di kasir minimarket terdekat menggunakan kode pembayaran.',
    methods: [
      { name: 'Indomaret', desc: 'Bayar tunai di kasir Indomaret' },
      { name: 'Alfamart',  desc: 'Bayar tunai di kasir Alfamart' },
    ],
  },
];

const steps = [
  { icon: ShoppingCartIcon, label: 'Pilih Produk', desc: 'Tambahkan produk ke keranjang belanja' },
  { icon: MapPinIcon,      label: 'Checkout',     desc: 'Isi alamat & pilih kurir pengiriman' },
  { icon: CreditCardIcon,  label: 'Pilih Bayar',  desc: 'Pilih metode pembayaran di halaman Snap' },
  { icon: CheckBadgeIcon,  label: 'Selesai',      desc: 'Status pesanan diperbarui otomatis' },
];

const securityBadges = [
  { icon: LockClosedIcon,  title: 'SSL 256-bit',          desc: 'Enkripsi end-to-end' },
  { icon: ShieldCheckIcon, title: 'PCI-DSS Level 1',      desc: 'Standar keamanan tertinggi' },
  { icon: GlobeAltIcon,    title: 'Diawasi Bank Indonesia', desc: 'Diregulasi Bank Indonesia' },
];

const Payment = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* ── Header ── */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl mb-3 shadow-lg shadow-indigo-500/30">
          <CreditCardIcon className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Metode Pembayaran</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Kami mendukung berbagai metode pembayaran aman melalui{' '}
          <span className="font-semibold text-[#4F46E5]">Midtrans</span> Payment Gateway.
        </p>
      </div>

      {/* ── Payment Groups ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentGroups.map((group, i) => {
          const Icon = group.icon;
          const SolidIcon = group.solidIcon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
              {/* Header card */}
              <div className={`px-5 py-4 bg-gradient-to-r ${group.color} flex items-start gap-3`}>
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <SolidIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight">{group.category}</h3>
                  <p className="text-white/75 text-xs mt-0.5 leading-snug">{group.desc}</p>
                </div>
              </div>

              {/* Methods list */}
              <div className="p-4 space-y-2">
                {group.methods.map((m, j) => (
                  <div key={j} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`w-7 h-7 rounded-lg ${group.bgLight} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${group.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                      <p className="text-xs text-gray-400 truncate">{m.desc}</p>
                    </div>
                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── How to Pay ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="font-bold text-gray-900 text-sm">Cara Melakukan Pembayaran</h3>
          <p className="text-xs text-gray-400 mt-0.5">4 langkah mudah untuk menyelesaikan pesanan</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-y sm:divide-y-0 divide-gray-50">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center p-5">
                <div className="w-12 h-12 bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10 rounded-xl flex items-center justify-center mb-3">
                  <StepIcon className="w-6 h-6 text-[#4F46E5]" />
                </div>
                <span className="text-xs font-bold text-[#4F46E5] mb-1">Step {i + 1}</span>
                <p className="font-semibold text-gray-900 text-sm mb-1">{step.label}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Security Banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] p-6">
        <div className="flex items-center gap-2 mb-4 justify-center">
          <ShieldCheckIcon className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white text-sm">Transaksi Anda Terlindungi</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {securityBadges.map((badge, i) => {
            const BadgeIcon = badge.icon;
            return (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <BadgeIcon className="w-6 h-6 text-white mx-auto mb-2" />
                <p className="font-semibold text-white text-sm">{badge.title}</p>
                <p className="text-white/65 text-xs mt-0.5">{badge.desc}</p>
              </div>
            );
          })}
        </div>
        <p className="text-white/50 text-xs text-center mt-4">
          Semua transaksi diproses melalui{' '}
          <strong className="text-white/90">Midtrans</strong>, payment gateway terpercaya di Indonesia.
        </p>
      </div>

      {/* ── CTA ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/all-products"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300 text-sm"
        >
          <ShoppingCartIcon className="w-4 h-4" />
          Mulai Belanja Sekarang
        </Link>
        <Link
          to="/payment-info"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#4F46E5] font-semibold rounded-xl border border-[#4F46E5]/20 hover:bg-indigo-50 transition-all duration-300 text-sm"
        >
          Info Lengkap Pembayaran
          <ArrowRightIcon className="w-4 h-4" />
=======

const PaymentMethodCard = ({ icon, name, desc, color }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:-translate-y-0.5 transition-all duration-200">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="font-semibold text-gray-900 text-sm">{name}</p>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
  </div>
);

const Payment = () => {
  const paymentMethods = [
    {
      icon: '🏦',
      name: 'Transfer Bank Virtual Account',
      desc: 'BCA, BNI, BRI, Mandiri, Permata, dan bank lainnya',
      color: 'bg-blue-50'
    },
    {
      icon: '💳',
      name: 'Kartu Kredit / Debit',
      desc: 'Visa, Mastercard, JCB',
      color: 'bg-indigo-50'
    },
    {
      icon: '🟢',
      name: 'GoPay',
      desc: 'Bayar langsung dengan saldo GoPay',
      color: 'bg-green-50'
    },
    {
      icon: '🟠',
      name: 'ShopeePay',
      desc: 'Bayar langsung dengan saldo ShopeePay',
      color: 'bg-orange-50'
    },
    {
      icon: '⬛',
      name: 'QRIS',
      desc: 'Scan QR code dengan aplikasi e-wallet apapun',
      color: 'bg-gray-50'
    },
    {
      icon: '🔵',
      name: 'OVO',
      desc: 'Bayar langsung dengan saldo OVO',
      color: 'bg-purple-50'
    },
    {
      icon: '💜',
      name: 'Dana',
      desc: 'Bayar langsung dengan saldo Dana',
      color: 'bg-violet-50'
    },
    {
      icon: '🏪',
      name: 'Gerai Retail',
      desc: 'Alfamart, Indomaret, dan minimarket lainnya',
      color: 'bg-yellow-50'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Pembayaran Aman via Midtrans</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Semua transaksi di Pusatoleh diproses dengan aman melalui <strong>Midtrans</strong> — 
              payment gateway terpercaya yang telah memenuhi standar keamanan PCI-DSS.
            </p>
          </div>
        </div>

        {/* Shield badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {['PCI-DSS Compliant', 'SSL Enkripsi', '3D Secure', 'Anti-Fraud'].map(badge => (
            <span key={badge} className="text-xs px-3 py-1 bg-white/20 rounded-full font-medium">
              ✓ {badge}
            </span>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Cara Pembayaran</h3>
        <div className="space-y-3">
          {[
            { step: '1', label: 'Pilih produk', desc: 'Tambahkan ke keranjang dan lanjutkan ke checkout' },
            { step: '2', label: 'Pilih kurir & alamat', desc: 'Isi informasi pengiriman dengan lengkap' },
            { step: '3', label: 'Bayar via Midtrans', desc: 'Pilih metode pembayaran yang tersedia di popup Midtrans' },
            { step: '4', label: 'Pesanan diproses', desc: 'Penjual akan memproses pesanan setelah pembayaran berhasil' }
          ].map(({ step, label, desc }) => (
            <div key={step} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {step}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-2">Metode Pembayaran Tersedia</h3>
        <p className="text-sm text-gray-500 mb-4">Pilih metode yang paling nyaman saat checkout</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <PaymentMethodCard key={method.name} {...method} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm mb-4">
          Siap berbelanja? Temukan produk pilihan Anda.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Mulai Belanja
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
        </Link>
      </div>
    </div>
  );
};

export default Payment;