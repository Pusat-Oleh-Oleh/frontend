import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

/**
 * LocationSearch — Komponen autocomplete lokasi menggunakan RajaOngkir
 *
 * Props:
 *  - token (string): JWT token untuk otorisasi
 *  - value (object|null): lokasi yang sudah dipilih { label, destinationId, province, city, district, subdistrict, postalCode }
 *  - onChange (fn): dipanggil dengan objek lokasi saat user memilih
 *  - placeholder (string): placeholder input
 *  - disabled (boolean)
 *  - className (string): class tambahan untuk wrapper
 */
const LocationSearch = ({ token, value, onChange, placeholder = 'Cari kecamatan, kota, atau provinsi...', disabled = false, className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Saat value dari luar berubah (misal edit mode), tampilkan label
  useEffect(() => {
    if (value?.label) {
      setDisplayValue(value.label);
    } else if (value?.subdistrict && value?.city) {
      setDisplayValue(`${value.subdistrict}, ${value.district}, ${value.city}, ${value.province} ${value.postalCode || ''}`);
    } else {
      setDisplayValue('');
    }
  }, [value]);

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        // Kembalikan ke displayValue jika user tidak memilih
        if (!value) setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  const searchLocations = useCallback(async (keyword) => {
    if (!keyword || keyword.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${apiUrl}/courier/cities`, {
        headers,
        params: { search: keyword.trim() }
      });
      const destinations = res.data?.destinations || [];
      setResults(destinations);
      setIsOpen(destinations.length > 0);
    } catch (err) {
      console.error('[LocationSearch] Error:', err.message);
      setResults([]);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setDisplayValue(val);

    // Clear pilihan sebelumnya saat user mulai mengetik ulang
    if (onChange && value) {
      onChange(null);
    }

    // Debounce 350ms
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchLocations(val);
    }, 350);
  };

  const handleSelect = (dest) => {
    const selected = {
      destinationId: dest.id,
      label: dest.label,
      province: dest.province_name || '',
      city: dest.city_name || '',
      district: dest.district_name || '',
      subdistrict: dest.subdistrict_name || '',
      postalCode: dest.zip_code || '',
    };

    const shortLabel = [
      dest.subdistrict_name !== '-' ? dest.subdistrict_name : null,
      dest.district_name,
      dest.city_name,
      dest.province_name,
      dest.zip_code,
    ].filter(Boolean).join(', ');

    setDisplayValue(shortLabel);
    setQuery('');
    setIsOpen(false);

    if (onChange) onChange({ ...selected, label: shortLabel });
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setDisplayValue('');
    setQuery('');
    setResults([]);
    setIsOpen(false);
    if (onChange) onChange(null);
    inputRef.current?.focus();
  };

  const hasValue = !!value?.destinationId;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {loading ? (
            <svg className="animate-spin h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-${hasValue ? '8' : '4'} py-2.5 border rounded-lg text-sm transition-all duration-200 ${
            hasValue
              ? 'border-indigo-400 bg-indigo-50 focus:ring-2 focus:ring-indigo-300'
              : 'border-gray-300 bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />

        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-2 flex items-center px-1 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown hasil pencarian */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
          {results.map((dest) => {
            const parts = [
              dest.subdistrict_name !== '-' ? dest.subdistrict_name : null,
              dest.district_name,
              dest.city_name,
              dest.province_name,
            ].filter(Boolean);

            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => handleSelect(dest)}
                className="w-full px-4 py-2.5 text-left hover:bg-indigo-50 transition-colors border-b border-gray-50 last:border-b-0 group"
              >
                <div className="flex items-start gap-2">
                  <svg className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-indigo-700 truncate">
                      {parts.join(', ')}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Kode Pos: {dest.zip_code || '-'}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Tampilkan pesan jika tidak ada hasil */}
      {isOpen && results.length === 0 && !loading && displayValue.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-4 text-center text-sm text-gray-400">
          Lokasi tidak ditemukan. Coba kata kunci lain.
        </div>
      )}

      {/* Info lokasi yang dipilih */}
      {hasValue && (
        <div className="mt-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg">
          <div className="flex flex-wrap gap-1.5 text-xs text-indigo-600">
            <span className="bg-white px-2 py-0.5 rounded border border-indigo-200">{value.subdistrict || '-'}</span>
            <span className="text-indigo-300">›</span>
            <span className="bg-white px-2 py-0.5 rounded border border-indigo-200">{value.district || '-'}</span>
            <span className="text-indigo-300">›</span>
            <span className="bg-white px-2 py-0.5 rounded border border-indigo-200">{value.city || '-'}</span>
            <span className="text-indigo-300">›</span>
            <span className="bg-white px-2 py-0.5 rounded border border-indigo-200">{value.province || '-'}</span>
            <span className="ml-auto font-mono text-indigo-400">{value.postalCode || ''}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
