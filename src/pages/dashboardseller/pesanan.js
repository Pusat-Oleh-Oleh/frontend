import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import {
  MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon,
  CheckBadgeIcon, ClockIcon, XCircleIcon,
  CurrencyDollarIcon, ShoppingBagIcon, ChevronUpDownIcon,
  ChevronUpIcon, ChevronDownIcon,
} from '@heroicons/react/24/solid';
import { ShoppingBagIcon as ShoppingBagOutline, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { AuthContext } from '../../components/context/AuthContext';
import { toast } from 'react-hot-toast';

// ─── Konfigurasi Status ───────────────────────────────────────────────────────
const STATUS_CONFIG = {
  'Semua':     { label: 'Semua',          bg: 'bg-gray-100',    text: 'text-gray-700',   activeBg: 'bg-gray-800',     activeText: 'text-white',  icon: FunnelIcon },
  'Not Paid':  { label: 'Belum Bayar',    bg: 'bg-orange-100',  text: 'text-orange-700', activeBg: 'bg-orange-500',   activeText: 'text-white',  icon: ClockIcon },
  'Paid':      { label: 'Lunas',          bg: 'bg-blue-100',    text: 'text-blue-700',   activeBg: 'bg-blue-600',     activeText: 'text-white',  icon: CurrencyDollarIcon },
  'Processed': { label: 'Diproses',       bg: 'bg-amber-100',   text: 'text-amber-700',  activeBg: 'bg-amber-500',    activeText: 'text-white',  icon: ArrowPathIcon },
  'Completed': { label: 'Selesai',        bg: 'bg-green-100',   text: 'text-green-700',  activeBg: 'bg-green-600',    activeText: 'text-white',  icon: CheckBadgeIcon },
  'Cancelled': { label: 'Dibatalkan',     bg: 'bg-red-100',     text: 'text-red-700',    activeBg: 'bg-red-500',      activeText: 'text-white',  icon: XCircleIcon },
  'Expired':   { label: 'Kadaluarsa',     bg: 'bg-gray-100',    text: 'text-gray-600',   activeBg: 'bg-gray-500',     activeText: 'text-white',  icon: XCircleIcon },
};

const SORT_OPTIONS = [
  { key: 'newest',  label: 'Terbaru' },
  { key: 'oldest',  label: 'Terlama' },
  { key: 'highest', label: 'Harga Tertinggi' },
  { key: 'lowest',  label: 'Harga Terendah' },
];

const fmt = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
const TableSkeleton = () => (
  <>
    {[...Array(5)].map((_, i) => (
      <tr key={i} className="border-t border-gray-50">
        {[...Array(7)].map((_, j) => (
          <td key={j} className="px-4 py-4">
            <div className="h-4 bg-gray-200 animate-pulse rounded-lg" style={{ width: `${60 + Math.random() * 40}%` }} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

// ─── Komponen Pesanan ─────────────────────────────────────────────────────────
const Pesanan = () => {
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [transactions, setTransactions]   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [processing, setProcessing]       = useState(null); // id transaksi yg sedang diproses
  const [activeFilter, setActiveFilter]   = useState('Semua');
  const [search, setSearch]               = useState('');
  const [sortBy, setSortBy]               = useState('newest');
  const [showSort, setShowSort]           = useState(false);
  const [expandedRow, setExpandedRow]     = useState(null);
  const sortRef                           = useRef(null);

  // ─── Fetch ──────────────────────────────────────────────────────────────────
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/transaction/seller`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = (res.data.transactions || []).map(item => ({
        _id:          item.transaction._id,
        orderId:      item.transaction.midtransOrderId,
        buyer:        item.transaction.userId,
        products:     item.transaction.products || [],
        totalPrice:   item.transaction.totalPrice,
        paymentType:  item.transaction.paymentType,
        createdAt:    item.transaction.createdAt,
        status:       item.status.status,
      }));

      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTransactions(list);
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error('Gagal memuat data pesanan');
      }
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // close sort dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setShowSort(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ─── Proses Pesanan ──────────────────────────────────────────────────────────
  const handleProcess = async (transactionId) => {
    setProcessing(transactionId);
    try {
      await axios.put(
        `${apiUrl}/transaction/${transactionId}/process`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Pesanan berhasil diproses & dikirim');
      fetchTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memproses pesanan');
    } finally {
      setProcessing(null);
    }
  };

  // ─── Hitung per status ───────────────────────────────────────────────────────
  const counts = transactions.reduce((acc, tx) => {
    acc[tx.status] = (acc[tx.status] || 0) + 1;
    return acc;
  }, {});
  counts['Semua'] = transactions.length;

  // ─── Filter + Search + Sort ──────────────────────────────────────────────────
  const filtered = transactions
    .filter(tx => activeFilter === 'Semua' || tx.status === activeFilter)
    .filter(tx => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        tx._id.toString().toLowerCase().includes(q) ||
        tx.orderId?.toLowerCase().includes(q) ||
        tx.buyer?.name?.toLowerCase().includes(q) ||
        tx.buyer?.email?.toLowerCase().includes(q) ||
        tx.products.some(p => p.productName?.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest')  return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest')  return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'highest') return b.totalPrice - a.totalPrice;
      if (sortBy === 'lowest')  return a.totalPrice - b.totalPrice;
      return 0;
    });

  const activeSort = SORT_OPTIONS.find(s => s.key === sortBy);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text mb-1">
          Manajemen Pesanan
        </h1>
        <p className="text-sm text-gray-500">Kelola dan pantau semua pesanan masuk toko Anda</p>
      </div>

      {/* ── Status Cards (Klik = Filter) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {['Semua', 'Not Paid', 'Paid', 'Processed', 'Completed', 'Cancelled'].map(status => {
          const cfg  = STATUS_CONFIG[status];
          const Icon = cfg.icon;
          const isActive = activeFilter === status;
          return (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                isActive
                  ? 'border-transparent shadow-lg ' + cfg.activeBg
                  : 'border-gray-100 bg-white/90 hover:border-gray-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                isActive ? 'bg-white/20' : cfg.bg
              }`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : cfg.text}`} />
              </div>
              <p className={`text-xl font-bold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                {loading ? '—' : counts[status] || 0}
              </p>
              <p className={`text-xs font-medium mt-0.5 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                {cfg.label}
              </p>
              {isActive && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-60" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tabel ── */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari ID, nama pembeli, produk..."
              className="w-full pl-10 pr-9 py-2.5 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#4F46E5] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Active filter badge */}
            {activeFilter !== 'Semua' && (
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${STATUS_CONFIG[activeFilter].bg} ${STATUS_CONFIG[activeFilter].text}`}>
                {STATUS_CONFIG[activeFilter].label}
                <button
                  onClick={() => setActiveFilter('Semua')}
                  className="hover:opacity-70 transition-opacity"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Sort dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setShowSort(s => !s)}
                className="flex items-center gap-2 px-3.5 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:border-[#4F46E5]/30 hover:bg-indigo-50/50 transition-all"
              >
                <ChevronUpDownIcon className="w-4 h-4 text-gray-400" />
                {activeSort?.label}
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-30">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => { setSortBy(opt.key); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                        sortBy === opt.key
                          ? 'bg-indigo-50 text-[#4F46E5] font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                      {sortBy === opt.key && <CheckBadgeIcon className="w-3.5 h-3.5 text-[#4F46E5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh */}
            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="p-2.5 border-2 border-gray-200 rounded-xl text-gray-500 hover:text-[#4F46E5] hover:border-indigo-200 hover:bg-indigo-50/50 transition-all disabled:opacity-40"
              title="Refresh"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

<<<<<<< HEAD
        {/* Result count */}
        {!loading && (
          <div className="px-5 py-2.5 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Menampilkan <span className="font-semibold text-gray-700">{filtered.length}</span> dari{' '}
              <span className="font-semibold text-gray-700">{transactions.length}</span> pesanan
              {activeFilter !== 'Semua' && (
                <span className="ml-1">
                  · filter: <span className={`font-semibold ${STATUS_CONFIG[activeFilter].text}`}>{STATUS_CONFIG[activeFilter].label}</span>
                </span>
              )}
              {search && <span className="ml-1">· pencarian: <span className="font-semibold">"{search}"</span></span>}
            </p>
            {(activeFilter !== 'Semua' || search) && (
              <button
                onClick={() => { setActiveFilter('Semua'); setSearch(''); }}
                className="text-xs text-[#4F46E5] hover:underline font-medium"
              >
                Reset filter
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">ID Pesanan</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Pembeli</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Produk</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Total</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">Tanggal</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">Aksi</th>
=======
        <table className="w-full border-t border-gray-200">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left p-4">Nomor Pesanan</th>
              <th className="text-left p-4">Nama Pembeli</th>
              <th className="text-left p-4">Produk</th>
              <th className="text-center p-4">Total Harga</th>
              <th className="text-center p-4">Tanggal Pesanan</th>
              <th className="text-center p-4">Status Pesanan</th>
              <th className="text-center p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4">{transaction._id}</td>
                <td className="p-4">{transaction.buyer?.name || '-'}</td>
                <td className="p-4">
                  {(transaction.products || []).map((product, index) => (
                    <div key={index}>
                      {product.productName || 'Produk tidak ditemukan'} (x{product.quantity})
                    </div>
                  ))}
                </td>
                <td className="p-4 text-center">
                  Rp {transaction.totalPrice?.toLocaleString('id-ID')}
                </td>
                <td className="p-4 text-center">
                  {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'Paid' ? 'bg-blue-100 text-blue-800' :
                    transaction.status === 'Processed' ? 'bg-yellow-100 text-yellow-800' :
                    transaction.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {transaction.status === 'Paid' && (
                    <button
                      onClick={() => handleProcessTransaction(transaction._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 text-sm"
                    >
                      Process
                    </button>
                  )}
                  <button className="mr-2" title="Lihat Detail">
                    <EyeIcon className="w-5 h-5 text-gray-500" />
                  </button>
                  <button title="Cetak Invoice">
                    <PrinterIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </td>
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <ShoppingBagOutline className="w-14 h-14 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-semibold">Tidak ada pesanan ditemukan</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {search || activeFilter !== 'Semua'
                        ? 'Coba ubah filter atau kata kunci pencarian'
                        : 'Pesanan akan muncul di sini saat pembeli melakukan transaksi'}
                    </p>
                    {(search || activeFilter !== 'Semua') && (
                      <button
                        onClick={() => { setActiveFilter('Semua'); setSearch(''); }}
                        className="mt-4 text-sm text-[#4F46E5] hover:underline font-medium"
                      >
                        Reset filter
                      </button>
                    )}
                  </td>
                </tr>
              ) : filtered.map(tx => {
                const cfg = STATUS_CONFIG[tx.status] || STATUS_CONFIG['Not Paid'];
                const StatusIcon = cfg.icon;
                const isExpanded = expandedRow === tx._id;

                return (
                  <React.Fragment key={tx._id}>
                    <tr
                      className={`border-t border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer ${isExpanded ? 'bg-indigo-50/40' : ''}`}
                      onClick={() => setExpandedRow(isExpanded ? null : tx._id)}
                    >
                      {/* ID Pesanan */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                          #{tx.orderId?.slice(-10).toUpperCase() || tx._id.toString().slice(-8).toUpperCase()}
                        </span>
                      </td>

                      {/* Pembeli */}
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 leading-tight">
                            {tx.buyer?.name || '—'}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {tx.buyer?.email || ''}
                          </p>
                        </div>
                      </td>

                      {/* Produk */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5">
                          {tx.products.length === 0 ? (
                            <p className="text-xs text-gray-400">—</p>
                          ) : tx.products.slice(0, 2).map((p, i) => (
                            <p key={i} className="text-xs text-gray-700 leading-tight">
                              <span className="font-medium">{p.productName || 'Produk'}</span>
                              <span className="text-gray-400 ml-1">×{p.quantity}</span>
                            </p>
                          ))}
                          {tx.products.length > 2 && (
                            <p className="text-xs text-[#4F46E5] font-medium">+{tx.products.length - 2} lainnya</p>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3.5 text-right">
                        <p className="text-sm font-bold text-gray-900">{fmt(tx.totalPrice)}</p>
                        {tx.paymentType && (
                          <p className="text-xs text-gray-400 capitalize mt-0.5">{tx.paymentType.replace(/_/g, ' ')}</p>
                        )}
                      </td>

                      {/* Tanggal */}
                      <td className="px-4 py-3.5 text-center">
                        <p className="text-xs text-gray-600">{fmtDate(tx.createdAt)}</p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="px-4 py-3.5 text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          {tx.status === 'Paid' && (
                            <button
                              onClick={() => handleProcess(tx._id)}
                              disabled={processing === tx._id}
                              className="px-3 py-1.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-xs font-bold rounded-lg hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-1.5"
                            >
                              {processing === tx._id ? (
                                <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Proses...</>
                              ) : (
                                <><ArrowPathIcon className="w-3 h-3" />Proses</>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedRow(isExpanded ? null : tx._id)}
                            className="p-1.5 text-gray-400 hover:text-[#4F46E5] hover:bg-indigo-50 rounded-lg transition-all"
                            title={isExpanded ? 'Tutup Detail' : 'Lihat Detail'}
                          >
                            {isExpanded
                              ? <ChevronUpIcon className="w-4 h-4" />
                              : <ChevronDownIcon className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Row Detail */}
                    {isExpanded && (
                      <tr className="border-t border-indigo-100">
                        <td colSpan={7} className="px-6 py-4 bg-indigo-50/30">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Detail Produk */}
                            <div className="sm:col-span-2">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Detail Produk</p>
                              <div className="space-y-1.5">
                                {tx.products.length === 0 ? (
                                  <p className="text-xs text-gray-400">Tidak ada data produk</p>
                                ) : tx.products.map((p, i) => (
                                  <div key={i} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-gray-100">
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">{p.productName || 'Produk tidak ditemukan'}</p>
                                      <p className="text-xs text-gray-400">Qty: {p.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold text-gray-700">
                                      {p.price ? fmt(p.price * p.quantity) : '—'}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Info Pembayaran */}
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Info Pesanan</p>
                              <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">ID Lengkap</span>
                                  <span className="font-mono text-gray-700 text-right ml-2 truncate max-w-[120px]">{tx._id.toString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">Metode Bayar</span>
                                  <span className="font-semibold text-gray-800 capitalize">{tx.paymentType?.replace(/_/g, ' ') || '—'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">Tanggal</span>
                                  <span className="font-semibold text-gray-800">{fmtDate(tx.createdAt)}</span>
                                </div>
                                <div className="flex justify-between text-xs pt-2 border-t border-gray-100">
                                  <span className="text-gray-500 font-semibold">Total</span>
                                  <span className="font-bold text-[#4F46E5]">{fmt(tx.totalPrice)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <p className="text-xs text-gray-400">{filtered.length} pesanan ditampilkan</p>
            <p className="text-xs text-gray-400">
              Total nilai: <span className="font-bold text-gray-700">{fmt(filtered.reduce((s, t) => s + t.totalPrice, 0))}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pesanan;
