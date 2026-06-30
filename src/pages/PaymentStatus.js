import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../components/context/AuthContext';
import Header from '../components/section/header';
import Footer from '../components/section/footer';

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = location.state?.orderId;
  const initialStatus = location.state?.status;

  const fetchStatus = useCallback(async () => {
    if (!orderId) return;
    try {
      const response = await axios.get(`${apiUrl}/payment/status/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPaymentData(response.data);
    } catch (err) {
      console.error('Error fetching payment status:', err);
    } finally {
      setLoading(false);
    }
  }, [orderId, apiUrl, token]);

  useEffect(() => {
    if (!orderId) {
      navigate('/transaction');
      return;
    }
    fetchStatus();
  }, [orderId, navigate, fetchStatus]);

  // Poll for status updates if pending
  useEffect(() => {
    if (initialStatus === 'pending' || paymentData?.status === 'Not Paid') {
      const interval = setInterval(fetchStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [initialStatus, paymentData?.status, fetchStatus]);

  const getStatusConfig = () => {
    const status = paymentData?.status || initialStatus;
    
    if (status === 'success' || status === 'Paid') {
      return {
        icon: (
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ),
        title: 'Pembayaran Berhasil!',
        description: 'Terima kasih! Pembayaran Anda telah diterima dan sedang diproses.',
        borderColor: 'border-emerald-500/20',
        bgColor: 'from-emerald-500/10 to-emerald-600/10',
      };
    } else if (status === 'pending' || status === 'Not Paid') {
      return {
        icon: (
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        ),
        title: 'Menunggu Pembayaran',
        description: 'Silakan selesaikan pembayaran Anda. Status akan diperbarui otomatis.',
        borderColor: 'border-amber-500/20',
        bgColor: 'from-amber-500/10 to-amber-600/10',
      };
    } else {
      return {
        icon: (
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ),
        title: 'Pembayaran Gagal',
        description: 'Maaf, pembayaran Anda tidak berhasil. Silakan coba lagi.',
        borderColor: 'border-red-500/20',
        bgColor: 'from-red-500/10 to-red-600/10',
      };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border ${config.borderColor}`}>
          {loading ? (
            <div className="py-12">
              <div className="w-16 h-16 border-4 border-[#4F46E5]/30 border-t-[#4F46E5] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat status pembayaran...</p>
            </div>
          ) : (
            <>
              {config.icon}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{config.title}</h1>
              <p className="text-lg text-gray-600 mb-8">{config.description}</p>

              {paymentData && (
                <div className={`bg-gradient-to-r ${config.bgColor} rounded-xl p-6 mb-8 text-left`}>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID</span>
                      <span className="font-medium text-gray-900 font-mono text-sm">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Pembayaran</span>
                      <span className="font-bold text-gray-900">Rp{paymentData.totalPrice?.toLocaleString()}</span>
                    </div>
                    {paymentData.paymentType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Metode Pembayaran</span>
                        <span className="font-medium text-gray-900 capitalize">{paymentData.paymentType.replace(/_/g, ' ')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className="font-medium text-gray-900">{paymentData.status}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/transaction"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Lihat Pesanan
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Kembali ke Beranda
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentStatus;
