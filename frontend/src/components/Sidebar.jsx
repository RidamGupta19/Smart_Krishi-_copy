import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, ShoppingBasket, Package, ShoppingCart, Sprout, CloudSun,
  ShieldCheck, MapPin, Wrench, Tractor, Milk, Building2, Hammer,
  Bell, User, Settings, Headphones, UserCircle, CreditCard, HelpCircle,
  LifeBuoy, Mail, FileQuestion, Users, ShieldAlert, MessageSquare, BarChart4,
  PlusCircle, Layers, Boxes, FileCheck, IndianRupee, FileText, Heart, ChevronLeft, Menu, X, Wheat
} from "lucide-react";

export default function Sidebar({
  isOpen,
  toggleSidebar,
  isCollapsed,
  setCollapsed,
  sidebarWidth,
  setSidebarWidth,
  isResizing,
  setIsResizing
}) {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Esc key keyboard listener to close mobile menu
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, toggleSidebar]);

  const startResizing = (mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
    const startWidth = sidebarWidth;
    const startX = mouseDownEvent.clientX;

    const doDrag = (mouseMoveEvent) => {
      const newWidth = startWidth + (mouseMoveEvent.clientX - startX);
      if (newWidth >= 240 && newWidth <= 380) {
        setSidebarWidth(newWidth);
        localStorage.setItem("sidebar_width", newWidth);
      }
    };

    const stopDrag = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const handleResizeKeyDown = (e) => {
    let newWidth = sidebarWidth;
    if (e.key === "ArrowLeft") {
      newWidth = Math.max(240, sidebarWidth - 10);
    } else if (e.key === "ArrowRight") {
      newWidth = Math.min(380, sidebarWidth + 10);
    } else {
      return;
    }
    e.preventDefault();
    setSidebarWidth(newWidth);
    localStorage.setItem("sidebar_width", newWidth);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user in sidebar", e);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const isAdmin = user && (user.roles?.includes("ADMIN") || user.roles?.includes("ROLE_ADMIN") || user.roles?.includes("SUPER_ADMIN"));
  const isSeller = user && (user.roles?.includes("SELLER") || user.roles?.includes("ROLE_SELLER"));

  const navItems = [];
  const footerItems = [];

  if (isAdmin) {
    navItems.push(
      { label: "Admin Dashboard", path: "/admin/dashboard", icon: Home },
      { label: "User Management", path: "/admin/users", icon: Users },
      { label: "Seller Verification", path: "/admin/verification", icon: ShieldCheck },
      { label: "Product Moderation", path: "/admin/moderation", icon: Sprout },
      { label: "Revenue Analytics", path: "/admin/revenue", icon: IndianRupee },
      { label: "Platform Analytics", path: "/admin/platform-analytics", icon: BarChart4 },
      { label: "Order Management", path: "/admin/orders", icon: FileText },
      { label: "Fraud Monitoring", path: "/admin/fraud", icon: ShieldAlert },
      { label: "System Settings", path: "/admin/settings", icon: Settings },
      { label: "User Feedback", path: "/admin/feedback", icon: MessageSquare }
    );
  } else {
    // Standard / Seller View
    navItems.push(
      { label: "Home", path: "/", icon: Home },
      { label: "Dashboard", path: "/dashboard", icon: BarChart4 },
      { label: "Weather Forecast", path: "/weather", icon: CloudSun },
      { label: "Farmer Advisories", path: "/weather/advisories", icon: ShieldAlert },
      { label: "Crops Marketplace", path: "/farming-crop", icon: Wheat },
      { label: "Milk Marketplace", path: "/milk", icon: Milk },
      { label: "Fertilizer Marketplace", path: "/fertilizers", icon: Boxes },
      { label: "Machinery Marketplace", path: "/machinery", icon: Tractor },
      { label: "Machinery Rentals", path: "/machinery-rental", icon: Tractor },
      { label: "Building Materials", path: "/building-materials", icon: Hammer },
      { label: "Land Marketplace", path: "/landselling", icon: MapPin },
      { label: "My Cart", path: "/cart", icon: ShoppingCart },
      { label: "My Orders", path: "/account/orders", icon: FileText },
      { label: "Wishlist", path: "/account/wishlist", icon: Heart },
      { label: "Nearby Listings", path: "/nearby-products", icon: MapPin }
    );

    if (isSeller) {
      navItems.push(
        { label: "My Shop", path: "/account/seller-application/shop", icon: Building2 },
        { label: "Add Product", path: "/account/seller-application/add-product", icon: PlusCircle },
        { label: "My Listings", path: "/account/seller-application/listings", icon: Layers },
        { label: "Inventory", path: "/account/seller-application/inventory", icon: Boxes },
        { label: "Orders Received", path: "/account/seller-application/orders", icon: FileCheck },
        { label: "Earnings", path: "/account/seller-application/earnings", icon: IndianRupee },
        { label: "Analytics", path: "/account/seller-application/analytics", icon: BarChart4 },
        { label: "Shop Location Setup", path: "/seller/location-setup", icon: MapPin }
      );
    }
  }

  // Footer items
  footerItems.push(
    { label: "Notifications", path: "/account/notifications", icon: Bell, badge: 5 },
    { label: "My Profile", path: "/account/profile", icon: User },
    { label: "Settings", path: "/account/settings", icon: Settings },
    { label: "Help & Support", path: "/support/help", icon: HelpCircle }
  );

  const renderItem = (item) => {
    const Icon = item.icon;
    const active = location.pathname === item.path;

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
          active
            ? "bg-amber-500 text-ink-900 shadow-soft"
            : "text-ink-500 hover:bg-cream-200/70 hover:text-ink-900"
        }`}
        onClick={() => isOpen && toggleSidebar()}
        title={isCollapsed && !isOpen ? item.label : ""}
        aria-label={item.label}
      >
        <div className="relative shrink-0 flex items-center justify-center">
          <Icon size={18} strokeWidth={2} />
          {item.badge && (isCollapsed && !isOpen) && (
            <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-leaf-600 border border-cream-100 flex items-center justify-center text-[8px] font-bold text-white">
              {item.badge}
            </span>
          )}
        </div>
        
        {(!isCollapsed || isOpen) && (
          <span className="flex-1 text-left font-heading text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {item.label}
          </span>
        )}

        {item.badge && (!isCollapsed || isOpen) && (
          <span className="grid place-items-center h-5 w-5 rounded-full bg-leaf-600 text-white text-[11px] font-semibold">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Sidebar overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Sidebar Wrapper */}
      <aside
        role={isOpen ? "dialog" : "navigation"}
        aria-modal={isOpen ? "true" : undefined}
        aria-label={isOpen ? "Sidebar Navigation Drawer" : "Sidebar Navigation"}
        style={{
          width: isOpen ? "288px" : (isCollapsed ? "80px" : `${sidebarWidth}px`)
        }}
        className={`fixed top-0 bottom-0 left-0 bg-cream-100 border-r border-cream-200 text-ink-900 flex flex-col z-50 shadow-soft ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isResizing ? "" : "transition-[width,transform] duration-300"}`}
      >
        {/* Resize Handle for Desktop */}
        {!isCollapsed && (
          <div
            onMouseDown={startResizing}
            onKeyDown={handleResizeKeyDown}
            tabIndex={0}
            role="separator"
            aria-valuenow={sidebarWidth}
            aria-valuemin={240}
            aria-valuemax={380}
            aria-label="Sidebar resize handle"
            className="hidden lg:block absolute top-0 right-0 bottom-0 w-2 cursor-col-resize hover:bg-amber-500/50 active:bg-amber-600 focus-visible:bg-amber-500/70 focus-visible:outline-none transition-colors z-50 border-r border-cream-200"
          />
        )}

        {/* Brand logo header */}
        <div 
          className={`h-16 flex items-center justify-between border-b border-cream-200 ${isCollapsed ? "px-4 justify-center" : "px-6"}`}
          onClick={() => isCollapsed && setCollapsed(false)}
          style={{ cursor: isCollapsed ? "pointer" : "default" }}
        >
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-white grid place-items-center shadow-soft flex-shrink-0">
              <Sprout className="text-leaf-600" size={18} />
            </div>
            {(!isCollapsed || isOpen) && (
              <div className="flex flex-col">
                <span className="font-heading font-bold text-sm tracking-wider text-ink-900 leading-tight">
                  Smart Krishi
                </span>
                <span className="text-[9px] text-leaf-600 leading-tight font-semibold">
                  समृद्ध किसान, समृद्ध देश
                </span>
              </div>
            )}
          </Link>

          {/* Desktop header toggle button */}
          {(!isCollapsed || isOpen) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(true);
              }}
              className="hidden lg:flex w-8 h-8 bg-cream-200/50 hover:bg-cream-200 text-ink-900 rounded-full items-center justify-center cursor-pointer transition shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <Menu size={16} aria-hidden="true" />
            </button>
          )}

          <button
            className="lg:hidden text-ink-500 hover:text-ink-900 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            onClick={toggleSidebar}
            aria-label="Close Sidebar Drawer"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable list items navigation content */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-cream-200">
          {navItems.map((item) => renderItem(item))}
        </nav>

        {/* Sidebar Settings Collapse Toggle at bottom */}
        <div className="p-4 border-t border-cream-200 space-y-2 mt-auto">
          <div className="flex flex-col gap-1.5">
            {footerItems.map((item) => renderItem(item))}
          </div>

          <div className="pt-2 border-t border-cream-200/60">
            {(!isCollapsed || isOpen) && (
              <span className="text-[9px] uppercase tracking-widest text-ink-500 font-bold block px-2 mb-1" aria-hidden="true">
                Sidebar Settings
              </span>
            )}
            <button
              onClick={() => setCollapsed(!isCollapsed)}
              className={`w-full flex items-center justify-between p-2.5 hover:bg-cream-200/50 rounded-xl transition text-left text-ink-500 hover:text-ink-900 font-bold text-xs outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isCollapsed ? "justify-center" : "px-2"
              } cursor-pointer`}
              aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              aria-expanded={!isCollapsed}
            >
              <div className="flex items-center gap-3">
                <Menu size={16} aria-hidden="true" />
                {(!isCollapsed || isOpen) && <span>Collapse Sidebar</span>}
              </div>
              {(!isCollapsed || isOpen) && (
                <div className="p-1 bg-cream-200/30 rounded-lg text-ink-500 hover:bg-cream-200/60 transition" aria-hidden="true">
                  <ChevronLeft size={14} className={`transform transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}