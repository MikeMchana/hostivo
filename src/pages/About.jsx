import { Link } from "react-router-dom";
import {
  Award,
  HeartHandshake,
  Utensils,
  BedDouble,
  ArrowRight,
} from "lucide-react";

function About() {
  const values = [
    {
      icon: HeartHandshake,
      title: "Genuine Hospitality",
      description:
        "We believe great hospitality begins with making people feel genuinely welcome.",
    },
    {
      icon: BedDouble,
      title: "Comfortable Spaces",
      description:
        "Our rooms are designed to provide comfort, privacy and a peaceful place to recharge.",
    },
    {
      icon: Utensils,
      title: "Exceptional Dining",
      description:
        "Fresh ingredients, carefully prepared meals and a welcoming dining atmosphere.",
    },
    {
      icon: Award,
      title: "Attention to Detail",
      description:
        "From the room to the restaurant, we pay attention to the details that make an experience better.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#102A43] text-white pt-32 pb-24">
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#C89B3C]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="uppercase tracking-[0.3em] text-xs md:text-sm text-[#C89B3C] font-semibold mb-4"
            >
              About Hostivo
            </p>

            <h1
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-7"
            >
              Hospitality Designed
              <br />
              <span className="text-white/90">Around You.</span>
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="300"
              className="max-w-2xl text-white/70 text-base md:text-lg leading-relaxed"
            >
              Hostivo brings accommodation, dining and memorable
              experiences together in one welcoming destination.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="relative overflow-hidden py-20 md:py-24 bg-white">
        <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-[#C89B3C]/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div
              data-aos="fade-right"
              className="relative group"
            >
              <div className="absolute -inset-3 rounded-[2rem] bg-[#C89B3C]/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />

              <div className="relative overflow-hidden rounded-3xl shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                  alt="Hostivo hotel"
                  className="w-full h-[420px] md:h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/30 via-transparent to-transparent" />
              </div>
            </div>

            {/* Text */}
            <div
              data-aos="fade-left"
              data-aos-delay="100"
            >
              <p className="uppercase tracking-[0.25em] text-xs md:text-sm text-[#C89B3C] font-semibold mb-4">
                Our Story
              </p>

              <h2 className="text-4xl md:text-5xl font-bold text-[#102A43] leading-tight mb-7">
                More Than a Place
                <br />
                to Stay.
              </h2>

              <div className="space-y-5 text-slate-600 leading-relaxed">
                <p className="text-lg">
                  Hostivo was created with a simple idea: hospitality
                  should feel personal, comfortable and effortless.
                </p>

                <p>
                  From the moment guests arrive, we want every part of
                  their experience to feel thoughtfully considered.
                  Comfortable rooms provide a place to rest, while our
                  restaurant brings people together over good food.
                </p>

                <p>
                  Whether you're travelling for business, spending time
                  with family or simply looking for a memorable meal,
                  Hostivo is designed to give you a reason to stay a
                  little longer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden py-20 md:py-24 bg-slate-50">
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#102A43]/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div
            data-aos="fade-up"
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <p className="uppercase tracking-[0.25em] text-xs md:text-sm text-[#C89B3C] font-semibold mb-4">
              What We Value
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-[#102A43] mb-5">
              Hospitality With Purpose
            </h2>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Every part of Hostivo is built around creating comfortable
              spaces, thoughtful service and experiences worth remembering.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="group bg-white p-7 md:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#C89B3C]/10 flex items-center justify-center mb-6 group-hover:bg-[#C89B3C] transition-colors duration-300">
                    <Icon
                      size={27}
                      className="text-[#C89B3C] group-hover:text-white transition-colors duration-300"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-[#102A43] mb-3">
                    {value.title}
                  </h3>

                  <p className="text-slate-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-20 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Mission */}
            <div
              data-aos="fade-right"
              className="relative overflow-hidden bg-[#102A43] rounded-3xl p-8 md:p-12 text-white shadow-xl"
            >
              <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-[#C89B3C]/10 blur-3xl" />

              <div className="relative">
                <p className="text-[#C89B3C] uppercase tracking-[0.2em] text-xs md:text-sm font-semibold mb-4">
                  Our Mission
                </p>

                <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
                  To make every stay feel special.
                </h2>

                <p className="text-white/70 leading-relaxed">
                  We aim to provide reliable accommodation, enjoyable
                  dining and thoughtful service that makes every guest
                  feel valued.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div
              data-aos="fade-left"
              data-aos-delay="100"
              className="relative overflow-hidden bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100"
            >
              <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-[#C89B3C]/5 blur-3xl" />

              <div className="relative">
                <p className="text-[#C89B3C] uppercase tracking-[0.2em] text-xs md:text-sm font-semibold mb-4">
                  Our Vision
                </p>

                <h2 className="text-3xl md:text-4xl font-bold text-[#102A43] mb-5 leading-tight">
                  A destination people remember.
                </h2>

                <p className="text-slate-600 leading-relaxed">
                  We envision Hostivo as a trusted hospitality
                  destination where comfortable stays, great food and
                  meaningful experiences come together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 md:py-24 bg-[#102A43] text-white">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-[#C89B3C]/10 blur-3xl" />

        <div
          data-aos="fade-up"
          className="relative max-w-4xl mx-auto px-6 text-center"
        >
          <p className="uppercase tracking-[0.3em] text-xs md:text-sm text-[#C89B3C] font-semibold mb-4">
            Experience Hostivo
          </p>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Ready to Experience Hostivo?
          </h2>

          <p className="max-w-2xl mx-auto text-white/70 text-base md:text-lg leading-relaxed mb-9">
            Book a comfortable room, enjoy a memorable meal or
            reserve a table for your next gathering.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/booking"
              className="group bg-[#C89B3C] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#b58a32] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-black/10"
            >
              Book a Room
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/menu"
              className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#102A43] transition-all duration-300 flex items-center justify-center"
            >
              Explore Our Menu
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;