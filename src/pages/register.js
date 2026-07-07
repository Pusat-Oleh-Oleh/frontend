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

  // Handle Google Register/Login
  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    setError("");

    try {
      const response = await axios.post(`${apiUrl}/auth/google/login`, {
        credential: credentialResponse.credential,
      });

      const { token } = response.data;

      // Gunakan fungsi login dari AuthContext
      login(token);

      // Redirect berdasarkan role
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const role = decodedToken.role;

      toast.success("Daftar dengan Google berhasil!");

      if (role === "buyer") {
        navigate("/");
      } else if (role === "seller") {
        navigate("/dashboard-seller");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Google register error:", err);
      const message = err.response?.data?.message || "Daftar dengan Google gagal. Coba lagi.";
      setError(message);
      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Daftar dengan Google gagal. Coba lagi.");
    toast.error("Daftar dengan Google gagal.");
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

            <div className="text-right">
              <button 
                type="button"
                className="text-[#4F46E5] text-sm hover:text-[#4338CA]"
              >
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Buat Akun"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">atau</span>
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
    </div>
  );
}

export default RegisterPage;
