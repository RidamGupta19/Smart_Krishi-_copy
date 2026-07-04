import { Package, ShoppingCart, CloudSun, Sprout, TrendingUp } from "lucide-react";

// Pass the same numbers your app currently fetches from Spring Boot —
// this component only changes how they're displayed.
export default function StatsRow({
  totalOrders = 24,
  ordersDeltaPct = 12,
  cartItems = 3,
  weatherTempC = 28,
  weatherCity = "Bhopal, MP",
  activeListings = 35,
  onViewForecast = () => {},
}) {
  const stats = [
    {
      key: "orders",
      icon: Package,
      bg: "bg-mint-100",
      value: totalOrders,
      label: "Total Orders",
      sub: (
        <span className="inline-flex items-center gap-1 text-leaf-600 font-semibold">
          This Month <TrendingUp size={12} /> {ordersDeltaPct}%
        </span>
      ),
    },
    {
      key: "cart",
      icon: ShoppingCart,
      bg: "bg-peach-100",
      value: cartItems,
      label: "Cart Items",
      sub: "In Your Cart",
    },
    {
      key: "weather",
      icon: CloudSun,
      bg: "bg-sky-100",
      value: `${weatherTempC}°C`,
      label: "Weather",
      sub: weatherCity,
      action: { text: "Full forecast →", onClick: onViewForecast },
    },
    {
      key: "listings",
      icon: Sprout,
      bg: "bg-lilac-100",
      value: `${activeListings}+`,
      label: "Active Listings",
      sub: "Products",
    },
  ];

  return (
    <section
      aria-label="Key stats"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map(({ key, icon: Icon, bg, value, label, sub, action }) => (
        <div key={key} className={`rounded-2xl p-4 ${bg} flex items-start gap-3 shadow-soft`}>
          <span className="h-10 w-10 rounded-full bg-white/70 grid place-items-center shrink-0 shadow-sm">
            <Icon size={18} className="text-ink-900" />
          </span>
          <div className="min-w-0">
            <p className="font-heading font-bold text-2xl text-ink-900 leading-tight">{value}</p>
            <p className="text-sm font-medium text-ink-900 font-heading">{label}</p>
            <div className="text-xs text-ink-500 mt-0.5">{sub}</div>
            {action ? (
              <button
                onClick={action.onClick}
                className="text-xs font-semibold text-amber-600 mt-1 hover:text-amber-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded cursor-pointer block"
              >
                {action.text}
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </section>
  );
}
