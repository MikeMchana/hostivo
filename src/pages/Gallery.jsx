import { useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const galleryItems = [
  {
    id: 1,
    category: "Rooms",
    title: "Deluxe Room",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    category: "Rooms",
    title: "Luxury Suite",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    category: "Restaurant",
    title: "Restaurant Interior",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    category: "Dining",
    title: "Fine Dining",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    category: "Dining",
    title: "Breakfast",
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    category: "Rooms",
    title: "Comfortable Bedroom",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 7,
    category: "Restaurant",
    title: "Dining Experience",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 8,
    category: "Experience",
    title: "Relaxing Atmosphere",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  },
];

const categories = [
  "All",
  "Rooms",
  "Restaurant",
  "Dining",
  "Experience",
];

function Gallery() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter(
          (item) => item.category === activeCategory
        );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#102A43] text-white pt-32 pb-24">
        {/* Decorative glow */}
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#C89B3C]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
            data-aos="fade-right"
            className="group inline-flex items-center gap-2 text-white/65 hover:text-white transition mb-10"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span className="text-sm font-medium">Back to Home</span>
          </button>

          <div className="max-w-3xl">
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="uppercase tracking-[0.3em] text-xs md:text-sm text-[#C89B3C] font-semibold mb-4"
            >
              Discover Hostivo
            </p>

            <h1
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Our Gallery
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="300"
              className="max-w-2xl text-white/70 text-base md:text-lg leading-relaxed"
            >
              Take a glimpse into the spaces, dining experiences and
              atmosphere that make Hostivo special.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative py-20 md:py-24 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-[#C89B3C]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#102A43]/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section intro */}
          <div
            data-aos="fade-up"
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <p className="uppercase tracking-[0.25em] text-xs font-semibold text-[#C89B3C] mb-3">
              Moments at Hostivo
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-[#102A43]">
              See the Experience
            </h2>

            <p className="text-slate-500 mt-4 leading-relaxed">
              Explore our rooms, dining spaces and the details designed
              to make every visit memorable.
            </p>
          </div>

          {/* Filters */}
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="flex flex-wrap justify-center gap-3 mb-14"
          >
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 md:px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-[#102A43] text-white shadow-lg shadow-[#102A43]/15"
                      : "bg-white text-[#102A43] border border-slate-200 hover:border-[#C89B3C] hover:text-[#102A43] hover:-translate-y-0.5"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setSelectedImage(item)}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group relative h-72 sm:h-80 md:h-96 overflow-hidden rounded-2xl bg-slate-200 text-left shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/90 via-[#102A43]/10 to-transparent opacity-80" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#102A43]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-[#C89B3C] text-xs uppercase tracking-[0.2em] font-bold mb-2">
                      {item.category}
                    </p>

                    <div className="flex items-end justify-between gap-4">
                      <h2 className="text-white text-xl md:text-2xl font-semibold">
                        {item.title}
                      </h2>

                      <span className="shrink-0 h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <ArrowRight size={18} />
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Empty state safeguard */}
          {filteredItems.length === 0 && (
            <div
              data-aos="fade-up"
              className="text-center py-16"
            >
              <p className="text-slate-500">
                No gallery items found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-6"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 md:top-7 md:right-7 h-11 w-11 flex items-center justify-center text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all duration-300 z-10"
            aria-label="Close image"
          >
            <X size={22} />
          </button>

          <div
            className="max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full max-h-[75vh] object-contain"
              />
            </div>

            <div className="text-center mt-5">
              <p className="text-[#C89B3C] uppercase tracking-[0.2em] text-xs font-bold">
                {selectedImage.category}
              </p>

              <h2 className="text-white text-2xl md:text-3xl font-semibold mt-2">
                {selectedImage.title}
              </h2>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Gallery;