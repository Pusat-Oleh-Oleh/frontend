import React from 'react';
import { Link } from 'react-router-dom';
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
        </Link>
      </div>
    </div>
  );
};

export default Payment;