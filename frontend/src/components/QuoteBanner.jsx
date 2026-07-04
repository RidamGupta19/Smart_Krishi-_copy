export default function QuoteBanner({ imageUrl, imagePosition = "center 25%" }) {
  return (
    <section className="relative rounded-2xl overflow-hidden h-[160px] sm:h-[200px] flex items-center justify-center text-center shadow-soft">
      <img
        src={imageUrl}
        alt="Smart Krishi Quote Banner"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: imagePosition }}
      />

      <div className="relative z-10 bg-cream-50/90 backdrop-blur-sm rounded-2xl px-6 py-4 mx-4 shadow-softmd">
        <p className="font-heading font-semibold text-lg sm:text-xl text-ink-900">
          "Apna Khet, Apna Vyapar, Apna Bhavishya"
        </p>
        <p className="text-amber-600 font-medium mt-1 font-body">
          Smart Krishi — Aapka Saathi, Hamesha!
        </p>
      </div>
    </section>
  );
}
