export default function HeroBanner({ imageUrl, imagePosition = "center 15%" }) {
  return (
    <section className="relative rounded-3xl overflow-hidden shadow-softmd h-[220px] sm:h-[320px] lg:h-[360px]">
      <img
        src={imageUrl}
        alt="Jai Jawan Jai Kisan Hero"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: imagePosition }}
      />

      <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 max-w-sm bg-cream-50/95 backdrop-blur-sm rounded-2xl px-5 py-4 shadow-softmd">
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-ink-900 leading-tight">
          Jai Jawan, Jai Kisan
        </h1>
        <p className="mt-1 text-sm text-ink-900/80 font-medium font-body">
          Empowering Farmers, Building India's Future
        </p>
      </div>
    </section>
  );
}
