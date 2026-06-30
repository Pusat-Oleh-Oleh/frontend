import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-[#1e1b4b] text-gray-300">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="Logo" className="w-10 h-10" />
              <span className="font-bold text-white text-lg">Pusat Oleh-Oleh</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Marketplace kerajinan tangan dan oleh-oleh khas daerah dari seluruh Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Menu</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[#a78bfa] text-sm transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/oleh-oleh" className="text-gray-400 hover:text-[#a78bfa] text-sm transition-colors">
                  Oleh-Oleh Khas
                </Link>
              </li>
              <li>
                <Link to="/kerajinan" className="text-gray-400 hover:text-[#a78bfa] text-sm transition-colors">
                  Kerajinan Tangan
                </Link>
              </li>
              <li>
                <Link to="/articlehomepage" className="text-gray-400 hover:text-[#a78bfa] text-sm transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Tentang</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[#a78bfa] text-sm transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[#a78bfa] text-sm transition-colors">
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link to="/register-seller" className="text-gray-400 hover:text-[#a78bfa] text-sm transition-colors">
                  Jadi Penjual
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4">Bantuan</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-[#a78bfa] text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/payment-info" className="text-gray-400 hover:text-[#a78bfa] text-sm transition-colors">
                  Pembayaran
                </Link>
              </li>
              <li>
                <Link to="/shipping-info" className="text-gray-400 hover:text-[#a78bfa] text-sm transition-colors">
                  Pengiriman
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-gray-500 text-xs">
            © 2024 Pusat Oleh-Oleh. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-3 sm:mt-0">
            <span className="text-gray-500 text-xs">Privacy Policy</span>
            <span className="text-gray-500 text-xs">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;