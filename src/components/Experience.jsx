import {
  BedDouble,
  ConciergeBell,
  Utensils,
  Waves,
} from "lucide-react";

function Experience() {
  const features = [
    {
      icon: BedDouble,
      title: "Comfortable Rooms",
      description: "Relax in thoughtfully designed spaces.",
    },
    {
      icon: Utensils,
      title: "Exceptional Dining",
      description: "Enjoy fresh meals throughout the day.",
    },
    {
      icon: ConciergeBell,
      title: "Thoughtful Service",
      description: "Hospitality designed around you.",
    },
    {
      icon: Waves,
      title: "Relaxing Atmosphere",
      description: "A peaceful environment to unwind.",
    },
  ];

  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-[#102A43] py-24 md:py-28"
    >
      {/* Decorative background */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#C89B3C]/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Content */}
          <div
            data-aos="fade-right"
            className="text-white"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#C89B3C]" />

              <p className="uppercase tracking-[0.3em] text-xs sm:text-sm text-[#C89B3C] font-semibold">
                The Hostivo Experience
              </p>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] mb-7">
              More Than Just a Stay.
              <br />
              <span className="text-[#C89B3C]">It's an Experience.</span>
            </h2>

            {/* Description */}
            <p className="text-white/75 text-base md:text-lg leading-relaxed mb-5 max-w-xl">
              At Hostivo, every detail is designed to make your stay
              comfortable, memorable and effortless.
            </p>

            <p className="text-white/60 leading-relaxed mb-9 max-w-xl">
              From thoughtfully designed rooms and exceptional dining to warm
              hospitality and relaxing spaces, we create an experience that
              feels like home while giving you something special to remember.
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    className="group flex items-start gap-4"
                  >
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#C89B3C]/10 group-hover:border-[#C89B3C]/30">
                      <Icon
                        size={20}
                        className="text-[#C89B3C]"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-base md:text-lg mb-1">
                        {feature.title}
                      </h3>

                      <p className="text-white/55 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image */}
          <div
            data-aos="fade-left"
            data-aos-delay="100"
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=85"
                alt="Luxury Hostivo hotel experience"
                className="w-full h-[420px] sm:h-[500px] lg:h-[560px] object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/45 via-transparent to-transparent" />
            </div>

            {/* Floating card */}
            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="absolute -bottom-7 left-5 md:left-8 bg-white rounded-2xl shadow-2xl border border-slate-100 px-6 py-5"
            >
              <p className="text-xs uppercase tracking-[0.15em] text-slate-500 mb-2">
                Your comfort
              </p>

              <p className="text-lg md:text-xl font-semibold text-[#102A43]">
                Our priority
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Experience;