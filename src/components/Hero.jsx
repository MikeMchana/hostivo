import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight } from "lucide-react";

function Hero() {
  return (
    <section
      className="relative min-h-screen overflow-hidden flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85')",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-[#102A43]/45"></div>

      {/* Dark gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-[#102A43]/80"></div>

      {/* Subtle gold glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C89B3C]/10 blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-32 text-center text-white">
        {/* Eyebrow */}
        <p
          data-aos="fade-up"
          className="mb-6 text-xs sm:text-sm md:text-base uppercase tracking-[0.4em] text-[#C89B3C] font-medium"
        >
          Welcome to Hostivo
        </p>

        {/* Main heading */}
        <h1
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.05] mb-7"
        >
          Stay.
          <span className="text-[#C89B3C]"> Dine.</span>
          <br />
          Experience.
        </h1>

        {/* Description */}
        <p
          data-aos="fade-up"
          data-aos-delay="200"
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white/85 leading-relaxed mb-10"
        >
          Discover exceptional rooms, memorable dining and genuine
          hospitality—all in one place.
        </p>

        {/* CTA buttons */}
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/booking"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C89B3C] hover:bg-[#d4aa50] text-[#102A43] px-8 py-4 rounded-full font-semibold shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1"
          >
            Book a Room
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/#restaurant"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/60 hover:border-white hover:bg-white hover:text-[#102A43] px-8 py-4 rounded-full font-semibold backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
          >
            Explore Restaurant
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-aos="fade-up"
        data-aos-delay="400"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">
          Explore
        </span>

        <ArrowDown
          size={18}
          className="animate-bounce text-[#C89B3C]"
        />
      </div>
    </section>
  );
}

export default Hero;