import { Milk, Wrench, Tractor, MapPin, Wheat, Settings2, Building2 } from "lucide-react";

// Wire `href`/`onClick` per card to the SAME routes the current
// "Marketplace Hubs" section already uses — only presentation changes.
const CATEGORIES = [
  { key: "milk", label: "Milk Marketplace", icon: Milk, bg: "bg-sky-100", path: "/milk" },
  { key: "fertilizers", label: "Fertilizers", icon: Wrench, bg: "bg-mint-100", path: "/fertilizers" },
  { key: "machinery", label: "Machinery", icon: Tractor, bg: "bg-peach-100", path: "/machinery" },
  { key: "land", label: "Land Listings", icon: MapPin, bg: "bg-lilac-100", path: "/landselling" },
  { key: "crops", label: "Crop Marketplace", icon: Wheat, bg: "bg-mint-100", path: "/farming-crop" },
  { key: "equipment", label: "Equipment", icon: Settings2, bg: "bg-sky-100", path: "/farming-equipment" },
  { key: "building", label: "Building Materials", icon: Building2, bg: "bg-peach-100", path: "/building-materials" },
];

export default function CategoryGrid({ onSelect = () => {} }) {
  return (
    <section
      aria-label="Marketplace categories"
      className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4"
    >
      {CATEGORIES.map(({ key, label, icon: Icon, bg, path }) => (
        <button
          key={key}
          onClick={() => onSelect(path)}
          className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 shadow-soft hover:shadow-softmd hover:-translate-y-0.5 transition motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
        >
          <span className={`h-14 w-14 rounded-full grid place-items-center ${bg}`}>
            <Icon size={24} className="text-ink-900" />
          </span>
          <span className="text-sm font-heading font-medium text-ink-900 text-center leading-tight">
            {label}
          </span>
        </button>
      ))}
    </section>
  );
}
