import React from 'react';
import { Link } from 'react-router-dom';

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
        </Link>
      </div>
    </div>
  );
};

export default Payment;