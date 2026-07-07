import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon, CurrencyDollarIcon, MagnifyingGlassIcon,
  BanknotesIcon, ArrowTrendingUpIcon, CalendarDaysIcon,
  CheckBadgeIcon, XCircleIcon, ClockIcon, ShoppingBagIcon,
  ArrowLeftIcon, BuildingLibraryIcon, XMarkIcon,
  InformationCircleIcon, ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, LineElement, BarElement, PointElement,
  LinearScale, Title, Tooltip, Legend, CategoryScale, Filler,
} from 'chart.js';
import axios from 'axios';
import { AuthContext } from '../../components/context/AuthContext';
import { toast } from 'react-hot-toast';

ChartJS.register(LineElement, BarElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, Filler);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n || 0);
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtDateTime = (d) =>
  new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const TX_STATUS = {
  Paid:       { label: 'Lunas',       bg: 'bg-blue-100',   text: 'text-blue-700',   icon: CurrencyDollarIcon },
  Processed:  { label: 'Diproses',    bg: 'bg-amber-100',  text: 'text-amber-700',  icon: ClockIcon },
  Completed:  { label: 'Selesai',     bg: 'bg-green-100',  text: 'text-green-700',  icon: CheckBadgeIcon },
  Cancelled:  { label: 'Batal',       bg: 'bg-red-100',    text: 'text-red-700',    icon: XCircleIcon },
  Expired:    { label: 'Kadaluarsa',  bg: 'bg-gray-100',   text: 'text-gray-600',   icon: XCircleIcon },
  'Not Paid': { label: 'Belum Bayar', bg: 'bg-orange-100', text: 'text-orange-700', icon: ClockIcon },
};

const WD_STATUS = {
  Pending:    { label: 'Menunggu',  bg: 'bg-yellow-100', text: 'text-yellow-700', icon: ClockIcon },
  Processing: { label: 'Diproses', bg: 'bg-blue-100',   text: 'text-blue-700',   icon: ArrowTrendingUpIcon },
  Completed:  { label: 'Berhasil', bg: 'bg-green-100',  text: 'text-green-700',  icon: CheckBadgeIcon },
  Rejected:   { label: 'Ditolak',  bg: 'bg-red-100',    text: 'text-red-700',    icon: XCircleIcon },
};

const BANKS = ['BCA', 'BNI', 'BRI', 'Mandiri', 'CIMB', 'Permata', 'Danamon', 'BTN', 'BSI'];

// ─────────────────────────────────────────────────────────────────────────────
// MODAL PENARIKAN
// Struktur: flex-col + max-height → header fixed, body scrollable, footer fixed
// ─────────────────────────────────────────────────────────────────────────────
const WithdrawalModal = ({ onClose, availableBalance, onSuccess }) => {
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [form, setForm] = useState({
    bankName: '', accountNumber: '', accountName: '', amount: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1=form  2=konfirmasi  3=sukses

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const amount = parseInt(form.amount) || 0;

  // validasi — kembalikan string error atau null
  const validate = () => {
    if (!form.bankName)                                    return 'Pilih bank tujuan';
    if (!form.accountNumber.trim())                        return 'Nomor rekening wajib diisi';
    if (!/^\d{8,20}$/.test(form.accountNumber.trim()))    return 'Nomor rekening harus 8–20 digit angka';
    if (!form.accountName.trim())                         return 'Nama pemilik rekening wajib diisi';
    if (!amount || amount < 10000)                        return 'Minimal penarikan Rp10.000';
    if (amount > availableBalance)                        return `Melebihi saldo tersedia (${fmt(availableBalance)})`;
    return null;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await axios.post(
        `${apiUrl}/withdrawal`,
        { amount, bankName: form.bankName, accountNumber: form.accountNumber.trim(), accountName: form.accountName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStep(3);
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengajukan penarikan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* modal container — flex column, max-height 92vh */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── HEADER (fixed) ───────────────────────────────── */}
        <div className="flex-shrink-0 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-t-2xl px-5 pt-5 pb-4">
          {/* title row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <BanknotesIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-base leading-tight">Tarik Dana</h2>
                <p className="text-white/60 text-xs">Transfer ke rekening bank Anda</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          {/* saldo + step indicator */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2.5">
              <p className="text-white/50 text-xs mb-0.5">Saldo Tersedia</p>
              <p className="text-white font-bold text-xl leading-tight">{fmt(availableBalance)}</p>
            </div>
            {step < 3 && (
              <div className="flex items-center gap-1.5 pr-1">
                {[1, 2].map(s => (
                  <React.Fragment key={s}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      s < step  ? 'bg-emerald-400 border-emerald-400 text-white' :
                      s === step ? 'bg-white border-white text-[#4F46E5]' :
                                   'bg-transparent border-white/30 text-white/40'
                    }`}>
                      {s < step ? '✓' : s}
                    </div>
                    {s < 2 && (
                      <div className={`w-6 h-0.5 rounded-full transition-all ${step > 1 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* step label */}
          {step < 3 && (
            <p className="text-white/50 text-xs mt-2">
              Langkah {step} dari 2 — {step === 1 ? 'Isi Data Rekening' : 'Konfirmasi Penarikan'}
            </p>
          )}
        </div>

        {/* ── BODY (scrollable) ─────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── STEP 1: Form ── */}
          {step === 1 && (
            <div className="px-5 py-5 space-y-5">

              {/* Pilih Bank */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Bank Tujuan *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {BANKS.map(bank => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => set('bankName', bank)}
                      className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all duration-150 ${
                        form.bankName === bank
                          ? 'border-[#4F46E5] bg-indigo-50 text-[#4F46E5] shadow-sm'
                          : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-indigo-200 hover:bg-indigo-50/50'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>

              {/* No. Rekening */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Nomor Rekening *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.accountNumber}
                  onChange={e => set('accountNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="Contoh: 0123456789"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-mono text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#4F46E5] transition-colors"
                />
              </div>

              {/* Nama Pemilik */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Nama Pemilik Rekening *
                </label>
                <input
                  type="text"
                  value={form.accountName}
                  onChange={e => set('accountName', e.target.value.toUpperCase())}
                  placeholder="NAMA SESUAI BUKU TABUNGAN"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-900 uppercase tracking-wide bg-gray-50 focus:bg-white focus:outline-none focus:border-[#4F46E5] transition-colors"
                />
              </div>

              {/* Jumlah */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Jumlah Penarikan *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={e => set('amount', e.target.value)}
                    placeholder="0"
                    min="10000"
                    max={availableBalance}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:border-[#4F46E5] transition-colors"
                  />
                </div>
                {/* quick chips */}
                <div className="flex gap-1.5 flex-wrap mt-2">
                  {[100000, 250000, 500000, 1000000]
                    .filter(v => v <= availableBalance)
                    .map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => set('amount', String(v))}
                        className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                          amount === v
                            ? 'bg-[#4F46E5] text-white shadow-sm'
                            : 'bg-indigo-50 text-[#4F46E5] hover:bg-indigo-100'
                        }`}
                      >
                        {v >= 1000000 ? `${v / 1000000}jt` : `${v / 1000}rb`}
                      </button>
                    ))}
                  {availableBalance >= 10000 && (
                    <button
                      type="button"
                      onClick={() => set('amount', String(availableBalance))}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        amount === availableBalance
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      Semua
                    </button>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-gray-400 flex items-center gap-1">
                  <InformationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  Minimal Rp10.000 · Estimasi proses 1–3 hari kerja
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 2: Konfirmasi ── */}
          {step === 2 && (
            <div className="px-5 py-5 space-y-4">
              <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Detail Penarikan</p>
                </div>
                <div className="px-4 py-3 space-y-3">
                  {[
                    { label: 'Bank Tujuan',   value: form.bankName },
                    { label: 'No. Rekening',  value: form.accountNumber, mono: true },
                    { label: 'Nama Pemilik',  value: form.accountName },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{label}</span>
                      <span className={`text-sm font-semibold text-gray-900 ${mono ? 'font-mono' : ''}`}>{value}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Jumlah Transfer</span>
                      <span className="text-lg font-bold text-[#4F46E5]">{fmt(amount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Sisa Saldo Setelah Tarik</span>
                      <span className="text-sm font-bold text-emerald-600">{fmt(availableBalance - amount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 items-start bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Pastikan data rekening sudah benar.{' '}
                  <strong>Penarikan yang sudah diajukan tidak dapat dibatalkan.</strong>
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 3: Sukses ── */}
          {step === 3 && (
            <div className="px-5 py-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
                <CheckCircleIcon className="w-9 h-9 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Penarikan Diajukan!</h3>
              <p className="text-sm text-gray-500 mb-0.5">
                <span className="font-bold text-gray-900">{fmt(amount)}</span> akan ditransfer ke
              </p>
              <p className="text-sm font-bold text-gray-800">{form.bankName} · {form.accountNumber}</p>
              <p className="text-xs text-gray-400 mb-5">a/n {form.accountName}</p>
              <div className="bg-indigo-50 rounded-xl px-4 py-3">
                <p className="text-xs text-indigo-700">
                  ⏱ Estimasi <strong>1–3 hari kerja</strong>.
                  Notifikasi dikirim saat dana berhasil ditransfer.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── FOOTER (fixed — selalu terlihat) ──────────────── */}
        <div className="flex-shrink-0 px-5 py-4 bg-white border-t border-gray-100 rounded-b-2xl">
          {step === 1 && (
            <button
              onClick={() => {
                const err = validate();
                if (err) { toast.error(err); return; }
                setStep(2);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              Lanjut ke Konfirmasi
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <div className="flex gap-2.5">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                ← Ubah Data
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-[2] py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <BanknotesIcon className="w-4 h-4" />
                    Ajukan Penarikan
                  </>
                )}
              </button>
            </div>
          )}

          {step === 3 && (
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold rounded-xl text-sm hover:shadow-lg transition-all"
            >
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HALAMAN KEUANGAN UTAMA
// ─────────────────────────────────────────────────────────────────────────────
export default function Keuangan() {
  const { token } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [wdLoading, setWdLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [period, setPeriod] = useState('30');
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/transaction/seller`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = (res.data.transactions || []).map(item => ({
        _id: item.transaction._id,
        orderId: item.transaction.midtransOrderId,
        totalPrice: item.transaction.totalPrice,
        paymentType: item.transaction.paymentType,
        createdAt: item.transaction.createdAt,
        status: item.status.status,
      }));
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTransactions(list);
    } catch (err) {
      if (err.response?.status !== 404) toast.error('Gagal memuat transaksi');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

  const fetchWithdrawals = useCallback(async () => {
    try {
      setWdLoading(true);
      const res = await axios.get(`${apiUrl}/withdrawal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWithdrawals(res.data.withdrawals || []);
      setAvailableBalance(res.data.availableBalance || 0);
    } catch (err) {
      if (err.response?.status !== 404) toast.error('Gagal memuat saldo');
    } finally {
      setWdLoading(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    fetchTransactions();
    fetchWithdrawals();
  }, [fetchTransactions, fetchWithdrawals]);

  // ─── Period filter ────────────────────────────────────────────────────────
  const now = new Date();
  const periodFiltered = transactions.filter(tx => {
    const diff = (now - new Date(tx.createdAt)) / 86400000;
    return diff <= parseInt(period);
  });

  // ─── Stats ───────────────────────────────────────────────────────────────
  const revenue       = periodFiltered.filter(t => ['Paid','Processed','Completed'].includes(t.status)).reduce((s,t) => s+t.totalPrice, 0);
  const completed     = periodFiltered.filter(t => t.status === 'Completed').length;
  const pending       = periodFiltered.filter(t => ['Paid','Processed'].includes(t.status)).length;
  const totalWithdrawn = withdrawals.filter(w => w.status === 'Completed').reduce((s,w) => s+w.amount, 0);
  const pendingWd     = withdrawals.find(w => ['Pending','Processing'].includes(w.status));

  // ─── Chart ───────────────────────────────────────────────────────────────
  const buildChartData = () => {
    const days = parseInt(period);
    const labels = [], revenueData = [], txCountData = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }));
      const dayTx = periodFiltered.filter(tx => {
        const td = new Date(tx.createdAt);
        return td.getDate()===d.getDate() && td.getMonth()===d.getMonth() && td.getFullYear()===d.getFullYear()
          && ['Paid','Processed','Completed'].includes(tx.status);
      });
      revenueData.push(dayTx.reduce((s,t) => s+t.totalPrice, 0));
      txCountData.push(dayTx.length);
    }
    const step = days > 14 ? Math.ceil(days / 14) : 1;
    return {
      labels: labels.map((l,i) => i%step===0 ? l : ''),
      datasets: [
        { type:'line', label:'Pendapatan', data:revenueData, borderColor:'#4F46E5', backgroundColor:'rgba(79,70,229,0.08)', tension:0.4, fill:true, pointRadius:2, yAxisID:'y' },
        { type:'bar',  label:'Transaksi',  data:txCountData, backgroundColor:'rgba(124,58,237,0.15)', borderColor:'#7C3AED', borderWidth:1.5, borderRadius:4, yAxisID:'y1' },
      ],
    };
  };

  const chartOptions = {
    responsive:true, interaction:{ mode:'index', intersect:false },
    plugins:{
      legend:{ position:'top', labels:{ font:{ family:'Inter,sans-serif', size:11 }, color:'#6B7280', padding:16 }},
      tooltip:{ backgroundColor:'rgba(255,255,255,0.97)', titleColor:'#374151', bodyColor:'#4B5563', borderColor:'#E5E7EB', borderWidth:1, padding:12,
        callbacks:{ label:(ctx) => ctx.dataset.label==='Pendapatan' ? ` ${fmt(ctx.parsed.y)}` : ` ${ctx.parsed.y} transaksi` }},
    },
    scales:{
      y:{ type:'linear', position:'left',  beginAtZero:true, grid:{ color:'#F3F4F6' }, ticks:{ callback:v=>v>=1e6?`${(v/1e6).toFixed(1)}jt`:v, color:'#9CA3AF', font:{size:10} }},
      y1:{ type:'linear', position:'right', beginAtZero:true, grid:{ drawOnChartArea:false }, ticks:{ stepSize:1, color:'#9CA3AF', font:{size:10} }},
      x:{ grid:{ color:'#F9FAFB' }, ticks:{ color:'#9CA3AF', font:{size:10} }},
    },
  };

  // ─── Table filter ─────────────────────────────────────────────────────────
  const tableData = periodFiltered.filter(tx => {
    const ms = filterStatus==='Semua' || tx.status===filterStatus;
    const mq = !search || tx.orderId?.toLowerCase().includes(search.toLowerCase()) || fmt(tx.totalPrice).includes(search);
    return ms && mq;
  });
  const totalPages = Math.ceil(tableData.length / PER_PAGE);
  const paginated  = tableData.slice((page-1)*PER_PAGE, page*PER_PAGE);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/dashboard-seller/home"
              className="p-1.5 text-gray-400 hover:text-[#4F46E5] hover:bg-indigo-50 rounded-lg transition-all">
              <ArrowLeftIcon className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-transparent bg-clip-text">
              Keuangan
            </h1>
          </div>
          <p className="text-sm text-gray-500 pl-9">Laporan pendapatan & penarikan dana toko Anda</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={e => { setPeriod(e.target.value); setPage(1); }}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 shadow-sm"
          >
            <option value="7">7 Hari</option>
            <option value="30">30 Hari</option>
            <option value="90">3 Bulan</option>
            <option value="365">1 Tahun</option>
          </select>
          <button
            onClick={() => setShowModal(true)}
            disabled={!!pendingWd || availableBalance < 10000 || wdLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-md shadow-green-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <BanknotesIcon className="w-4 h-4" />
            {pendingWd ? 'Diproses...' : 'Tarik Dana'}
          </button>
        </div>
      </div>

      {/* ── Balance Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Saldo utama */}
        <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-2xl p-5 shadow-lg shadow-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <BuildingLibraryIcon className="w-4 h-4 text-white/60" />
            <p className="text-white/60 text-xs font-medium">Saldo Dapat Ditarik</p>
          </div>
          {wdLoading
            ? <div className="h-9 bg-white/20 animate-pulse rounded-xl" />
            : <p className="text-white font-bold text-3xl">{fmt(availableBalance)}</p>
          }
          <p className="text-white/40 text-xs mt-1.5">Dari transaksi yang sudah Selesai</p>
          {pendingWd && (
            <div className="mt-3 bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
              <ClockIcon className="w-3.5 h-3.5 text-yellow-300 flex-shrink-0" />
              <p className="text-yellow-200 text-xs">Ada penarikan sedang diproses</p>
            </div>
          )}
        </div>

        {/* Pendapatan & total ditarik */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {[
            { label:`Pendapatan (${period}h)`, value:fmt(revenue),       icon:ArrowTrendingUpIcon, grad:'from-violet-500 to-purple-600', sub:`${completed} transaksi selesai` },
            { label:'Total Ditarik',           value:fmt(totalWithdrawn), icon:BanknotesIcon,       grad:'from-emerald-500 to-green-600', sub:`${withdrawals.filter(w=>w.status==='Completed').length}x penarikan` },
          ].map(({ label, value, icon:Icon, grad, sub }) => (
            <div key={label} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              {loading || wdLoading
                ? <div className="h-7 bg-gray-200 animate-pulse rounded-lg" />
                : <>
                    <p className="font-bold text-gray-900 text-xl">{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                    <p className="text-xs font-medium text-gray-600 mt-1">{label}</p>
                  </>
              }
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-gray-100/80 p-1 rounded-xl w-fit">
        {[
          { key:'overview',    label:'Ringkasan' },
          { key:'transactions',label:'Transaksi' },
          { key:'withdrawals', label:'Riwayat Penarikan' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab===key ? 'bg-white text-[#4F46E5] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── TAB: RINGKASAN ── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:'Pendapatan Aktif', value:fmt(revenue), icon:CurrencyDollarIcon, grad:'from-violet-500 to-purple-600', sub:'Paid+Diproses+Selesai' },
              { label:'Pesanan Selesai',  value:completed,    icon:CheckBadgeIcon,     grad:'from-emerald-500 to-green-600', sub:`dalam ${period} hari` },
              { label:'Menunggu Proses',  value:pending,      icon:ShoppingBagIcon,    grad:'from-blue-500 to-indigo-600',   sub:'Paid & Diproses' },
              { label:'Penarikan Aktif',  value:withdrawals.filter(w=>['Pending','Processing'].includes(w.status)).length,
                icon:BanknotesIcon, grad:'from-amber-500 to-orange-500', sub:'sedang diproses' },
            ].map(({ label, value, icon:Icon, grad, sub }) => (
              <div key={label} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-white/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center mb-3`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                {loading ? <div className="h-7 bg-gray-200 animate-pulse rounded-lg" /> : (
                  <>
                    <p className="font-bold text-gray-900 text-xl">{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                    <p className="text-xs font-medium text-gray-600 mt-1">{label}</p>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ChartBarIcon className="w-5 h-5 text-[#4F46E5]" />
                <h3 className="font-bold text-gray-900">Grafik Pendapatan</h3>
              </div>
              <p className="text-xs text-gray-400">{period} hari terakhir</p>
            </div>
            {loading ? <div className="h-56 bg-gray-100 animate-pulse rounded-xl" />
            : periodFiltered.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-gray-300">
                <ArrowTrendingUpIcon className="w-12 h-12 mb-2" />
                <p className="text-sm">Belum ada data periode ini</p>
              </div>
            ) : <Line data={buildChartData()} options={chartOptions} height={70} />}
          </div>
        </div>
      )}

      {/* ── TAB: TRANSAKSI ── */}
      {activeTab === 'transactions' && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <h3 className="font-bold text-gray-900">Riwayat Transaksi</h3>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Cari ID / nominal..." value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 w-48" />
              </div>
              <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20">
                {['Semua','Paid','Processed','Completed','Cancelled','Not Paid','Expired'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/70">
                  {['Tanggal','ID Pesanan','Nominal','Metode','Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? [...Array(5)].map((_,i) => (
                  <tr key={i} className="border-t border-gray-50">
                    {[...Array(5)].map((_,j) => <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-200 animate-pulse rounded" /></td>)}
                  </tr>
                )) : paginated.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-16 text-center">
                    <BanknotesIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-400">Tidak ada transaksi</p>
                  </td></tr>
                ) : paginated.map(tx => {
                  const cfg = TX_STATUS[tx.status] || TX_STATUS['Not Paid'];
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={tx._id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <CalendarDaysIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{fmtDate(tx.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                          #{tx.orderId?.slice(-10).toUpperCase() || tx._id.toString().slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4"><span className="text-sm font-semibold text-gray-900">{fmt(tx.totalPrice)}</span></td>
                      <td className="px-5 py-4"><span className="text-xs text-gray-500 capitalize">{tx.paymentType?.replace(/_/g,' ') || '—'}</span></td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                          <StatusIcon className="w-3 h-3" />{cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!loading && tableData.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">{tableData.length} transaksi · hal. {page}/{totalPages||1}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition-colors">← Prev</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page>=totalPages}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-md disabled:opacity-40 transition-all">Next →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: RIWAYAT PENARIKAN ── */}
      {activeTab === 'withdrawals' && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Riwayat Penarikan Dana</h3>
            <button
              onClick={() => setShowModal(true)}
              disabled={!!pendingWd || availableBalance < 10000 || wdLoading}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BanknotesIcon className="w-4 h-4" /> + Tarik Dana
            </button>
          </div>

          {wdLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_,i) => <div key={i} className="animate-pulse h-16 bg-gray-100 rounded-xl" />)}
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="py-20 text-center">
              <BanknotesIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 font-semibold">Belum Ada Riwayat Penarikan</p>
              <p className="text-gray-400 text-sm mt-1 mb-5">Ajukan penarikan pertama Anda</p>
              <button onClick={() => setShowModal(true)} disabled={availableBalance < 10000}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-bold rounded-xl hover:shadow-md transition-all disabled:opacity-50">
                <BanknotesIcon className="w-4 h-4" /> Tarik Dana Sekarang
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {withdrawals.map(wd => {
                const cfg = WD_STATUS[wd.status] || WD_STATUS.Pending;
                const WdIcon = cfg.icon;
                return (
                  <div key={wd._id} className="p-5 hover:bg-gray-50/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                        <WdIcon className={`w-5 h-5 ${cfg.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="font-bold text-gray-900 text-sm">{fmt(wd.amount)}</p>
                          <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.text}`}>
                            <WdIcon className="w-3 h-3" />{cfg.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold text-gray-700">{wd.bankName}</span>
                          <span className="mx-1.5 text-gray-300">·</span>
                          <span className="font-mono text-xs">{wd.accountNumber}</span>
                          <span className="mx-1.5 text-gray-300">·</span>
                          {wd.accountName}
                        </p>
                        {wd.status==='Rejected' && wd.rejectionReason && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <XCircleIcon className="w-3 h-3 flex-shrink-0" />Alasan: {wd.rejectionReason}
                          </p>
                        )}
                        {wd.status==='Completed' && wd.completedAt && (
                          <p className="text-xs text-emerald-600 mt-1">✓ Selesai {fmtDateTime(wd.completedAt)}</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 flex-shrink-0">{fmtDate(wd.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <WithdrawalModal
          onClose={() => setShowModal(false)}
          availableBalance={availableBalance}
          onSuccess={() => { setShowModal(false); fetchWithdrawals(); }}
        />
      )}
    </div>
  );
}
