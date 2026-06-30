import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../components/context/AuthContext';
import { ThreeDots } from 'react-loader-spinner';
import Header from '../components/section/header';
import Footer from '../components/section/footer';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const midtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;
<<<<<<< HEAD
=======
  const isProduction = process.env.REACT_APP_MIDTRANS_IS_PRODUCTION === 'true';
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
  
  // State declarations
  const [checkoutData, setCheckoutData] = useState(null);
  // shippingOptions[shopId] = array of { courier, service, description, cost, etd }
  const [shippingOptions, setShippingOptions] = useState({});
  const [shippingLoading, setShippingLoading] = useState({});
  // selectedCouriers[shopId] = { courier, service, description, cost, etd }
  const [selectedCouriers, setSelectedCouriers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNotes, setOrderNotes] = useState({});
  const [subTotals, setSubTotals] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shopInsurance, setShopInsurance] = useState({});
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [tempSelectedVouchers, setTempSelectedVouchers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');


  const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'discount', label: 'Diskon' },
    { id: 'cashback', label: 'Cashback' },
    { id: 'shipping', label: 'Pengiriman' }
  ];

  // Load Midtrans Snap.js script
  useEffect(() => {
<<<<<<< HEAD
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
=======
    const midtransScriptUrl = isProduction
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
    
    // Check if already loaded
    if (document.querySelector(`script[src="${midtransScriptUrl}"]`)) return;
    
    const script = document.createElement('script');
    script.src = midtransScriptUrl;
<<<<<<< HEAD
    script.setAttribute('data-client-key', midtransClientKey);
=======
    script.setAttribute('data-client-key', midtransClientKey || '');
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      // Cleanup on unmount (optional)
    };
<<<<<<< HEAD
  }, [midtransClientKey]);

  // Kalkulasi total dengan ongkir
=======
  }, [midtransClientKey, isProduction]);

  // Kalkulasi total ongkir dari selectedCouriers (sekarang object { cost, ... })
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
  const calculateTotal = useCallback(() => {
    let total = Object.values(subTotals).reduce((a, b) => a + b, 0);
    Object.values(selectedCouriers).forEach(courierInfo => {
      if (courierInfo && courierInfo.cost) {
        total += courierInfo.cost;
      }
    });
<<<<<<< HEAD

    // Tambah asuransi
    Object.entries(shopInsurance).forEach(([shopId, isInsured]) => {
      if (isInsured) {
        total += 800;
      }
=======
    Object.entries(shopInsurance).forEach(([, isInsured]) => {
      if (isInsured) total += 800;
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
    });
    return total;
  }, [subTotals, selectedCouriers, shopInsurance]);

  // Fetch ongkir dari RajaOngkir untuk semua toko (pakai endpoint cost-by-shop)
  const fetchShippingCosts = useCallback(async (addressId, shops, addressList) => {
    if (!addressId || !shops?.length) return;
    // Gunakan addressList yang dikirim langsung (hindari closure stale)
    const addrPool = addressList?.length ? addressList : addresses;
    const selectedAddr = addrPool.find(a => a._id === addressId);
    if (!selectedAddr) {
      console.warn('[Ongkir] Alamat belum ditemukan, skip fetch ongkir');
      return;
    }

    const destination = selectedAddr.city || selectedAddr.district || '';
    if (!destination) {
      toast.error('Kota pada alamat tujuan tidak ditemukan. Pastikan alamat sudah diisi lengkap.');
      return;
    }

    // Reset selected couriers when address changes
    const resetCouriers = {};
    shops.forEach(s => { resetCouriers[s.shopId] = null; });
    setSelectedCouriers(resetCouriers);

    for (const shop of shops) {
      setShippingLoading(prev => ({ ...prev, [shop.shopId]: true }));
      try {
        const totalWeight = shop.products.reduce((sum, p) => sum + (p.weight || 1000) * p.quantity, 0);
        const res = await axios.post(
          `${apiUrl}/courier/cost-by-shop`,
          {
            shopId: shop.shopId,
            destination,
            destinationId: selectedAddr.destinationId || undefined,
            weight: totalWeight
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const results = res.data.results || [];
        console.info(`[Ongkir] ${shop.shopName}: ${results.length} layanan`);
        setShippingOptions(prev => ({ ...prev, [shop.shopId]: results }));
      } catch (err) {
        console.error(`[Ongkir] Error shop ${shop.shopId}:`, err.response?.data || err.message);
        // Fallback: pakai origin kota toko dari data checkoutData jika cost-by-shop gagal
        const originFallback = shop.shopCity || shop.shopAddress?.city || '';
        if (originFallback) {
          try {
            const totalWeight = shop.products.reduce((sum, p) => sum + (p.weight || 1000) * p.quantity, 0);
            const resFallback = await axios.post(
              `${apiUrl}/courier/cost`,
              { origin: originFallback, destination, weight: totalWeight },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setShippingOptions(prev => ({ ...prev, [shop.shopId]: resFallback.data.results || [] }));
          } catch (errFallback) {
            console.error(`[Ongkir] Fallback gagal:`, errFallback.message);
            setShippingOptions(prev => ({ ...prev, [shop.shopId]: [] }));
            toast.error(`Gagal mengambil ongkir untuk toko ${shop.shopName || shop.shopId}`);
          }
        } else {
          setShippingOptions(prev => ({ ...prev, [shop.shopId]: [] }));
          toast.error(`Gagal mengambil ongkir untuk ${shop.shopName || 'toko ini'}. Pastikan toko sudah mengatur kota.`);
        }
      } finally {
        setShippingLoading(prev => ({ ...prev, [shop.shopId]: false }));
      }
    }
  }, [addresses, apiUrl, token]);


  const filterVouchers = useCallback((vouchers) => {
    let filtered = [...vouchers];
    if (selectedTab !== 'all') {
      filtered = filtered.filter(v => v.type === selectedTab);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.code.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query)
      );
    }
    switch (sortBy) {
      case 'expiring':
        filtered.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        break;
      case 'highest':
        filtered.sort((a, b) => b.value - a.value);
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return filtered;
  }, [selectedTab, searchQuery, sortBy]);

  const handleApplyVoucher = (voucher) => {
    const subtotal = Object.values(subTotals).reduce((a, b) => a + b, 0);
    if (subtotal < voucher.minPurchase) {
      toast.error(`Minimal pembelian Rp${voucher.minPurchase.toLocaleString()} untuk menggunakan voucher ini`);
      return;
    }
    if (!voucher.stackable) {
      setTempSelectedVouchers([voucher]);
      return;
    }
    const hasNonStackableVoucher = tempSelectedVouchers.some(v => !v.stackable);
    if (hasNonStackableVoucher) {
      toast.error('Tidak bisa menambahkan voucher karena sudah ada voucher yang tidak bisa digabungkan');
      return;
    }
    const hasVoucherSameType = tempSelectedVouchers.some(v => v.type === voucher.type);
    if (hasVoucherSameType) {
      toast.error('Hanya bisa memilih satu voucher untuk setiap jenisnya');
      return;
    }
    setTempSelectedVouchers([...tempSelectedVouchers, voucher]);
  };

  const removeTempVoucher = (voucherId) => {
    setTempSelectedVouchers(tempSelectedVouchers.filter(v => v.id !== voucherId));
  };

  const removeVoucher = (voucherId) => {
    setSelectedVouchers(selectedVouchers.filter(v => v.id !== voucherId));
  };

  const handleConfirmVouchers = () => {
    setSelectedVouchers([...tempSelectedVouchers]);
    setIsVoucherModalOpen(false);
  };

  const calculateVoucherDiscount = useCallback(() => {
    const subtotal = Object.values(subTotals).reduce((a, b) => a + b, 0);
    const totalShipping = Object.values(selectedCouriers).reduce((total, courierInfo) => {
      return total + (courierInfo?.cost || 0);
    }, 0);

    return selectedVouchers.reduce((acc, voucher) => {
      let discount = 0;
      if (voucher.type === 'discount') {
        discount = (voucher.value / 100) * subtotal;
<<<<<<< HEAD
        if (voucher.maxDiscount) {
          discount = Math.min(discount, voucher.maxDiscount);
        }
=======
        if (voucher.maxDiscount) discount = Math.min(discount, voucher.maxDiscount);
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
      } else if (voucher.type === 'shipping' && totalShipping > 0) {
        discount = Math.min(voucher.value, totalShipping);
      }
      return acc + discount;
    }, 0);
  }, [subTotals, selectedCouriers, selectedVouchers]);


  const handleCheckout = async () => {
    const allShopsHaveCourier = checkoutData?.shops.every(
      shop => selectedCouriers[shop.shopId]?.cost > 0
    );

    if (!allShopsHaveCourier || !selectedAddressId) {
      toast.error('Pilih kurir untuk setiap toko dan alamat pengiriman');
      return;
    }

    setIsProcessing(true);

    try {
      // BUGFIX: only send voucherId if voucher has a real MongoDB _id (not dummy data)
      const validVoucherId = selectedVouchers.length > 0 && selectedVouchers[0]._id
        ? selectedVouchers[0]._id
        : null;

      const transactionData = {
        shops: checkoutData.shops.map(shop => ({
          shopId: shop.shopId,
          products: shop.products.map(product => ({
            productId: product.productId,
            quantity: product.quantity
          })),
          courierInfo: selectedCouriers[shop.shopId], // embedded object dari RajaOngkir
          note: orderNotes[shop.shopId] || ''
        })),
<<<<<<< HEAD
        voucherId: selectedVouchers.length > 0 ? selectedVouchers[0]._id : '',
=======
        ...(validVoucherId ? { voucherId: validVoucherId } : {}),
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
        addressId: selectedAddressId
      };

      // Create transaction and get snap token
      const response = await axios.post(
        `${apiUrl}/transaction`,
        transactionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { snapToken } = response.data;

      if (!snapToken) {
        toast.error('Gagal mendapatkan token pembayaran');
        setIsProcessing(false);
        return;
      }

      // Open Midtrans Snap popup
      window.snap.pay(snapToken, {
        onSuccess: async (result) => {
<<<<<<< HEAD
          // Clear cart and localStorage
          try {
            await axios.delete(`${apiUrl}/cart/clear`, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (e) {
            console.error('Clear cart error:', e);
=======
          // Clear selected cart items after successful payment
          try {
            const cartItemIds = JSON.parse(localStorage.getItem('checkoutItems'))?.cartItemIds || [];
            await Promise.all(
              cartItemIds.map(cartId =>
                axios.delete(`${apiUrl}/cart/remove/${cartId}`, {
                  headers: { Authorization: `Bearer ${token}` }
                }).catch(() => {})
              )
            );
          } catch (e) {
            console.error('Clear cart items error:', e);
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
          }
          localStorage.removeItem('checkoutItems');
          toast.success('Pembayaran berhasil!');
          navigate('/payment/status', { state: { orderId: result.order_id, status: 'success' } });
        },
        onPending: (result) => {
          localStorage.removeItem('checkoutItems');
          toast.success('Transaksi dibuat! Silakan selesaikan pembayaran.');
          navigate('/payment/status', { state: { orderId: result.order_id, status: 'pending' } });
        },
        onError: (result) => {
          toast.error('Pembayaran gagal. Silakan coba lagi.');
<<<<<<< HEAD
          setIsProcessing(false);
        },
        onClose: () => {
          toast('Pembayaran belum selesai. Anda bisa melanjutkan dari halaman transaksi.', { icon: '⚠️' });
          setIsProcessing(false);
          // Clear cart since transaction is already created
          axios.delete(`${apiUrl}/cart/clear`, {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => {});
=======
          console.error('Midtrans payment error:', result);
          setIsProcessing(false);
        },
        onClose: () => {
          // User closed the popup without completing payment
          // Transaction is already created in DB with 'Not Paid' status
          // Do NOT clear cart here — user can retry payment from /transaction page
          toast('Pembayaran belum selesai. Anda bisa melanjutkan dari halaman transaksi.', { icon: '⚠️' });
          setIsProcessing(false);
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
          localStorage.removeItem('checkoutItems');
          navigate('/transaction');
        }
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Gagal membuat transaksi';
      toast.error(errorMessage);
      console.error('Checkout Error:', error);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedData = JSON.parse(localStorage.getItem('checkoutItems'));
        if (!savedData || !savedData.shops || savedData.shops.length === 0) {
          toast.error('Tidak ada produk yang dipilih untuk checkout');
          navigate('/cart');
          return;
        }
        
        setCheckoutData(savedData);
        
        const initialNotes = {};
        const initialCouriers = {};
        const initialInsurance = {};
        const initialShippingOptions = {};
        const initialShippingLoading = {};
        savedData.shops.forEach(shop => {
          initialNotes[shop.shopId] = '';
          initialCouriers[shop.shopId] = null;
          initialInsurance[shop.shopId] = false;
          initialShippingOptions[shop.shopId] = [];
          initialShippingLoading[shop.shopId] = false;
        });
        setOrderNotes(initialNotes);
        setSelectedCouriers(initialCouriers);
        setShopInsurance(initialInsurance);
        setShippingOptions(initialShippingOptions);
        setShippingLoading(initialShippingLoading);
        
        const totals = savedData.shops.reduce((acc, shop) => {
          const shopTotal = shop.products.reduce((sum, product) => 
            sum + (product.price * product.quantity), 0);
          acc[shop.shopId] = shopTotal;
          return acc;
        }, {});
        setSubTotals(totals);
<<<<<<< HEAD
        
        const couriersResponse = await axios.get(`${apiUrl}/courier`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCouriers(couriersResponse.data);
=======
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Gagal memuat data checkout');
        navigate('/cart');
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, navigate, token, apiUrl]);

  // Fetch voucher aktif dari API
  useEffect(() => {
<<<<<<< HEAD
=======
    const fetchVouchers = async () => {
      if (!isAuthenticated || !token) return;
      try {
        const response = await axios.get(`${apiUrl}/voucher`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Map voucher dari DB ke format yang dibutuhkan UI
        const vouchers = (Array.isArray(response.data) ? response.data : []).map(v => ({
          id: v._id,
          _id: v._id,
          code: v.name,
          type: 'discount',
          value: v.discount || 0,
          description: `Diskon ${v.discount}% — Min. Rp${(v.minPurchase || 0).toLocaleString()}`,
          minPurchase: v.minPurchase || 0,
          maxDiscount: v.maxDiscount || 999999999,
          stackable: false,
          expiryDate: v.expired || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: v.createdAt || new Date().toISOString(),
        }));
        setAvailableVouchers(vouchers);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
        // Tidak perlu toast error agar UX tidak terganggu
      }
    };
    fetchVouchers();
  }, [isAuthenticated, token, apiUrl]);

  // Fetch alamat pengiriman buyer
  useEffect(() => {
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
    const fetchAddresses = async () => {
      if (!isAuthenticated || !token) return;
      try {
        const response = await axios.get(`${apiUrl}/user/address`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.address && Array.isArray(response.data.address)) {
<<<<<<< HEAD
          setAddresses(response.data.address);
          if (response.data.address.length > 0) {
            setSelectedAddressId(response.data.address[0]._id);
=======
          const addrList = response.data.address;
          setAddresses(addrList);
          if (addrList.length > 0) {
            setSelectedAddressId(addrList[0]._id);
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
          }
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Gagal memuat alamat pengiriman');
      }
    };
    fetchAddresses();
  }, [isAuthenticated, token, apiUrl]);

  // Trigger ongkir saat selectedAddressId DAN checkoutData DAN addresses semuanya siap
  const ongkirFetchedRef = React.useRef(false);
  useEffect(() => {
    if (!selectedAddressId || !checkoutData?.shops?.length || !addresses.length) return;
    // Fetch ongkir pertama kali setelah semua data siap
    if (!ongkirFetchedRef.current) {
      ongkirFetchedRef.current = true;
      fetchShippingCosts(selectedAddressId, checkoutData.shops, addresses);
    }
  }, [selectedAddressId, checkoutData, addresses, fetchShippingCosts]);

  // Trigger ulang ongkir saat user GANTI alamat
  const prevAddressId = React.useRef(null);
  useEffect(() => {
    if (!selectedAddressId) return;
    if (prevAddressId.current !== null && prevAddressId.current !== selectedAddressId) {
      // User mengganti alamat — reset ref dan fetch ulang
      ongkirFetchedRef.current = false;
      if (checkoutData?.shops?.length && addresses.length > 0) {
        ongkirFetchedRef.current = true;
        fetchShippingCosts(selectedAddressId, checkoutData.shops, addresses);
      }
    }
    prevAddressId.current = selectedAddressId;
  }, [selectedAddressId, checkoutData, addresses, fetchShippingCosts]);


  const totalPrice = Object.values(subTotals).reduce((a, b) => a + b, 0);
  const totalItems = checkoutData?.shops.reduce((total, shop) => total + shop.products.length, 0);

  const isVoucherUsable = useCallback((voucher) => {
    const subtotal = Object.values(subTotals).reduce((a, b) => a + b, 0);
<<<<<<< HEAD
    const totalShipping = Object.values(selectedCouriers).reduce((total, courierId) => {
      const courier = couriers.find(c => c._id === courierId);
      return total + (courier ? courier.cost : 0);
    }, 0);
=======
    const totalShipping = Object.values(selectedCouriers).reduce(
      (total, ci) => total + (ci?.cost || 0), 0
    );
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
    if (subtotal < voucher.minPurchase) return false;
    if (voucher.type === 'shipping' && totalShipping === 0) return false;
    if (new Date(voucher.expiryDate) < new Date()) return false;
    if (!voucher.stackable && tempSelectedVouchers.some(v => v.id !== voucher.id)) return false;
    if (tempSelectedVouchers.some(v => v.type === voucher.type && v.id !== voucher.id)) return false;
    return true;
  }, [subTotals, selectedCouriers, tempSelectedVouchers]);

  const getVoucherUnavailableReason = useCallback((voucher) => {
    const subtotal = Object.values(subTotals).reduce((a, b) => a + b, 0);
<<<<<<< HEAD
    const totalShipping = Object.values(selectedCouriers).reduce((total, courierId) => {
      const courier = couriers.find(c => c._id === courierId);
      return total + (courier ? courier.cost : 0);
    }, 0);
=======
    const totalShipping = Object.values(selectedCouriers).reduce(
      (total, ci) => total + (ci?.cost || 0), 0
    );
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
    if (subtotal < voucher.minPurchase) return `Minimal pembelian Rp${voucher.minPurchase.toLocaleString()}`;
    if (voucher.type === 'shipping' && totalShipping === 0) return 'Tidak ada ongkos kirim';
    if (new Date(voucher.expiryDate) < new Date()) return `Voucher sudah kadaluarsa (berakhir ${new Date(voucher.expiryDate).toLocaleDateString()})`;
    if (!voucher.stackable && tempSelectedVouchers.some(v => v.id !== voucher.id)) return 'Tidak bisa digabungkan dengan voucher lain';
    if (tempSelectedVouchers.some(v => v.type === voucher.type && v.id !== voucher.id)) return 'Sudah ada voucher jenis ini yang dipilih';
    return '';
  }, [subTotals, selectedCouriers, tempSelectedVouchers]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/10 to-[#7C3AED]/10">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-full shadow-lg shadow-indigo-500/30">
            Checkout
          </span>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 mb-2">Checkout Pesanan</h1>
          <p className="text-xl text-gray-600 leading-relaxed">Lengkapi informasi pengiriman untuk menyelesaikan pesanan Anda.</p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <ThreeDots color="#4F46E5" height={50} width={50} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Alamat Pengiriman */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-[#4F46E5]/20">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] mb-6">Alamat Pengiriman</h2>
                {/* Selected Address Display */}
                {selectedAddressId && addresses.find(addr => addr._id === selectedAddressId) && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-[#4F46E5]/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {addresses.find(addr => addr._id === selectedAddressId).name}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium text-white bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-full">
                            Alamat Terpilih
                          </span>
                        </div>
                        <p className="font-medium text-gray-900">
                          {addresses.find(addr => addr._id === selectedAddressId).receiverName
                            || addresses.find(addr => addr._id === selectedAddressId).name}
                        </p>
                        <p className="text-gray-600">
                          {addresses.find(addr => addr._id === selectedAddressId).phone || '-'}
                        </p>
                        <p className="text-gray-600 mt-1">
                          {addresses.find(addr => addr._id === selectedAddressId).address
                            ? `${addresses.find(addr => addr._id === selectedAddressId).address}, ` : ''}
                          {addresses.find(addr => addr._id === selectedAddressId).city}, {' '}
                          {addresses.find(addr => addr._id === selectedAddressId).province}, {' '}
                          {addresses.find(addr => addr._id === selectedAddressId).postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {selectedAddressId ? 'Pilih Alamat Lain' : 'Pilih Alamat Pengiriman'}
                  </label>
                  <select
                    value={selectedAddressId || ''}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] bg-white shadow-sm hover:border-[#4F46E5]/50 transition-colors duration-200"
                  >
                    <option value="">Pilih alamat pengiriman</option>
                    {addresses.map((address) => (
                      <option key={address._id} value={address._id}>
                        {address.name} - {address.receiverName} ({address.city})
                      </option>
                    ))}
                  </select>
                </div>

                {/* No Address Warning */}
                {addresses.length === 0 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/15 to-amber-500/15 rounded-lg border border-yellow-200/60">
                    <div className="flex items-center space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-yellow-700">
                        Anda belum memiliki alamat pengiriman. Silakan tambah alamat baru.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Daftar Produk */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Produk yang Dibeli</h2>
              {checkoutData?.shops.map((shop) => (
                <div key={shop.shopId} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden mb-6 last:mb-0 hover:shadow-xl transition-all duration-300 border border-[#4F46E5]/20">
                  <div className="p-6">
                    {/* Header Toko */}
                    <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">{shop.shopName}</h3>
                      </div>
                    </div>

                    {/* Daftar Produk Toko */}
                    <div className="space-y-4">
                      {shop.products.map((product) => (
                        <div key={product.productId} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/placeholder-product.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-lg mb-1">{product.name}</h4>
                            <div className="flex items-center text-gray-600 text-sm space-x-4">
                              <span>{product.quantity} barang</span>
                              <span>×</span>
                              <span>Rp{product.price.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-lg">
                              Rp{(product.price * product.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pengiriman dan Catatan */}
                    <div className="mt-6">
<<<<<<< HEAD
                      {/* Kurir Selection */}
                      <div className="border border-[#4F46E5]/20 rounded-lg overflow-hidden bg-gradient-to-r from-[#4F46E5]/5 to-[#7C3AED]/5">
                        <div className="p-4 bg-white">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Regular</h4>
                            <select
                              value={selectedCouriers[shop.shopId] || ''}
                              onChange={(e) =>
                                setSelectedCouriers({
                                  ...selectedCouriers,
                                  [shop.shopId]: e.target.value,
                                })
                              }
                              className="mt-1 w-full bg-transparent border-0 focus:ring-0 p-0 text-gray-900 font-medium hover:text-[#4F46E5] transition-colors duration-200"
                            >
                              <option value="">Pilih Kurir</option>
                              {couriers.map((courier) => (
                                <option key={courier._id} value={courier._id}>
                                  {courier.name} - Rp{courier.cost.toLocaleString()}
                                </option>
                              ))}
                            </select>
                            {selectedCouriers[shop.shopId] && (
                              <p className="text-gray-500 text-sm mt-1">Estimasi tiba 24-27 desember</p>
                            )}
=======
                      {/* Kurir Selection - RajaOngkir Dinamis */}
                      <div className="border border-[#4F46E5]/20 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 bg-gradient-to-r from-[#4F46E5]/5 to-[#7C3AED]/5 border-b border-[#4F46E5]/10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                            <span className="font-semibold text-gray-800">Pilih Layanan Pengiriman</span>
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
                          </div>
                          {shippingLoading[shop.shopId] && (
                            <ThreeDots color="#4F46E5" height={20} width={30} />
                          )}
                        </div>

                        <div className="p-4 bg-white">
                          {!selectedAddressId ? (
                            <div className="text-center py-4 text-gray-400 text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Pilih alamat pengiriman terlebih dahulu
                            </div>
                          ) : shippingLoading[shop.shopId] ? (
                            <div className="text-center py-4 text-gray-400 text-sm">
                              Menghitung ongkir...
                            </div>
                          ) : (shippingOptions[shop.shopId] || []).length === 0 ? (
                            <div className="text-center py-4">
                              <p className="text-gray-500 text-sm">Tidak ada layanan pengiriman tersedia</p>
                              <p className="text-gray-400 text-xs mt-1">Pastikan kota toko dan alamat tujuan valid</p>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                              {(shippingOptions[shop.shopId] || []).map((option, idx) => {
                                const key = `${option.courierCode}-${option.service}`;
                                const isSelected =
                                  selectedCouriers[shop.shopId]?.courierCode === option.courierCode &&
                                  selectedCouriers[shop.shopId]?.service === option.service;
                                return (
                                  <label
                                    key={idx}
                                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-150 ${
                                      isSelected
                                        ? 'border-[#4F46E5] bg-indigo-50'
                                        : 'border-gray-200 hover:border-[#4F46E5]/40 hover:bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="radio"
                                        name={`courier-${shop.shopId}`}
                                        value={key}
                                        checked={isSelected}
                                        onChange={() => setSelectedCouriers(prev => ({
                                          ...prev,
                                          [shop.shopId]: option
                                        }))}
                                        className="text-[#4F46E5] focus:ring-[#4F46E5]"
                                      />
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-semibold text-gray-900 text-sm">
                                            {option.courier}
                                          </span>
                                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                                            {option.service}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                          {option.description || ''}
                                          {option.etd && option.etd !== '-' ? ` • Estimasi ${option.etd} hari` : ''}
                                        </p>
                                      </div>
                                    </div>
                                    <span className="font-bold text-[#4F46E5] text-sm whitespace-nowrap">
                                      Rp{option.cost.toLocaleString()}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Asuransi */}
                        <div className="border-t border-gray-100 p-3 bg-white flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`insurance-${shop.shopId}`}
                            checked={shopInsurance[shop.shopId] || false}
                            onChange={(e) => setShopInsurance(prev => ({ ...prev, [shop.shopId]: e.target.checked }))}
                            className="h-4 w-4 text-[#7C3AED] border-gray-300 rounded focus:ring-[#7C3AED]"
                          />
                          <label htmlFor={`insurance-${shop.shopId}`} className="text-sm text-gray-600 cursor-pointer flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#7C3AED]" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Asuransi Pengiriman <span className="text-gray-400">(+Rp800)</span>
                          </label>
                        </div>
                      </div>


                      {/* Catatan */}
                      <div className="mt-4">
                        <div className="relative">
                          <div className="flex items-center space-x-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-600">Catatan Pesanan</span>
                            <span className="text-gray-400 text-sm">0/200</span>
                          </div>
                          <textarea
                            value={orderNotes[shop.shopId] || ''}
                            onChange={(e) =>
                              setOrderNotes({
                                ...orderNotes,
                                [shop.shopId]: e.target.value,
                              })
                            }
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] bg-white shadow-sm hover:border-[#4F46E5]/50 transition-colors duration-200"
                            rows="2"
                            placeholder="Contoh: Warna putih, ukuran XL"
                          />
                        </div>
                      </div>

                      {/* Subtotal per Shop */}
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Subtotal Produk</span>
                          <span className="font-medium text-gray-900">Rp{subTotals[shop.shopId]?.toLocaleString()}</span>
                        </div>
                        {selectedCouriers[shop.shopId] && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              Ongkir ({selectedCouriers[shop.shopId].courier} {selectedCouriers[shop.shopId].service})
                            </span>
                            <span className="font-medium text-[#4F46E5]">
                              Rp{selectedCouriers[shop.shopId].cost.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {shopInsurance[shop.shopId] && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Asuransi Pengiriman</span>
                            <span className="font-medium text-gray-900">Rp800</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <span className="font-semibold text-gray-900">Total Toko</span>
                          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
                            Rp{(
                              (subTotals[shop.shopId] || 0) +
                              (selectedCouriers[shop.shopId]?.cost || 0) +
                              (shopInsurance[shop.shopId] ? 800 : 0)
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary - Right Side */}
            <div className="lg:w-96">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sticky top-24 hover:shadow-xl transition-all duration-300 border border-[#4F46E5]/20">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] mb-6">Ringkasan Pesanan</h2>
                {/* Voucher Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Voucher</h3>
                    <button 
                      onClick={() => {
                        setTempSelectedVouchers(selectedVouchers);
                        setIsVoucherModalOpen(true);
                      }}
                      className="text-sm text-[#4F46E5] hover:text-[#4338CA]"
                    >
                      {selectedVouchers.length > 0 ? 'Ganti' : 'Pilih Voucher'}
                    </button>
                  </div>
                  
                  {selectedVouchers.length > 0 ? (
                    <div className="space-y-2">
                      {selectedVouchers.map((voucher) => (
                        <div key={voucher.id} className="flex items-center justify-between p-3 border border-[#4F46E5]/20 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
                          <div>
                            <div className="font-medium text-gray-900">{voucher.code}</div>
                            <div className="text-sm text-gray-600">{voucher.description}</div>
                          </div>
                          <button
                            onClick={() => removeVoucher(voucher.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-white">
                      <span className="text-gray-500">Belum ada voucher yang dipilih</span>
                    </div>
                  )}
                </div>
                
                {/* Total Items */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Harga ({totalItems} barang)</span>
                    <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">Rp{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Ongkos Kirim</span>
                    <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
                      {Object.values(shippingLoading).some(Boolean)
                        ? <span className="text-gray-400 text-xs">Menghitung...</span>
                        : `Rp${Object.values(selectedCouriers).reduce((total, ci) => total + (ci?.cost || 0), 0).toLocaleString()}`
                      }
                    </span>
                  </div>
                  {/* Asuransi */}
                  {Object.values(shopInsurance).some(isInsured => isInsured) && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Asuransi Pengiriman ({Object.values(shopInsurance).filter(Boolean).length} toko)</span>
                      <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
                        Rp{(Object.values(shopInsurance).filter(Boolean).length * 800).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {/* Voucher */}
                  {selectedVouchers.length > 0 && (
                    <div className="flex justify-between items-center text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
                      <span>Voucher ({selectedVouchers.length})</span>
                      <span className="font-medium">-Rp{calculateVoucherDiscount().toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Metode Pembayaran - Midtrans */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-4">Metode Pembayaran</h3>
                  <div className="p-4 border border-[#4F46E5]/20 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Midtrans Secure Payment</p>
                        <p className="text-sm text-gray-600">Bank Transfer, E-Wallet, QRIS, Kartu Kredit</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['BCA', 'BNI', 'BRI', 'Mandiri', 'GoPay', 'ShopeePay', 'QRIS'].map((method) => (
                        <span key={method} className="px-2 py-1 text-xs font-medium bg-white text-gray-600 rounded border border-gray-200">
                          {method}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total Pembayaran</span>
                    <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#7C3AED]">
                      Rp{(
                        totalPrice +
                        Object.values(selectedCouriers).reduce((total, ci) => total + (ci?.cost || 0), 0) +
                        (Object.values(shopInsurance).filter(Boolean).length * 800) -
                        calculateVoucherDiscount()
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
<<<<<<< HEAD
                  disabled={!selectedAddressId || !checkoutData?.shops.every(shop => selectedCouriers[shop.shopId]) || isProcessing}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white text-center transition-all duration-300
                    ${!selectedAddressId || !checkoutData?.shops.every(shop => selectedCouriers[shop.shopId]) || isProcessing
=======
                  disabled={!selectedAddressId || !checkoutData?.shops.every(shop => selectedCouriers[shop.shopId]?.cost > 0) || isProcessing || Object.values(shippingLoading).some(Boolean)}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white text-center transition-all duration-300
                    ${!selectedAddressId || !checkoutData?.shops.every(shop => selectedCouriers[shop.shopId]?.cost > 0) || isProcessing || Object.values(shippingLoading).some(Boolean)
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:shadow-lg hover:shadow-indigo-500/30'
                    }`}
                >
                  {isProcessing
                    ? 'Memproses...'
<<<<<<< HEAD
                    : !selectedAddressId 
                    ? 'Pilih alamat pengiriman'
                    : !checkoutData?.shops.every(shop => selectedCouriers[shop.shopId])
=======
                    : Object.values(shippingLoading).some(Boolean)
                    ? 'Menghitung ongkir...'
                    : !selectedAddressId 
                    ? 'Pilih alamat pengiriman'
                    : !checkoutData?.shops.every(shop => selectedCouriers[shop.shopId]?.cost > 0)
>>>>>>> b1936b535c89d893021343af947447e04593f2bc
                      ? 'Pilih kurir untuk semua toko'
                      : 'Bayar Sekarang'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      {/* Voucher Modal */}
      {isVoucherModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Pilih Voucher</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {tempSelectedVouchers.length} voucher dipilih
                  </p>
                </div>
                <button
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Cari voucher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] bg-white shadow-sm hover:border-[#4F46E5]/50 transition-colors duration-200"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] bg-white transition-colors duration-200"
                >
                  <option value="newest">Terbaru</option>
                  <option value="expiring">Segera Berakhir</option>
                  <option value="highest">Nilai Tertinggi</option>
                </select>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      selectedTab === tab.id
                        ? 'bg-[#4F46E5] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voucher List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {filterVouchers(availableVouchers)
                .sort((a, b) => {
                  const aUsable = isVoucherUsable(a);
                  const bUsable = isVoucherUsable(b);
                  if (aUsable && !bUsable) return -1;
                  if (!aUsable && bUsable) return 1;
                  return b.value - a.value;
                })
                .map((voucher) => {
                  const isUsable = isVoucherUsable(voucher);
                  const reason = !isUsable ? getVoucherUnavailableReason(voucher) : '';

                  return (
                    <div
                      key={voucher.id}
                      className={`p-4 border rounded-xl transition-all ${
                        tempSelectedVouchers.some(v => v.id === voucher.id)
                          ? 'border-[#4F46E5]/20 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-indigo-100'
                          : isUsable
                          ? 'border-gray-200 hover:border-[#4F46E5]/50 hover:shadow-md'
                          : 'border-gray-200 bg-gray-50'
                      } ${!isUsable ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Voucher Type Icon */}
                        <div className={`p-3 rounded-lg ${
                          voucher.type === 'discount' ? 'bg-blue-100 text-blue-600' :
                          voucher.type === 'shipping' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {voucher.type === 'discount' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                          ) : voucher.type === 'shipping' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                          )}
                        </div>

                        {/* Voucher Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{voucher.code}</span>
                            {!isUsable && (
                              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                                Tidak dapat digunakan
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{voucher.description}</div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500 mt-2">
                            <span>Min. Rp{voucher.minPurchase.toLocaleString()}</span>
                            <span>•</span>
                            <span>Maks. Rp{voucher.maxDiscount.toLocaleString()}</span>
                            <span>•</span>
                            <span>s/d {new Date(voucher.expiryDate).toLocaleDateString()}</span>
                          </div>
                          {!isUsable && (
                            <div className="text-sm text-red-500 mt-2 flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              {reason}
                            </div>
                          )}
                          {voucher.stackable && (
                            <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                              Dapat digabung dengan voucher lain
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div>
                          {tempSelectedVouchers.some(v => v.id === voucher.id) ? (
                            <button
                              onClick={() => removeTempVoucher(voucher.id)}
                              className="text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors"
                            >
                              Batal
                            </button>
                          ) : isUsable ? (
                            <button
                              onClick={() => handleApplyVoucher(voucher)}
                              className="text-[#4F46E5] hover:text-[#4338CA] font-medium transition-colors"
                            >
                              Pilih
                            </button>
                          ) : (
                            <button
                              disabled
                              className="text-gray-400 font-medium cursor-not-allowed"
                            >
                              Tidak dapat digunakan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {tempSelectedVouchers.length} voucher dipilih
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsVoucherModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmVouchers}
                    className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={tempSelectedVouchers.length === 0}
                  >
                    Terapkan ({tempSelectedVouchers.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
