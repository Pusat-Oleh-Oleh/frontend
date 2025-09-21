# Pusat Oleh-Oleh Frontend

Frontend user-facing application untuk marketplace souvenir Pusat Oleh-Oleh. Menyediakan interface untuk buyer dan seller dalam berinteraksi dengan platform e-commerce.

## Teknologi yang Digunakan

- **Framework**: React 18 dengan Create React App
- **Styling**: Tailwind CSS
- **State Management**: React Context API + useState/useReducer
- **HTTP Client**: Axios
- **Authentication**: JWT dengan localStorage/sessionStorage
- **Charts**: Chart.js dengan react-chartjs-2
- **Icons**: React Icons / Lucide React
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM
- **Forms**: React Hook Form (jika digunakan)
- **Image Handling**: Progressive image loading
- **Payment**: Integration dengan payment gateway

## Struktur Folder

```
pusatoleholeh-frontend/
├── public/
│   ├── index.html             # HTML template
│   ├── manifest.json          # PWA manifest
│   └── favicon.ico            # Favicon
├── src/
│   ├── api/
│   │   ├── auth.js            # Authentication API
│   │   ├── products.js        # Products API
│   │   ├── shops.js           # Shops API
│   │   ├── cart.js            # Cart API
│   │   └── transactions.js    # Transactions API
│   ├── components/
│   │   ├── common/            # Reusable components
│   │   ├── layout/            # Layout components
│   │   ├── product/           # Product components
│   │   ├── shop/              # Shop components
│   │   ├── cart/              # Shopping cart components
│   │   └── user/              # User components
│   ├── contexts/              # React Context providers
│   │   ├── AuthContext.jsx    # Authentication context
│   │   ├── CartContext.jsx    # Shopping cart context
│   │   └── ThemeContext.jsx   # Theme context
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js         # Authentication hook
│   │   ├── useCart.js         # Cart management hook
│   │   ├── useProducts.js     # Products data hook
│   │   └── useLocalStorage.js # localStorage hook
│   ├── pages/                 # Page components
│   │   ├── auth/              # Authentication pages
│   │   ├── home/              # Home page
│   │   ├── products/          # Product pages
│   │   ├── shops/             # Shop pages
│   │   ├── cart/              # Cart & checkout
│   │   ├── user/              # User account pages
│   │   ├── seller/            # Seller dashboard
│   │   └── static/            # Static pages
│   ├── services/              # Business logic services
│   ├── utils/                 # Utility functions
│   ├── styles/                # Styling files
│   ├── App.jsx                # Main App component
│   ├── index.css              # Entry CSS file
│   └── index.js               # Entry point aplikasi
├── .env                       # Environment variables
├── package.json               # Dependencies dan scripts
├── tailwind.config.js         # Tailwind CSS configuration
└── README.md                  # Dokumentasi project
```

## Environment Variables

Buat file `.env` di root directory dengan konfigurasi berikut:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_CDN_URL=http://localhost:9000

# App Configuration
REACT_APP_NAME=Pusat Oleh-Oleh
REACT_APP_VERSION=1.0.0

# Payment Gateway (Optional)
REACT_APP_PAYMENT_PUBLIC_KEY=your_payment_public_key

# Google Services (Optional)
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Cara Menjalankan

### Prerequisites

- Node.js (v14 atau lebih baru)
- npm atau yarn
- Backend API server (pusatoleholeh-backend) harus running

### Instalasi

1. **Clone repository dan navigate ke folder frontend**
   ```bash
   cd customer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env sesuai konfigurasi backend Anda
   ```

### Menjalankan Aplikasi

**Development Mode:**
```bash
npm start
```

**Build untuk Production:**
```bash
npm run build
```

**Test Application:**
```bash
npm test
```

Aplikasi akan berjalan di `http://localhost:3000/`.

## Fitur Utama

### E-commerce Core
- **Product Catalog**: Browse produk dengan filter dan search
- **Product Detail**: Detail produk dengan gambar, deskripsi, dan review
- **Shopping Cart**: Add to cart, update quantity, checkout
- **Wishlist**: Save favorite products
- **Order Management**: Track order status dan history

### Shop Features
- **Shop Directory**: Browse semua toko
- **Shop Profile**: Detail toko dengan produk dan info
- **Seller Dashboard**: Interface untuk seller manage toko
- **Product Management**: Seller dapat manage produk mereka

### User Management
- **Authentication**: Register, login, logout
- **User Profile**: Manage personal information
- **Order History**: Track semua pesanan
- **Address Management**: Multiple shipping addresses
- **Payment Methods**: Manage payment options

### Search & Discovery
- **Advanced Search**: Filter by category, price, location
- **Product Recommendations**: Suggested products
- **Trending Products**: Popular items
- **Category Navigation**: Browse by categories

### Payment & Checkout
- **Secure Checkout**: Multi-step checkout process
- **Payment Integration**: Multiple payment methods
- **Order Confirmation**: Email confirmations
- **Invoice Generation**: Digital receipts

## UI/UX Features

- **Responsive Design**: Mobile-first responsive layout
- **Modern Interface**: Clean dan user-friendly design
- **Progressive Loading**: Lazy loading untuk performa optimal
- **Interactive Elements**: Smooth animations dan transitions
- **Accessibility**: WCAG compliant
- **PWA Features**: Offline support dan installable

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
