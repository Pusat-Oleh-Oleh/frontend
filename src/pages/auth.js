import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import { AuthContext } from "../components/context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

Modal.setAppElement("#root");

function AuthPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Ambil fungsi login dari AuthContext
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRole(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });

      const { token } = response.data;

      // Gunakan fungsi login dari AuthContext untuk menyimpan token dan memperbarui state global
      login(token);

      // Redirect berdasarkan role pengguna
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const role = decodedToken.role;

      toast.success("Login berhasil!");

      if (role === "buyer") {
        navigate("/"); // Redirect ke halaman pembeli
      } else if (role === "seller") {
        navigate("/dashboard-seller"); // Redirect ke halaman penjual
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login gagal. Silakan cek kembali email dan password Anda.");
    }
  };

  // Handle Google Login
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

      toast.success("Login dengan Google berhasil!");

      if (role === "buyer") {
        navigate("/");
      } else if (role === "seller") {
        navigate("/dashboard-seller");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Google login error:", err);
      const message = err.response?.data?.message || "Login dengan Google gagal. Coba lagi.";
      setError(message);
      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Login dengan Google gagal. Coba lagi.");
    toast.error("Login dengan Google gagal.");
  };

  const handleSubmit = () => {
    if (selectedRole === "user") {
      navigate("/register");
    } else if (selectedRole === "seller") {
      navigate("/register-seller");
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5]/20 to-[#7C3AED]/5 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm shadow-lg rounded-lg lg:flex lg:gap-x-6 overflow-hidden">
        <div className="w-full lg:w-1/2 p-8 relative">
          <div className="absolute top-0 left-0 m-4 flex items-center">
            <img src="/logo.png" alt="PusatOlehOleh Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-lg font-bold">PusatOlehOleh</h1>
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-12">
            Masuk untuk eksplor oleh-oleh pilihan Nusantara!
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Belum punya akun?{" "}
            <button onClick={openModal} className="text-[#4F46E5] font-bold hover:text-[#4338CA]">
              Daftar sekarang!
            </button>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                placeholder="Masukkan email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                placeholder="Masukkan password"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="text-right">
              <button className="text-[#4F46E5] text-sm hover:text-[#4338CA]">
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Masuk
            </button>
          </form>

          {/* Divider */}
          <div className="mt-5 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-gray-500">atau</span>
            </div>
          </div>

          {/* Google Login Button */}
          <div className="mt-5 flex justify-center">
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
                text="signin_with"
                shape="rectangular"
                logo_alignment="left"
              />
            )}
          </div>

          <footer className="mt-8 text-center text-xs text-gray-500">
            <p> 2024 PusatOlehOleh. All Rights Reserved</p>
          </footer>
        </div>

        <div className="hidden lg:block lg:w-1/2">
          <img className="object-cover w-full h-full" src="/placeholder.png" alt="Placeholder" />
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Pilih Tipe Akun"
        className="modal bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg max-w-md w-80 mx-auto flex flex-col items-center justify-center"
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <h2 className="text-lg font-bold mb-4 text-center">Mau daftar sebagai apa?</h2>
        <div className="flex flex-col space-y-4 mb-6 w-full">
          <button
            onClick={() => setSelectedRole("user")}
            className={`px-4 py-3 rounded-lg transition-all duration-300 w-full ${
              selectedRole === "user"
                ? "bg-indigo-50 border-2 border-[#4F46E5] text-[#4F46E5] font-medium shadow-sm"
                : "bg-white/80 border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            Buyer
          </button>
          <button
            onClick={() => setSelectedRole("seller")}
            className={`px-4 py-3 rounded-lg transition-all duration-300 w-full ${
              selectedRole === "seller"
                ? "bg-indigo-50 border-2 border-[#4F46E5] text-[#4F46E5] font-medium shadow-sm"
                : "bg-white/80 border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            Seller
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-medium rounded-lg shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          Lanjut
        </button>
      </Modal>
    </div>
  );
}

export default AuthPage;
