import { useNavigate } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3, Utensils } from "lucide-react";

function Restaurant() {
  const navigate = useNavigate();

  return (
    <section
      id="restaurant"
      className="relative overflow-hidden bg-white py-24 md:py-28"
    >
      {/* Decorative background */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#C89B3C]/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Image */}
          <div
            data-aos="fade-right"
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85"
                alt="Hostivo restaurant"
                className="w-full h-[420px] sm:h-[500px] lg:h-[560px] object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/35 via-transparent to-transparent" />
            </div>

            {/* Opening hours card */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="absolute -bottom-7 left-5 md:left-8 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 md:p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#C89B3C]/10 flex items-center justify-center">
                  <Clock3 size={19} className="text-[#C89B3C]" />
                </div>

                <p className="text-sm text-slate-500">
                  Open Daily
                </p>
              </div>

              <p className="text-lg md:text-xl font-semibold text-[#102A43]">
                7:00 AM — 11:00 PM
              </p>
            </div>
          </div>

          {/* Content */}
          <div
            data-aos="fade-left"
            data-aos-delay="100"
            className="pt-4 lg:pt-0"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#C89B3C]" />

              <p className="uppercase tracking-[0.3em] text-xs sm:text-sm text-[#C89B3C] font-semibold">
                Dine at Hostivo
              </p>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#102A43] leading-[1.08] mb-7">
              Good Food.
              <br />
              <span className="text-[#C89B3C]">Memorable Moments.</span>
            </h2>

            {/* Description */}
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-5">
              Experience carefully prepared dishes made with fresh
              ingredients and served in a welcoming atmosphere.
            </p>

            <p className="text-slate-600 leading-relaxed mb-8">
              Whether you're enjoying breakfast with family, having lunch
              with colleagues or ending your evening with dinner, our
              restaurant is designed to make every meal special.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6 mb-9">
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="flex items-start gap-3"
              >
                <div className="w-11 h-11 shrink-0 rounded-full bg-[#C89B3C]/10 flex items-center justify-center">
                  <Utensils size={19} className="text-[#C89B3C]" />
                </div>

                <div>
                  <h3 className="font-semibold text-[#102A43]">
                    Fresh Cuisine
                  </h3>

                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    Freshly prepared meals
                  </p>
                </div>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="flex items-start gap-3"
              >
                <div className="w-11 h-11 shrink-0 rounded-full bg-[#C89B3C]/10 flex items-center justify-center">
                  <CalendarDays size={19} className="text-[#C89B3C]" />
                </div>

                <div>
                  <h3 className="font-semibold text-[#102A43]">
                    All Day Dining
                  </h3>

                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    Breakfast to dinner
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                type="button"
                onClick={() => navigate("/menu")}
                className="group inline-flex items-center justify-center gap-2 bg-[#102A43] text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#183b5c] hover:-translate-y-0.5 transition-all duration-300"
              >
                Explore Menu

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                onClick={() => navigate("/table-reservation")}
                className="inline-flex items-center justify-center gap-2 border border-[#102A43] text-[#102A43] px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#102A43] hover:text-white hover:-translate-y-0.5 transition-all duration-300"
              >
                Reserve a Table
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Restaurant;