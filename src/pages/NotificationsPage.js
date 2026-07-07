import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../components/context/AuthContext';
import Header from '../components/section/header';
import Footer from '../components/section/footer';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  TruckIcon,
  TagIcon,
  InformationCircleIcon,
  CogIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { BellAlertIcon, BellSlashIcon } from '@heroicons/react/24/solid';

const NotificationsPage = () => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchNotifications();
  }, [isAuthenticated, token]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${apiUrl}/notification`, { headers });
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`${apiUrl}/notification/${id}/read`, {}, { headers });
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('Gagal menandai notifikasi');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`${apiUrl}/notification/read-all`, {}, { headers });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('Semua notifikasi telah dibaca');
    } catch (err) {
      toast.error('Gagal menandai semua notifikasi');
    }
  };

  const handleDelete = async (id) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${apiUrl}/notification/${id}`, { headers });
      const deleted = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (deleted && !deleted.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast.success('Notifikasi dihapus');
    } catch (err) {
      toast.error('Gagal menghapus notifikasi');
    }
  };

  const handleNotifClick = async (notification) => {
    // Auto-mark as read saat diklik
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }
    // Navigasi ke halaman terkait
    if (notification.referenceType === 'transaction') {
      navigate('/transaction');
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case 'order':
        return {
          icon: ShoppingBagIcon,
          gradient: 'from-blue-500 to-indigo-600',
          bgSoft: 'bg-blue-50',
          textColor: 'text-blue-600',
          borderColor: 'border-blue-200',
          label: 'Pesanan',
        };
      case 'payment':
        return {
          icon: CreditCardIcon,
          gradient: 'from-emerald-500 to-green-600',
          bgSoft: 'bg-emerald-50',
          textColor: 'text-emerald-600',
          borderColor: 'border-emerald-200',
          label: 'Pembayaran',
        };
      case 'shipping':
        return {
          icon: TruckIcon,
          gradient: 'from-orange-500 to-amber-600',
          bgSoft: 'bg-orange-50',
          textColor: 'text-orange-600',
          borderColor: 'border-orange-200',
          label: 'Pengiriman',
        };
      case 'promo':
        return {
          icon: TagIcon,
          gradient: 'from-pink-500 to-rose-600',
          bgSoft: 'bg-pink-50',
          textColor: 'text-pink-600',
          borderColor: 'border-pink-200',
          label: 'Promo',
        };
      case 'system':
        return {
          icon: CogIcon,
          gradient: 'from-gray-400 to-gray-600',
          bgSoft: 'bg-gray-50',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-200',
          label: 'Sistem',
        };
      default:
        return {
          icon: InformationCircleIcon,
          gradient: 'from-[#4F46E5] to-[#7C3AED]',
          bgSoft: 'bg-indigo-50',
          textColor: 'text-indigo-600',
          borderColor: 'border-indigo-200',
          label: 'Info',
        };
    }
  };

  const filterTypes = [
    { key: 'all', label: 'Semua', icon: BellIcon },
    { key: 'order', label: 'Pesanan', icon: ShoppingBagIcon },
    { key: 'payment', label: 'Pembayaran', icon: CreditCardIcon },
    { key: 'shipping', label: 'Pengiriman', icon: TruckIcon },
    { key: 'promo', label: 'Promo', icon: TagIcon },
    { key: 'system', label: 'Sistem', icon: CogIcon },
  ];

  const filteredNotifications = activeFilter === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeFilter);

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days === 1) return 'Kemarin';
    if (days < 7) return `${days} hari lalu`;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // ─── Loading Skeleton ────────────────────────────────────────────────────
  const LoadingSkeleton = () => (
    <div className="space-y-1 p-4">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="animate-pulse flex items-start gap-4 p-4 rounded-xl">
          <div className="w-11 h-11 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );

  // ─── Empty State ─────────────────────────────────────────────────────────
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10 rounded-2xl flex items-center justify-center mb-5">
        <BellSlashIcon className="w-10 h-10 text-[#4F46E5]/50" />
      </div>
      <h3 className="text-lg font-bold text-gray-700 mb-1">
        {activeFilter === 'all'
          ? 'Belum Ada Notifikasi'
          : `Tidak Ada Notifikasi ${filterTypes.find(f => f.key === activeFilter)?.label}`}
      </h3>
      <p className="text-gray-400 text-sm text-center max-w-xs">
        Notifikasi pesanan, pembayaran, dan informasi penting akan muncul di sini secara otomatis.
      </p>
      <Link
        to="/all-products"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
      >
        Mulai Belanja
        <ArrowRightIcon className="w-4 h-4" />
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/5 via-white to-[#7C3AED]/5">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/30">
              <BellAlertIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
              <p className="text-xs text-gray-400">
                {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua sudah dibaca'}
              </p>
            </div>
            {unreadCount > 0 && (
              <span className="ml-1 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#4F46E5] bg-white border border-[#4F46E5]/20 rounded-xl hover:bg-[#4F46E5]/5 transition-all duration-200 shadow-sm"
            >
              <CheckCircleIcon className="w-4 h-4" />
              Tandai Semua Dibaca
            </button>
          )}
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {filterTypes.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                activeFilter === key
                  ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white text-gray-500 hover:text-gray-800 hover:shadow-md border border-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {key !== 'all' && notifications.filter(n => n.type === key && !n.isRead).length > 0 && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  activeFilter === key ? 'bg-white/30 text-white' : 'bg-[#4F46E5]/10 text-[#4F46E5]'
                }`}>
                  {notifications.filter(n => n.type === key && !n.isRead).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Notifications List ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <LoadingSkeleton />
          ) : filteredNotifications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredNotifications.map((notification) => {
                const config = getTypeConfig(notification.type);
                const TypeIcon = config.icon;
                const hasLink = notification.referenceType === 'transaction';

                return (
                  <div
                    key={notification._id}
                    onClick={() => handleNotifClick(notification)}
                    className={`group relative flex items-start gap-4 p-5 transition-all duration-200 ${
                      hasLink ? 'cursor-pointer' : ''
                    } ${
                      !notification.isRead
                        ? 'bg-gradient-to-r from-indigo-50/60 to-transparent hover:from-indigo-50'
                        : 'hover:bg-gray-50/70'
                    }`}
                  >
                    {/* Unread indicator bar */}
                    {!notification.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#4F46E5] to-[#7C3AED] rounded-r" />
                    )}

                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <TypeIcon className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`font-semibold text-sm leading-snug ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-[#4F46E5] rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className={`text-sm mt-1 leading-relaxed ${
                            !notification.isRead ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {notification.message}
                          </p>

                          {/* Meta row */}
                          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border ${config.bgSoft} ${config.textColor} ${config.borderColor}`}>
                              <TypeIcon className="w-3 h-3" />
                              {config.label}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatTime(notification.createdAt)}
                            </span>
                            {/* Link ke transaksi */}
                            {hasLink && (
                              <span className={`inline-flex items-center gap-1 text-xs font-medium ${config.textColor} group-hover:underline`}>
                                Lihat Pesanan
                                <ArrowRightIcon className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div
                          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
                          onClick={e => e.stopPropagation()}
                        >
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className="p-1.5 text-gray-300 hover:text-[#4F46E5] hover:bg-indigo-50 rounded-lg transition-all"
                              title="Tandai sudah dibaca"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification._id)}
                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus notifikasi"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer info ── */}
        {notifications.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-5">
            Menampilkan {filteredNotifications.length} dari {notifications.length} notifikasi
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NotificationsPage;
