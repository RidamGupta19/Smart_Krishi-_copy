import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  ChevronDown,
  ArrowLeft
} from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Topbar({ toggleMobileSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Search parameters inside Topbar
  const [search, setSearch] = useState("");
  const searchRoutes = {
    machinery: "/machinery",
    "machinery rental": "/machinery-rental",
    "machinery rentals": "/machinery-rental",
    rental: "/machinery-rental",
    rentals: "/machinery-rental",
    rent: "/machinery-rental",
    weather: "/weather",
    crop: "/farming-crop",
    crops: "/farming-crop",
    fertilizer: "/fertilizers",
    fertilizers: "/fertilizers",
    land: "/landselling",
    milk: "/milk",
    water: "/water-supply",
    building: "/building-materials",
    materials: "/building-materials",
  };

  const performSearch = () => {
    const value = search.toLowerCase().trim();
    if (!value) {
      toast.error("Please enter a term to search");
      return;
    }
    const route = searchRoutes[value];
    if (route) {
      navigate(route);
    } else {
      toast.error(`No page found for "${value}". Try 'crops', 'machinery', or 'weather'.`);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const fetchInitialData = async () => {
      try {
        const countRes = await api.get(`/notifications/user/${user.id}/unread-count`);
        setUnreadCount(countRes.data?.data ?? 0);

        const listRes = await api.get(`/notifications/user/${user.id}?size=5`);
        setNotifications(listRes.data?.data?.content || []);
      } catch (err) {
        console.error("Error fetching notifications in topbar:", err);
      }
    };

    fetchInitialData();

    const token = localStorage.getItem("token");
    if (!token) return;

    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
    const wsProtocol = apiBase.startsWith("https") ? "wss" : "ws";
    const wsHost = apiBase.replace(/^https?:\/\//, "").replace(/\/api$/, "");
    const wsUrl = `${wsProtocol}://${wsHost}/ws/notifications?token=${token}`;

    let socket;
    let reconnectTimeout;

    const connectSocket = () => {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("Notifications WebSocket connected");
      };

      socket.onmessage = (event) => {
        try {
          const newNotif = JSON.parse(event.data);
          setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]);
          setUnreadCount((prev) => prev + 1);
          
          toast.success(
            <div className="flex flex-col gap-0.5 text-xs text-left font-body">
              <span className="font-bold text-amber-600">{newNotif.title}</span>
              <span className="text-ink-500">{newNotif.message}</span>
            </div>,
            { duration: 5000, position: "top-right" }
          );
        } catch (e) {
          console.error("Failed to parse WebSocket message", e);
        }
      };

      socket.onclose = () => {
        console.log("Notifications WebSocket closed, reconnecting in 5s...");
        reconnectTimeout = setTimeout(connectSocket, 5000);
      };

      socket.onerror = (err) => {
        console.error("Notifications WebSocket error:", err);
        socket.close();
      };
    };

    const reconnectDelay = setTimeout(connectSocket, 1000);

    return () => {
      clearTimeout(reconnectDelay);
      if (socket) socket.close();
      clearTimeout(reconnectTimeout);
    };
  }, [user]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await api.put(`/notifications/user/${user.id}/mark-all-read`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  };

  const handleMarkSingleRead = async (id, actionUrl) => {
    try {
      await api.put(`/notifications/${id}/mark-read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (actionUrl) {
        navigate(actionUrl);
      }
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setProfileOpen(false);
    navigate("/account/profile");
    window.location.reload();
  };

  if (isMobileSearchOpen) {
    return (
      <header className="h-20 border-b border-cream-200 bg-cream-50 sticky top-0 z-30 flex items-center justify-between px-4 shadow-soft animate-fadeIn font-body">
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 text-ink-500 hover:text-ink-900 hover:bg-cream-200/50 rounded-full transition cursor-pointer"
            aria-label="Close Search"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-grow relative">
            <Search className="absolute left-3.5 top-3.5 text-ink-500" size={16} />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  performSearch();
                  setIsMobileSearchOpen(false);
                }
              }}
              placeholder='Search crops, machinery, weather...'
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full text-sm text-ink-900 placeholder:text-ink-500 transition shadow-soft"
            />
          </div>
          <button
            onClick={() => {
              performSearch();
              setIsMobileSearchOpen(false);
            }}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-ink-900 text-xs font-bold rounded-full transition shadow-soft cursor-pointer"
          >
            Go
          </button>
        </div>
      </header>
    );
  }

  const userName = user?.firstName || "Farmer";

  return (
    <header className="h-20 border-b border-cream-200 bg-cream-50 sticky top-0 z-30 flex items-center justify-between px-6 shadow-soft font-body">
      {/* Left: Hamburger & Greetings */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 text-ink-500 hover:text-ink-900 hover:bg-cream-200/50 rounded-full lg:hidden transition cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="flex flex-col text-left">
          <p className="font-heading text-lg text-ink-900 whitespace-nowrap">
            Welcome back, <span className="text-amber-600 font-semibold">{userName}</span>! 👋
          </p>
        </div>
      </div>

      {/* Center: Search panel */}
      <div className="hidden lg:flex items-center gap-2 max-w-xl w-full px-4">
        <div className="flex-grow relative">
          <Search className="absolute left-3.5 top-3.5 text-ink-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder='Search products, services...'
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-full text-sm text-ink-900 placeholder:text-ink-500 transition shadow-soft"
          />
        </div>
      </div>

      {/* Right Area: Alerts & User Profile */}
      <div className="flex items-center gap-4">
        {/* Mobile Search Button */}
        <button
          onClick={() => setIsMobileSearchOpen(true)}
          className="p-2.5 text-ink-500 hover:text-ink-900 hover:bg-cream-200/50 rounded-full transition lg:hidden cursor-pointer"
          aria-label="Open Search Mode"
        >
          <Search size={18} />
        </button>

        {/* Notifications Icon */}
        <div className="relative flex items-center">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2.5 text-ink-500 hover:text-ink-900 hover:bg-cream-200/50 rounded-full transition relative cursor-pointer"
            aria-label="View Alerts Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-600" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute top-12 right-0 bg-white border border-cream-200 rounded-2xl shadow-softmd w-80 p-4 z-50 space-y-3 animate-fadeIn text-ink-900">
              <div className="flex justify-between items-center border-b border-cream-200 pb-2">
                <span className="font-heading font-bold text-xs flex items-center gap-1.5">
                  Recent Alerts
                  {unreadCount > 0 && (
                    <span className="bg-amber-600 text-ink-900 rounded-full text-[9px] px-1.5 py-0.5 font-bold">
                      {unreadCount}
                    </span>
                  )}
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-amber-600 font-bold hover:underline cursor-pointer bg-transparent border-0 outline-none"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2.5 divide-y divide-cream-200 max-h-64 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-ink-500 text-[11px] font-semibold">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((notif) => {
                    let typeColor = "text-leaf-600 bg-mint-100";
                    if (notif.notificationType?.includes("FAILURE") || notif.notificationType?.includes("CANCELLED")) {
                      typeColor = "text-red-700 bg-red-100";
                    } else if (notif.notificationType?.includes("SUCCESS") || notif.notificationType?.includes("DELIVERED")) {
                      typeColor = "text-leaf-605 bg-mint-100";
                    } else if (notif.notificationType?.includes("REFUND")) {
                      typeColor = "text-amber-600 bg-peach-100";
                    } else if (notif.notificationType?.includes("SHIPPED") || notif.notificationType?.includes("DELIVERY")) {
                      typeColor = "text-blue-700 bg-sky-100";
                    }
                    
                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          let path = null;
                          if (notif.relatedEntityType === "ORDER" && notif.relatedEntityId) {
                            path = `/orders/${notif.relatedEntityId}/track`;
                          }
                          handleMarkSingleRead(notif.id, path);
                          setNotificationsOpen(false);
                        }}
                        className={`pt-2.5 first:pt-0 group cursor-pointer transition-colors p-1.5 rounded-lg ${
                          !notif.isRead ? "bg-cream-100/30 hover:bg-cream-100/60" : "hover:bg-cream-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${typeColor}`}>
                            {notif.notificationType?.replace("_", " ") || "Alert"}
                          </span>
                          {!notif.isRead && (
                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span>
                          )}
                        </div>
                        <h4 className={`text-xs mt-1 font-heading font-bold ${!notif.isRead ? "text-ink-900" : "text-ink-500"}`}>
                          {notif.title}
                        </h4>
                        <p className="text-[11px] text-ink-500 mt-0.5 leading-normal">
                          {notif.message}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="border-t border-cream-200 pt-2 text-center">
                <Link
                  to="/account/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[10px] text-amber-600 hover:text-amber-700 font-bold hover:underline"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Account Trigger */}
        <div className="flex items-center gap-3">
          <img
            src={user?.profileImage || "https://placehold.co/40x40"}
            alt={`${userName} avatar`}
            className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-soft"
          />
          
          <div className="relative">
            <button
              onClick={() => user ? setProfileOpen(!profileOpen) : navigate("/account")}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-ink-900 text-xs font-bold px-4.5 py-2.5 rounded-full shadow-soft transition cursor-pointer"
            >
              <span>{user ? user.firstName : "Account Portal"}</span>
              <ChevronDown size={14} />
            </button>

            {user && profileOpen && (
              <div className="absolute right-0 top-12 bg-white border border-cream-200 rounded-2xl shadow-softmd w-48 py-2 z-50 animate-fadeIn text-xs text-ink-500 font-semibold">
                <Link
                  to="/account/profile"
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-cream-50 hover:text-ink-900 transition"
                  onClick={() => setProfileOpen(false)}
                >
                  <User size={14} /> My Profile
                </Link>
                <Link
                  to="/account/settings"
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-cream-50 hover:text-ink-900 transition"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings size={14} /> Settings
                </Link>
                <div className="border-t border-cream-200 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-600 hover:text-red-750 transition font-bold cursor-pointer"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
