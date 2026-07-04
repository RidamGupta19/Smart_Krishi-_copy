import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { formatPrice } from "../services/api";
import {
  Tractor,
  CloudSun,
  Wheat,
  IndianRupee,
  Users,
  ShoppingCart,
  Bell,
  TrendingUp,
  MapPin,
  CloudRain,
  Wind,
  ArrowRight,
  ChevronRight,
  Boxes,
  FileCheck,
  PlusCircle,
  Layers,
  Store,
  FileText
} from "lucide-react";

import HeroBanner from "../components/HeroBanner";
import CategoryGrid from "../components/CategoryGrid";
import StatsRow from "../components/StatsRow";
import QuoteBanner from "../components/QuoteBanner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sellerStats, setSellerStats] = useState(null);
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
  }, []);

  const isAdmin = user && (user.roles?.includes("ADMIN") || user.roles?.includes("ROLE_ADMIN") || user.roles?.includes("SUPER_ADMIN"));
  const isSeller = user && (user.roles?.includes("SELLER") || user.roles?.includes("ROLE_SELLER"));

  // Fetch Seller stats if role matches
  useEffect(() => {
    if (isSeller && user?.id) {
      const fetchSellerDashboard = async () => {
        setLoading(true);
        try {
          const profileRes = await api.get(`/sellers/user/${user.id}`);
          const profile = profileRes.data?.data || profileRes.data;
          if (profile?.id) {
            const statsRes = await api.get(`/sellers/${profile.id}/dashboard-stats`);
            setSellerStats(statsRes.data?.data || statsRes.data);
          }
        } catch (err) {
          console.error("Failed to fetch merchant stats", err);
        } finally {
          setLoading(false);
        }
      };
      fetchSellerDashboard();
    }
  }, [isSeller, user?.id]);

  // Fetch Buyer orders if role is Buyer
  useEffect(() => {
    if (user?.id && !isSeller && !isAdmin) {
      const fetchBuyerDashboard = async () => {
        try {
          const res = await api.get(`/orders/buyer/${user.id}`);
          const content = res.data?.content || res.data?.data?.content || res.data?.data || [];
          setBuyerOrders(Array.isArray(content) ? content.slice(0, 3) : []);
        } catch (err) {
          console.error("Failed to fetch buyer orders", err);
        }
      };
      fetchBuyerDashboard();
    }
  }, [user?.id, isSeller, isAdmin]);

  // Fetch Buyer cart items count
  useEffect(() => {
    if (user?.id && !isSeller && !isAdmin) {
      const fetchCartCount = async () => {
        try {
          const res = await api.get(`/cart/${user.id}`);
          const cartData = res.data?.data || res.data;
          setCartItemsCount(cartData?.totalItems || 0);
        } catch (err) {
          console.error("Failed to fetch cart count in dashboard", err);
        }
      };
      fetchCartCount();
    }
  }, [user?.id, isSeller, isAdmin]);

  // Loader state
  if (loading && isSeller) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-body bg-cream-50">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-ink-900 font-bold text-sm">Synchronizing dashboard intelligence...</p>
      </div>
    );
  }

  // ==========================================
  // RENDER 1: ADMIN CONSOLE DASHBOARD
  // ==========================================
  if (isAdmin) {
    const stats = [
      {
        title: "Total Revenue",
        value: "₹ 2,45,000",
        change: "+14.8% vs last month",
        icon: IndianRupee,
        color: "border-cream-200 bg-cream-100 text-ink-900"
      },
      {
        title: "Machinery Bookings",
        value: "125 Rentals",
        change: "+8.2% vs last month",
        icon: Tractor,
        color: "border-cream-200 bg-cream-100 text-ink-900"
      },
      {
        title: "Active Crop Orders",
        value: "340 Orders",
        change: "+22.1% vs last month",
        icon: Wheat,
        color: "border-cream-200 bg-cream-100 text-ink-900"
      },
      {
        title: "Connected Farmers",
        value: "1,250 Farmers",
        change: "+5.4% new registrations",
        icon: Users,
        color: "border-cream-200 bg-cream-100 text-ink-900"
      }
    ];

    const activities = [
      { text: "New John Deere tractor booking received", time: "2 mins ago", category: "Rentals" },
      { text: "Basmati Wheat order delivered successfully", time: "1 hour ago", category: "Crops" },
      { text: "Sowing advisory warning issued: Heavy monsoon surge", time: "3 hours ago", category: "Weather" },
      { text: "Farmer 'Kishan Prasad' registered shop listing", time: "5 hours ago", category: "Market" }
    ];

    return (
      <div className="space-y-8 animate-fadeIn pb-16 font-body p-6 text-ink-900">
        {/* Header and Welcome */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-ink-900">Workspace Dashboard</h1>
            <p className="text-sm text-ink-500 font-semibold mt-1">
              Welcome back, System Administrator &bull; Manage Smart Krishi operations
            </p>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`border rounded-2xl p-6 bg-white shadow-soft flex flex-col justify-between gap-4 hover:shadow-softmd transition-all ${item.color}`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-500">
                    {item.title}
                  </span>
                  <div className="p-2.5 bg-white rounded-xl shadow-soft border border-cream-200">
                    <Icon size={20} className="text-ink-900" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-heading font-bold tracking-tight text-ink-900">{item.value}</h2>
                  <span className="text-[10px] font-bold uppercase text-leaf-600 block">
                    {item.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Charts Section (Lightweight SVG) */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Revenue Analytics Line Chart Card */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-cream-200">
              <div>
                <h3 className="text-lg font-heading font-bold text-ink-900">Revenue Trend Analytics</h3>
                <p className="text-xs text-ink-500 font-bold">Monthly volume metrics (in Thousands ₹)</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-leaf-600">
                <TrendingUp size={14} /> +12.4%
              </span>
            </div>

            <div className="relative pt-4">
              <svg className="w-full h-56" viewBox="0 0 500 215" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="40" y1="30" x2="480" y2="30" stroke="#fdf8ed" strokeWidth="1.5" />
                <line x1="40" y1="80" x2="480" y2="80" stroke="#fdf8ed" strokeWidth="1.5" />
                <line x1="40" y1="130" x2="480" y2="130" stroke="#fdf8ed" strokeWidth="1.5" />
                <line x1="40" y1="180" x2="480" y2="180" stroke="#fbefd9" strokeWidth="1.5" />
                <path
                  d="M 40 160 L 110 130 L 180 140 L 250 80 L 320 100 L 390 60 L 480 40 L 480 180 L 40 180 Z"
                  fill="url(#chart-grad)"
                />
                <path
                  d="M 40 160 L 110 130 L 180 140 L 250 80 L 320 100 L 390 60 L 480 40"
                  fill="none"
                  stroke="#2E7D32"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="40" cy="160" r="5" fill="#FFFFFF" stroke="#2E7D32" strokeWidth="3" />
                <circle cx="110" cy="130" r="5" fill="#FFFFFF" stroke="#2E7D32" strokeWidth="3" />
                <circle cx="180" cy="140" r="5" fill="#FFFFFF" stroke="#2E7D32" strokeWidth="3" />
                <circle cx="250" cy="80" r="5" fill="#FFFFFF" stroke="#2E7D32" strokeWidth="3" />
                <circle cx="320" cy="100" r="5" fill="#FFFFFF" stroke="#2E7D32" strokeWidth="3" />
                <circle cx="390" cy="60" r="5" fill="#FFFFFF" stroke="#2E7D32" strokeWidth="3" />
                <circle cx="480" cy="40" r="5" fill="#FFFFFF" stroke="#2E7D32" strokeWidth="3" />
                
                <text x="40" y="205" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">JAN</text>
                <text x="110" y="205" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">FEB</text>
                <text x="180" y="205" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">MAR</text>
                <text x="250" y="205" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">APR</text>
                <text x="320" y="205" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">MAY</text>
                <text x="390" y="205" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">JUN</text>
                <text x="480" y="205" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">JUL</text>
              </svg>
            </div>
          </div>

          {/* Category Share Bar Chart Card */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-cream-200">
              <div>
                <h3 className="text-lg font-heading font-bold text-ink-900">Marketplace Distribution</h3>
                <p className="text-xs text-ink-500 font-bold">Volume shares by category department</p>
              </div>
              <span className="text-xs text-ink-500 font-bold">Year 2026</span>
            </div>

            <div className="relative pt-6">
              <svg className="w-full h-56" viewBox="0 0 500 215" preserveAspectRatio="none">
                <line x1="40" y1="40" x2="480" y2="40" stroke="#fdf8ed" strokeWidth="1.5" />
                <line x1="40" y1="100" x2="480" y2="100" stroke="#fdf8ed" strokeWidth="1.5" />
                <line x1="40" y1="160" x2="480" y2="160" stroke="#fbefd9" strokeWidth="1.5" />
                <rect x="70" y="40" width="36" height="120" rx="6" fill="#2E7D32" />
                <rect x="150" y="90" width="36" height="70" rx="6" fill="#0284C7" />
                <rect x="230" y="60" width="36" height="100" rx="6" fill="#F0A63A" />
                <rect x="310" y="50" width="36" height="110" rx="6" fill="#8B5A2B" />
                <rect x="390" y="110" width="36" height="50" rx="6" fill="#2E7D32" />
                
                <text x="88" y="195" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">Crops</text>
                <text x="168" y="195" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">Milk</text>
                <text x="248" y="195" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">Machinery</text>
                <text x="328" y="195" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">Fertilizer</text>
                <text x="408" y="195" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">Land</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Weather advisory and recent activities */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Weather Advisory */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-6 flex flex-col justify-between">
            <div className="flex justify-between items-center pb-2 border-b border-cream-200">
              <h3 className="text-lg font-heading font-bold text-ink-900">Agronomic Weather</h3>
              <CloudSun className="text-amber-500 animate-bounce" size={24} />
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-heading font-bold text-ink-900 tracking-tight">32°C</span>
                <span className="text-xs text-ink-500 font-bold block">Partly Sunny &bull; Bhopal</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-cream-50 rounded-xl border border-cream-200 flex items-center gap-2">
                  <CloudRain className="text-blue-500" size={16} />
                  <div>
                    <span className="text-[10px] text-ink-500 block font-bold">HUMIDITY</span>
                    <strong className="text-sm font-bold text-ink-900">65%</strong>
                  </div>
                </div>
                <div className="p-3.5 bg-cream-50 rounded-xl border border-cream-200 flex items-center gap-2">
                  <Wind className="text-leaf-600" size={16} />
                  <div>
                    <span className="text-[10px] text-ink-500 block font-bold">WIND</span>
                    <strong className="text-sm font-bold text-ink-900">12 km/h</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-mint-100 text-leaf-600 border border-cream-200 p-4 rounded-xl text-xs font-semibold leading-relaxed">
              🌿 <strong>Soil Advisory</strong>: Good seed-drilling soil profile moisture detected in central districts. Apply nitrogen dressing only after Friday rain surge.
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-4 lg:col-span-2">
            <div className="flex justify-between items-center pb-2 border-b border-cream-200">
              <h3 className="text-lg font-heading font-bold text-ink-900">Operations Log</h3>
              <span className="text-xs bg-cream-100 px-3 py-1 rounded-full font-bold text-ink-500">Live Stream</span>
            </div>
            <div className="space-y-3.5">
              {activities.map((act, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-cream-50 rounded-xl border border-cream-200 hover:bg-cream-100/50 transition duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-leaf-600 rounded-full shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{act.text}</p>
                      <span className="text-[10px] text-ink-500 font-bold uppercase tracking-wider">{act.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-ink-500 font-bold shrink-0 pl-2">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 2: SELLER DASHBOARD VIEW
  // ==========================================
  if (isSeller) {
    const stats = [
      {
        title: "Store Earnings",
        value: formatPrice(sellerStats?.totalRevenue || 0),
        change: "Total sales generated",
        icon: IndianRupee,
        color: "border-cream-200 bg-cream-100 text-ink-900"
      },
      {
        title: "Active Listings",
        value: `${sellerStats?.totalProducts || 0} items`,
        change: "In catalog",
        icon: Boxes,
        color: "border-cream-200 bg-cream-100 text-ink-900"
      },
      {
        title: "Orders Received",
        value: `${sellerStats?.totalOrders || 0} orders`,
        change: `${sellerStats?.pendingOrdersCount || 0} awaiting dispatch`,
        icon: FileCheck,
        color: "border-cream-200 bg-cream-100 text-ink-900"
      },
      {
        title: "Successful Delivery Rate",
        value: "98.5%",
        change: "Platform benchmark standard",
        icon: Users,
        color: "border-cream-200 bg-cream-100 text-ink-900"
      }
    ];

    return (
      <div className="space-y-8 animate-fadeIn pb-16 font-body p-6 text-ink-900">
        {/* Header and Welcome */}
        <div className="flex justify-between items-center border-b border-cream-200 pb-5">
          <div>
            <h1 className="text-3xl font-heading font-bold text-ink-900">Merchant Center Dashboard</h1>
            <p className="text-sm text-ink-500 font-semibold mt-1">
              Store Owner Workspace &bull; Empowering Indian Agriculture Marketplace
            </p>
          </div>
          <Link
            to="/seller/shop"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-ink-900 font-bold px-5 py-3 rounded-2xl shadow-soft transition"
          >
            <Store size={18} /> View My Shop
          </Link>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`border rounded-2xl p-6 bg-white shadow-soft flex flex-col justify-between gap-4 hover:shadow-softmd transition-all ${item.color}`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-500">
                    {item.title}
                  </span>
                  <div className="p-2.5 bg-white rounded-xl shadow-soft border border-cream-200">
                    <Icon size={20} className="text-ink-900" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h2 className="text-3xl font-heading font-bold tracking-tight text-ink-900">{item.value}</h2>
                  <span className="text-[10px] font-bold text-leaf-600 block">
                    {item.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Middle Section: Quick Actions & Sales Trends */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sales Chart (Lightweight SVG) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-4">
            <h3 className="text-lg font-heading font-bold text-ink-900">Annual Shop Earnings Trend</h3>
            <p className="text-xs text-ink-500 font-bold">Monthly revenue projections (₹ in thousands)</p>

            <div className="relative pt-6">
              <svg className="w-full h-56" viewBox="0 0 500 215" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="seller-chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F0A63A" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#F0A63A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="40" y1="40" x2="480" y2="40" stroke="#fdf8ed" strokeWidth="1.5" />
                <line x1="40" y1="100" x2="480" y2="100" stroke="#fdf8ed" strokeWidth="1.5" />
                <line x1="40" y1="160" x2="480" y2="160" stroke="#fbefd9" strokeWidth="1.5" />
                
                {/* SVG Path representing monthly values */}
                <path
                  d="M 40 160 Q 150 120 250 80 T 480 30 L 480 160 Z"
                  fill="url(#seller-chart-grad)"
                />
                <path
                  d="M 40 160 Q 150 120 250 80 T 480 30"
                  fill="none"
                  stroke="#F0A63A"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="250" cy="80" r="6" fill="#ffffff" stroke="#F0A63A" strokeWidth="3.5" />
                <circle cx="480" cy="30" r="6" fill="#ffffff" stroke="#F0A63A" strokeWidth="3.5" />
                
                <text x="60" y="195" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">JAN-MAR</text>
                <text x="190" y="195" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">APR-JUN</text>
                <text x="320" y="195" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">JUL-SEP</text>
                <text x="450" y="195" textAnchor="middle" fill="#7a6e58" fontSize="10" fontWeight="800">OCT-DEC</text>
              </svg>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-4 flex flex-col justify-between">
            <h3 className="text-lg font-heading font-bold text-ink-900 pb-2 border-b border-cream-200">Merchant Tools</h3>
            
            <div className="space-y-3">
              <Link
                to="/seller/add-product"
                className="flex items-center justify-between p-4 bg-cream-50 hover:bg-cream-100 text-ink-900 rounded-2xl border border-cream-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <PlusCircle size={20} className="text-amber-500" />
                  <span className="font-bold text-sm">Add New Product</span>
                </div>
                <ChevronRight size={16} className="text-ink-500 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                to="/seller/listings"
                className="flex items-center justify-between p-4 bg-cream-50 hover:bg-cream-100 text-ink-900 rounded-2xl border border-cream-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <Layers size={20} className="text-amber-500" />
                  <span className="font-bold text-sm">My Store Listings</span>
                </div>
                <ChevronRight size={16} className="text-ink-500 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                to="/seller/inventory"
                className="flex items-center justify-between p-4 bg-cream-50 hover:bg-cream-100 text-ink-900 rounded-2xl border border-cream-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <Boxes size={20} className="text-amber-500" />
                  <span className="font-bold text-sm">Stock & Inventory</span>
                </div>
                <ChevronRight size={16} className="text-ink-500 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                to="/seller/orders"
                className="flex items-center justify-between p-4 bg-cream-50 hover:bg-cream-100 text-ink-900 rounded-2xl border border-cream-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <FileCheck size={20} className="text-amber-500" />
                  <span className="font-bold text-sm">Orders Received</span>
                </div>
                <ChevronRight size={16} className="text-ink-500 group-hover:translate-x-1 transition" />
              </Link>
            </div>
            
            <div className="bg-peach-100 text-ink-900 border border-cream-200 p-4.5 rounded-xl text-xs font-semibold leading-relaxed">
              🔔 <strong>Merchant Notice</strong>: Order fulfillment shipping timelines must comply with the 24-hour dispatch rule. Prompt updates build high farmer-rating indexes.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 3: BUYER / STANDARD DASHBOARD VIEW
  // ==========================================
  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-body p-4 sm:p-6 text-ink-900">
      <HeroBanner
        imageUrl="/jai_jawan_kisan_hero.png"
        imagePosition="center 15%"
      />

      <CategoryGrid onSelect={(path) => navigate(path)} />

      <StatsRow
        totalOrders={buyerOrders.length}
        ordersDeltaPct={12}
        cartItems={cartItemsCount}
        weatherTempC={32}
        weatherCity="Bhopal, MP"
        activeListings={35}
        onViewForecast={() => navigate("/weather")}
      />

      <QuoteBanner
        imageUrl="/bottom_quote_banner.png"
        imagePosition="center 25%"
      />

      {/* Recent Orders Log for Buyer */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-soft space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-cream-200">
          <h3 className="text-lg font-heading font-bold text-ink-900">My Active Orders</h3>
          <Link to="/account/orders" className="text-xs text-amber-600 hover:text-amber-700 font-bold hover:underline">
            All Order History &rarr;
          </Link>
        </div>

        {buyerOrders.length === 0 ? (
          <div className="text-center py-8 bg-cream-50 rounded-2xl border border-dashed border-cream-200">
            <p className="text-xs text-ink-500 font-bold">No active orders placed recently.</p>
            <Link to="/farming-crop" className="mt-2 text-xs text-amber-600 hover:text-amber-700 font-bold inline-block hover:underline">
              Browse Crops Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {buyerOrders.map((ord) => (
              <div
                key={ord.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-cream-50 rounded-xl border border-cream-200 gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink-900">{ord.orderNumber}</span>
                    <span className="text-[10px] bg-mint-100 text-leaf-600 px-2 py-0.5 rounded font-bold uppercase">
                      {ord.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-ink-500 font-semibold">Shipping Address: {ord.shippingAddress}</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between shrink-0">
                  <strong className="text-sm text-leaf-600 font-bold">{formatPrice(ord.totalAmount)}</strong>
                  <Link
                    to={`/orders/${ord.id}/track`}
                    className="bg-white hover:bg-cream-50 border border-cream-200 text-ink-900 font-bold text-xs px-4 py-2 rounded-xl shadow-soft transition cursor-pointer"
                  >
                    Track Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}