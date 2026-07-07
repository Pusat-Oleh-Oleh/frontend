import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  ExclamationTriangleIcon, ShoppingCartIcon, CurrencyDollarIcon,
  UsersIcon, ClockIcon, CheckBadgeIcon, ArrowTrendingUpIcon,
  ChartBarIcon, BanknotesIcon,
} from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../components/context/AuthContext';
import { Link } from 'react-router-dom';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, gradient, loading, to }) => {
  const card = (
    <div className={`bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/60 ${to ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-0.5">{label}</p>
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-lg" />
              <div className="h-4 w-20 bg-gray-100 animate-pulse rounded-lg" />
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
            </>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {to && !loading && (
        <div className="flex items-center gap-1 text-xs font-medium text-[#4F46E5] mt-2">
          Lihat detail <ArrowRightIcon className="w-3 h-3" />
        </div>
      )}
    </div>
  );
  return to ? <Link to={to}>{card}</Link> : card;
};

// ─── Home Component ───────────────────────────────────────────────────────────
const Home = () => {
  const [stats, setStats] = useState({
    newOrders: 0, readyToShip: 0, totalSales: 0, revenue: 0, visitors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopName, setShopName] = useState('');

  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount || 0);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch transaksi + shop stats secara paralel
      const [txRes, shopRes, statsRes] = await Promise.all([
        axios.get(`${apiUrl}/transaction/seller`, { headers }),
        axios.get(`${apiUrl}/shop`, { headers }),
        axios.get(`${apiUrl}/shop/seller/stats`, { headers }).catch(() => ({ data: { visitors: 0 } })),
      ]);

      setShopName(shopRes.data.shop?.name || '');

      const txList = txRes.data.transactions || [];
      const computed = txList.reduce((acc, item) => {
        const status = item.status?.status;
        const price = item.transaction?.totalPrice || 0;
        if (status === 'Paid')      { acc.newOrders++;   acc.revenue += price; }
        if (status === 'Processed') { acc.readyToShip++; acc.revenue += price; }
        if (status === 'Completed') { acc.totalSales++;  acc.revenue += price; }
        return acc;
      }, { newOrders: 0, readyToShip: 0, totalSales: 0, revenue: 0 });

      setStats({
        ...computed,
        visitors: statsRes.data.visitors || 0,
      });
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || 'Gagal memuat data');
        toast.error('Gagal memuat data dashboard');
      }
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-100 rounded-xl">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Terjadi Kesalahan</h3>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
        <button onClick={fetchStats} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
          <ClockIcon className="w-4 h-4" /> Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text mb-1">
            Selamat Datang{shopName ? `, ${shopName}` : ''}! 👋
          </h1>
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            <ClockIcon className="w-4 h-4" />
            Update: {new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
          </p>
        </div>
        <Link
          to="/dashboard-seller/keuangan"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/30 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
        >
          <BanknotesIcon className="w-4 h-4" />
          Laporan Keuangan
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Pesanan Baru"
          value={stats.newOrders}
          sub="Menunggu diproses"
          icon={ShoppingCartIcon}
          gradient="from-blue-500 to-indigo-600"
          loading={loading}
          to="/dashboard-seller/pesanan"
        />
        <StatCard
          label="Siap Kirim"
          value={stats.readyToShip}
          sub="Sudah diproses"
          icon={CheckBadgeIcon}
          gradient="from-emerald-500 to-green-600"
          loading={loading}
          to="/dashboard-seller/pesanan"
        />
        <StatCard
          label="Total Pendapatan"
          value={formatCurrency(stats.revenue)}
          sub="Dari transaksi aktif"
          icon={CurrencyDollarIcon}
          gradient="from-violet-500 to-purple-600"
          loading={loading}
          to="/dashboard-seller/keuangan"
        />
        <StatCard
          label="Pengunjung Toko"
          value={stats.visitors.toLocaleString('id-ID')}
          sub="Kunjungan halaman toko"
          icon={UsersIcon}
          gradient="from-rose-500 to-pink-600"
          loading={loading}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Selesai */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-white/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-green-100 rounded-xl">
              <CheckBadgeIcon className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Total Selesai</h3>
          </div>
          {loading ? (
            <div className="h-10 bg-gray-200 animate-pulse rounded-lg" />
          ) : (
            <>
              <p className="text-4xl font-bold text-green-600 mb-1">{stats.totalSales}</p>
              <p className="text-sm text-gray-400">Transaksi berhasil diselesaikan</p>
            </>
          )}
        </div>

        {/* Pendapatan */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-white/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-indigo-100 rounded-xl">
              <ArrowTrendingUpIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Total Revenue</h3>
          </div>
          {loading ? (
            <div className="h-10 bg-gray-200 animate-pulse rounded-lg" />
          ) : (
            <>
              <p className="text-2xl font-bold text-indigo-600 mb-1">{formatCurrency(stats.revenue)}</p>
              <p className="text-sm text-gray-400">Dari semua transaksi aktif</p>
            </>
          )}
        </div>

        {/* Pesanan Aktif */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-white/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-orange-100 rounded-xl">
              <ChartBarIcon className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Pesanan Aktif</h3>
          </div>
          {loading ? (
            <div className="h-10 bg-gray-200 animate-pulse rounded-lg" />
          ) : (
            <>
              <p className="text-4xl font-bold text-orange-600 mb-1">{stats.newOrders + stats.readyToShip}</p>
              <p className="text-sm text-gray-400">Perlu perhatian Anda sekarang</p>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text mb-4">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { to: '/dashboard-seller/produk',   icon: ChartBarIcon,      label: 'Kelola Produk',   desc: 'Tambah atau edit produk',        gradient: 'from-blue-50 to-indigo-50',  iconColor: 'text-[#4F46E5]' },
            { to: '/dashboard-seller/pesanan',  icon: ShoppingCartIcon,  label: 'Kelola Pesanan',  desc: 'Proses pesanan masuk',            gradient: 'from-emerald-50 to-green-50', iconColor: 'text-emerald-600' },
            { to: '/dashboard-seller/keuangan', icon: BanknotesIcon,     label: 'Laporan Keuangan',desc: 'Lihat riwayat & statistik',       gradient: 'from-violet-50 to-purple-50', iconColor: 'text-violet-600' },
          ].map(({ to, icon: Icon, label, desc, gradient, iconColor }) => (
            <Link key={to} to={to}>
              <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border border-white`}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{label}</h3>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
