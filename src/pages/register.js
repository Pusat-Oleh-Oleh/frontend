import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { AuthContext } from "../components/context/AuthContext";

function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // State untuk input formulir
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // State untuk modal pilih role Google
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingCredential, setPendingCredential] = useState(null);
  const [selectedRole, setSelectedRole] = useState("buyer");
  const [roleSubmitting, setRoleSubmitting] = useState(false);

  // Tangani perubahan input
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Tangani pengiriman formulir
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, repassword } = formData;

    // Validasi password dan repassword
    if (password !== repassword) {
      setError("Password tidak cocok");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registrasi berhasil!");
        navigate("/login");
      } else {
        setError(data.message || "Terjadi kesalahan");
      }
    } catch (err) {
      toast.error("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  // Ketika Google berhasil mengembalikan credential → tampilkan modal pilih role
  const handleGoogleSuccess = async (credentialResponse) => {
    setPendingCredential(credentialResponse.credential);
    setSelectedRole("buyer");
    setShowRoleModal(true);
  };

  const handleGoogleError = () => {
    setError("Daftar dengan Google gagal. Coba lagi.");
    toast.error("Daftar dengan Google gagal.");
  };

  // Setelah user memilih role di modal → kirim ke backend
  const handleRoleSubmit = async () => {
    if (!pendingCredential) return;
    setRoleSubmitting(true);
    setError("");

    try {
      const response = await axios.post(`${apiUrl}/auth/google/register`, {
        credential: pendingCredential,
        role: selectedRole,
      });

      const { token } = response.data;
      login(token);

      toast.success(`Daftar sebagai ${selectedRole === "buyer" ? "Buyer" : "Seller"} berhasil!`);

      setShowRoleModal(false);
      setPendingCredential(null);

      if (selectedRole === "buyer") {
        navigate("/");
      } else {
        navigate("/dashboard-seller");
      }
    } catch (err) {
      console.error("Google register error:", err);
      const message = err.response?.data?.message || "Daftar dengan Google gagal. Coba lagi.";
      setError(message);
      toast.error(message);
      setShowRoleModal(false);
    } finally {
      setRoleSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/5 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm shadow-lg rounded-lg lg:flex lg:gap-x-6 overflow-hidden">
        {/* Bagian Kiri - Form */}
        <div className="w-full lg:w-1/2 p-8 relative">
          <div className="absolute top-0 left-0 m-4 flex items-center">
            <img src="/logo.png" alt="PusatOlehOleh Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-lg font-bold">PusatOlehOleh</h1>
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-12">Buat akunmu dulu, yuk?</h2>
          <p className="text-sm text-gray-600 mb-6">
            Sudah punya akun, nih?{" "}
            <button onClick={handleLoginRedirect} className="text-[#4F46E5] font-bold hover:text-[#4338CA]">
              Masuk aja sekarang!
            </button>
          </p>

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                placeholder="Masukkan nama"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                placeholder="Masukkan email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                placeholder="Masukkan password"
              />
            </div>
            <div>
              <label htmlFor="repassword" className="block text-sm font-medium text-gray-700">Re-enter Password</label>
              <input
                type="password"
                id="repassword"
                value={formData.repassword}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                placeholder="Masukkan ulang password"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Buat Akun Buyer"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-gray-500">atau</span>
            </div>
          </div>

          {/* Google Register Button */}
          <div className="mt-4 flex justify-center">
            {googleLoading ? (
              <div className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-gray-50">
                <svg className="animate-spin h-5 w-5 mr-2 text-[#4F46E5]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                width="100%"
                text="signup_with"
                shape="rectangular"
                logo_alignment="left"
              />
            )}
          </div>

          <footer className="mt-8 text-center text-xs text-gray-500">
            <p> 2024 PusatOlehOleh. All Rights Reserved</p>
          </footer>
        </div>

        {/* Bagian Kanan - Gambar */}
        <div className="hidden lg:block lg:w-1/2">
          <img className="object-cover w-full h-full" src="/placeholder.png" alt="Placeholder" />
        </div>
      </div>

      {/* Modal Pilih Role Google */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-[fadeInScale_0.2s_ease-out]">
            {/* Header */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              Daftar sebagai apa?
            </h2>
            <p className="text-sm text-center text-gray-500 mb-6">
              Pilih tipe akun yang ingin kamu buat
            </p>

            {/* Pilihan Role */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Buyer */}
              <button
                id="google-register-role-buyer"
                onClick={() => setSelectedRole("buyer")}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === "buyer"
                    ? "border-[#4F46E5] bg-indigo-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40"
                }`}
              >
                {selectedRole === "buyer" && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-[#4F46E5] rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedRole === "buyer" ? "bg-[#4F46E5]" : "bg-gray-100"}`}>
                  <svg className={`w-5 h-5 ${selectedRole === "buyer" ? "text-white" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className={`text-sm font-semibold ${selectedRole === "buyer" ? "text-[#4F46E5]" : "text-gray-600"}`}>
                  Buyer
                </span>
                <span className={`text-xs text-center leading-tight ${selectedRole === "buyer" ? "text-indigo-400" : "text-gray-400"}`}>
                  Belanja produk pilihan
                </span>
              </button>

              {/* Seller */}
              <button
                id="google-register-role-seller"
                onClick={() => setSelectedRole("seller")}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === "seller"
                    ? "border-[#7C3AED] bg-violet-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50/40"
                }`}
              >
                {selectedRole === "seller" && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-[#7C3AED] rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedRole === "seller" ? "bg-[#7C3AED]" : "bg-gray-100"}`}>
                  <svg className={`w-5 h-5 ${selectedRole === "seller" ? "text-white" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <span className={`text-sm font-semibold ${selectedRole === "seller" ? "text-[#7C3AED]" : "text-gray-600"}`}>
                  Seller
                </span>
                <span className={`text-xs text-center leading-tight ${selectedRole === "seller" ? "text-violet-400" : "text-gray-400"}`}>
                  Jual produk kamu
                </span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                id="google-register-confirm"
                onClick={handleRoleSubmit}
                disabled={roleSubmitting}
                className={`w-full py-3 px-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 ${roleSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {roleSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  `Daftar sebagai ${selectedRole === "buyer" ? "Buyer" : "Seller"}`
                )}
              </button>
              <button
                id="google-register-cancel"
                onClick={() => {
                  setShowRoleModal(false);
                  setPendingCredential(null);
                }}
                disabled={roleSubmitting}
                className="w-full py-2.5 px-4 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
