import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import {
  ChevronDownIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const faqData = [
  {
    category: 'Pesanan & Belanja',
    icon: ShoppingBagIcon,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    questions: [
      {
        q: 'Bagaimana cara memesan produk di Pusat Oleh-Oleh?',
        a: 'Cari produk yang Anda inginkan melalui halaman utama atau fitur pencarian. Klik produk untuk melihat detail, lalu klik tombol "Beli" atau tambahkan ke keranjang. Setelah selesai belanja, buka keranjang, pilih alamat pengiriman dan metode pembayaran, lalu konfirmasi pesanan Anda.',
      },
      {
        q: 'Apakah saya harus login untuk berbelanja?',
        a: 'Ya, Anda harus login atau membuat akun terlebih dahulu untuk bisa menambahkan produk ke keranjang dan melakukan pembelian. Anda bisa mendaftar dengan email atau langsung menggunakan akun Google.',
      },
      {
        q: 'Bisakah saya membatalkan pesanan yang sudah dibuat?',
        a: 'Pesanan dapat dibatalkan selama statusnya masih "Not Paid" (Belum Dibayar). Setelah pembayaran dikonfirmasi dan pesanan diproses oleh penjual, pembatalan tidak dapat dilakukan secara otomatis. Silakan hubungi penjual melalui fitur pesan.',
      },
      {
        q: 'Bagaimana cara melihat status pesanan saya?',
        a: 'Anda bisa melihat status pesanan di halaman "Transaksi" yang dapat diakses dari menu utama setelah login. Di sana akan tampil semua pesanan beserta statusnya: Not Paid, Paid, Processed, Completed, atau Cancelled.',
      },
    ],
  },
  {
    category: 'Pembayaran',
    icon: CreditCardIcon,
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    questions: [
      {
        q: 'Metode pembayaran apa saja yang tersedia?',
        a: 'Kami mendukung berbagai metode pembayaran melalui Midtrans, termasuk transfer bank (BCA, BNI, BRI, Mandiri), e-wallet (GoPay, OVO, DANA, ShopeePay), kartu kredit/debit, dan minimarket (Indomaret, Alfamart).',
      },
      {
        q: 'Apakah pembayaran di Pusat Oleh-Oleh aman?',
        a: 'Sangat aman! Seluruh transaksi pembayaran diproses melalui Midtrans, payment gateway yang telah bersertifikat PCI-DSS dan diawasi oleh Bank Indonesia. Data pembayaran Anda dienkripsi dan tidak disimpan di server kami.',
      },
      {
        q: 'Berapa lama batas waktu pembayaran?',
        a: 'Batas waktu pembayaran tergantung metode yang dipilih. Untuk transfer bank virtual account, biasanya 24 jam. Untuk e-wallet seperti GoPay, biasanya 15 menit. Pesanan akan otomatis dibatalkan jika melewati batas waktu.',
      },
      {
        q: 'Bagaimana jika pembayaran saya gagal?',
        a: 'Jika pembayaran gagal, pesanan akan berstatus "Not Paid" dan Anda bisa mencoba membayar ulang. Jika saldo sudah terpotong tetapi status belum berubah, silakan tunggu beberapa menit karena sistem memerlukan waktu untuk memverifikasi. Jika tetap bermasalah, hubungi layanan pelanggan kami.',
      },
    ],
  },
  {
    category: 'Pengiriman',
    icon: TruckIcon,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    questions: [
      {
        q: 'Berapa lama estimasi pengiriman?',
        a: 'Estimasi pengiriman tergantung lokasi dan kurir yang dipilih. Untuk pengiriman reguler dalam Pulau Jawa biasanya 2-4 hari kerja, sedangkan luar Jawa 4-7 hari kerja. Pengiriman express tersedia dengan estimasi 1-2 hari kerja.',
      },
      {
        q: 'Apakah bisa mengirim ke seluruh Indonesia?',
        a: 'Ya! Kami melayani pengiriman ke seluruh wilayah Indonesia melalui berbagai jasa kurir terpercaya. Ongkos kirim dihitung otomatis berdasarkan berat produk dan alamat tujuan.',
      },
      {
        q: 'Bagaimana jika produk rusak saat pengiriman?',
        a: 'Kami mengemas semua produk dengan packaging khusus anti pecah, terutama untuk produk makanan dan kerajinan rapuh. Jika produk tetap rusak saat diterima, silakan foto bukti kerusakan dan hubungi penjual melalui fitur pesan dalam waktu 1x24 jam setelah barang diterima.',
      },
      {
        q: 'Apakah bisa melacak pengiriman?',
        a: 'Ya, setelah pesanan dikirim oleh penjual, nomor resi akan diperbarui di halaman transaksi Anda. Anda bisa menggunakan nomor resi tersebut untuk melacak posisi paket di website kurir terkait.',
      },
    ],
  },
  {
    category: 'Pengembalian & Refund',
    icon: ArrowPathIcon,
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    questions: [
      {
        q: 'Apakah bisa mengembalikan produk?',
        a: 'Pengembalian produk dapat dilakukan jika produk yang diterima tidak sesuai dengan deskripsi, rusak, atau cacat. Hubungi penjual melalui fitur pesan dalam waktu 2x24 jam setelah barang diterima dengan menyertakan foto bukti.',
      },
      {
        q: 'Berapa lama proses refund?',
        a: 'Proses refund membutuhkan waktu 3-7 hari kerja setelah pengembalian produk dikonfirmasi oleh penjual. Dana akan dikembalikan melalui metode pembayaran yang sama dengan saat pembelian.',
      },
      {
        q: 'Apakah produk makanan bisa dikembalikan?',
        a: 'Produk makanan hanya bisa dikembalikan jika terbukti rusak saat pengiriman, kadaluarsa, atau tidak sesuai pesanan. Pengembalian karena alasan personal (tidak suka rasanya, dll) tidak dapat diproses.',
      },
    ],
  },
  {
    category: 'Akun & Keamanan',
    icon: ShieldCheckIcon,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    questions: [
      {
        q: 'Bagaimana cara mendaftar akun?',
        a: 'Klik tombol "Daftar" atau "Register" di halaman utama. Anda bisa mendaftar menggunakan email dan password, atau langsung login dengan akun Google. Pilih tipe akun: Pembeli (User) atau Penjual (Seller).',
      },
      {
        q: 'Saya lupa password, bagaimana cara resetnya?',
        a: 'Saat ini fitur reset password sedang dalam pengembangan. Jika Anda lupa password, silakan hubungi tim support kami untuk bantuan reset akun secara manual.',
      },
      {
        q: 'Bagaimana cara menjadi penjual di Pusat Oleh-Oleh?',
        a: 'Klik "Daftar Sekarang" dan pilih "Seller" sebagai tipe akun. Lengkapi data toko termasuk nama toko, alamat, dan informasi produk. Setelah verifikasi oleh admin, Anda bisa mulai menambahkan dan menjual produk.',
      },
      {
        q: 'Apakah data pribadi saya aman?',
        a: 'Kami sangat menjaga keamanan data pengguna. Password disimpan dalam bentuk terenkripsi (bcrypt), komunikasi menggunakan HTTPS, dan data pembayaran diproses melalui payment gateway bersertifikat. Kami tidak pernah membagikan data pribadi Anda kepada pihak ketiga.',
      },
    ],
  },
  {
    category: 'Penjual & Toko',
    icon: UserCircleIcon,
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    questions: [
      {
        q: 'Bagaimana cara menambahkan produk ke toko saya?',
        a: 'Login sebagai seller, buka Dashboard Seller, lalu klik "Tambah Produk". Isi nama produk, deskripsi, harga, stok, kategori, dan upload foto produk. Pastikan foto berkualitas baik untuk menarik pembeli.',
      },
      {
        q: 'Apakah ada biaya untuk berjualan di Pusat Oleh-Oleh?',
        a: 'Saat ini pendaftaran sebagai penjual dan listing produk tidak dikenakan biaya. Kami hanya mengenakan komisi kecil dari setiap transaksi yang berhasil.',
      },
      {
        q: 'Bagaimana cara menerima pembayaran dari penjualan?',
        a: 'Pembayaran dari pembeli akan masuk ke saldo toko Anda setelah pesanan dikonfirmasi selesai (status "Completed"). Anda bisa melakukan penarikan saldo ke rekening bank yang terdaftar.',
      },
    ],
  },
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 px-1 text-left group"
      >
        <span className={`text-sm font-medium pr-8 transition-colors duration-200 ${isOpen ? 'text-[#4F46E5]' : 'text-gray-800 group-hover:text-[#4F46E5]'}`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-[#4F46E5] rotate-180' : 'bg-gray-100 group-hover:bg-indigo-50'}`}>
          <ChevronDownIcon className={`w-4 h-4 transition-colors duration-200 ${isOpen ? 'text-white' : 'text-gray-500'}`} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
        <p className="text-sm text-gray-500 leading-relaxed px-1 pl-1 pr-10">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQPage = () => {
  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (categoryIdx, questionIdx) => {
    const key = `${categoryIdx}-${questionIdx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Search across all categories
  const getFilteredData = () => {
    if (!searchQuery.trim()) return null;

    const results = [];
    faqData.forEach((cat, catIdx) => {
      cat.questions.forEach((q, qIdx) => {
        if (
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({ ...q, catIdx, qIdx, category: cat.category, icon: cat.icon, color: cat.color });
        }
      });
    });
    return results;
  };

  const searchResults = getFilteredData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Header />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <QuestionMarkCircleIcon className="w-4 h-4 text-indigo-300" />
              <span className="text-sm font-medium text-indigo-200">Pusat Bantuan</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Pertanyaan yang
              <span className="block bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Sering Diajukan
              </span>
            </h1>
            <p className="text-lg text-indigo-200/80 mb-10 max-w-lg mx-auto leading-relaxed">
              Temukan jawaban untuk pertanyaan umum seputar belanja, pembayaran, dan pengiriman di Pusat Oleh-Oleh.
            </p>

            {/* Search Bar */}
            <div className="max-w-lg mx-auto">
              <div className="relative group">
                <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#4F46E5] transition-colors" />
                <input
                  type="text"
                  placeholder="Cari pertanyaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl shadow-2xl shadow-indigo-500/20 border-0 focus:ring-2 focus:ring-[#4F46E5] outline-none text-gray-800 placeholder-gray-400 transition-all"
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

      {/* ═══════════════════ SEARCH RESULTS ═══════════════════ */}
      {searchResults && (
        <section className="container mx-auto px-4 py-10">
          <p className="text-sm text-gray-500 mb-6">
            {searchResults.length > 0
              ? `Ditemukan ${searchResults.length} hasil untuk "${searchQuery}"`
              : `Tidak ada hasil untuk "${searchQuery}"`
            }
          </p>
          {searchResults.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {searchResults.map((item, idx) => (
                <div key={idx} className="mb-2 last:mb-0">
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1 ${faqData[item.catIdx].bgColor} ${faqData[item.catIdx].textColor}`}>
                    {item.category}
                  </span>
                  <FAQItem
                    question={item.q}
                    answer={item.a}
                    isOpen={openItems[`search-${idx}`]}
                    onClick={() => setOpenItems(prev => ({ ...prev, [`search-${idx}`]: !prev[`search-${idx}`] }))}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <QuestionMarkCircleIcon className="w-8 h-8 text-[#4F46E5]" />
              </div>
              <p className="text-gray-500">Coba kata kunci lain atau jelajahi kategori di bawah.</p>
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════ FAQ CONTENT ═══════════════════ */}
      {!searchResults && (
        <section className="container mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Category Sidebar */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">Kategori</h3>
                {faqData.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveCategory(idx)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        activeCategory === idx
                          ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-indigo-500/30'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{cat.category}</span>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                        activeCategory === idx ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {cat.questions.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FAQ Questions */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Category Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = faqData[activeCategory].icon;
                      return (
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${faqData[activeCategory].color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      );
                    })()}
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{faqData[activeCategory].category}</h2>
                      <p className="text-xs text-gray-500">{faqData[activeCategory].questions.length} pertanyaan</p>
                    </div>
                  </div>
                </div>

                {/* Questions */}
                <div className="px-6">
                  {faqData[activeCategory].questions.map((item, qIdx) => (
                    <FAQItem
                      key={qIdx}
                      question={item.q}
                      answer={item.a}
                      isOpen={openItems[`${activeCategory}-${qIdx}`]}
                      onClick={() => toggleItem(activeCategory, qIdx)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="container mx-auto px-4 pb-16 pt-6">
        <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-3xl p-10 md:p-14 text-center shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Masih ada pertanyaan?
            </h2>
            <p className="text-indigo-100 mb-8 max-w-md mx-auto">
              Jangan ragu untuk menghubungi tim support kami. Kami siap membantu!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/messages"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#4F46E5] font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Hubungi Kami
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Tentang Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQPage;
