import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#102A43] text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div data-aos="fade-up">
            <Link
              to="/"
              className="inline-block text-3xl font-bold tracking-wide transition hover:text-[#C89B3C]"
            >
              Hostivo
            </Link>

            <div className="w-10 h-0.5 bg-[#C89B3C] mt-4 mb-5" />

            <p className="max-w-sm text-sm sm:text-base text-white/60 leading-relaxed">
              A place to stay, dine and create memorable experiences.
              Discover comfortable accommodation and exceptional
              dining at Hostivo.
            </p>

            {/* Socials */}
            <div
              className="flex gap-3 mt-7"
              data-aos="fade-up"
              data-aos-delay="150"
            >

              <a
                href="#"
                aria-label="Facebook"
                className="group w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-300 hover:bg-[#C89B3C] hover:border-[#C89B3C] hover:-translate-y-1"
              >
                <span className="font-bold text-sm transition-transform duration-300 group-hover:scale-110">
                  f
                </span>
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="group w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-300 hover:bg-[#C89B3C] hover:border-[#C89B3C] hover:-translate-y-1"
              >
                <span className="font-bold text-xs transition-transform duration-300 group-hover:scale-110">
                  ig
                </span>
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="group w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-300 hover:bg-[#C89B3C] hover:border-[#C89B3C] hover:-translate-y-1"
              >
                <span className="font-bold text-sm transition-transform duration-300 group-hover:scale-110">
                  𝕏
                </span>
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-lg font-semibold tracking-wide">
              Quick Links
            </h3>

            <div className="w-8 h-0.5 bg-[#C89B3C] mt-3 mb-6" />

            <div className="flex flex-col gap-4">

              <Link
                to="/"
                className="group flex items-center justify-between max-w-44 text-sm text-white/60 transition-all duration-300 hover:text-white"
              >
                <span>Home</span>
                <ArrowUpRight
                  size={15}
                  className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </Link>

              <Link
                to="/menu"
                className="group flex items-center justify-between max-w-44 text-sm text-white/60 transition-all duration-300 hover:text-white"
              >
                <span>Restaurant Menu</span>
                <ArrowUpRight
                  size={15}
                  className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </Link>

              <Link
                to="/gallery"
                className="group flex items-center justify-between max-w-44 text-sm text-white/60 transition-all duration-300 hover:text-white"
              >
                <span>Gallery</span>
                <ArrowUpRight
                  size={15}
                  className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </Link>

              <Link
                to="/about"
                className="group flex items-center justify-between max-w-44 text-sm text-white/60 transition-all duration-300 hover:text-white"
              >
                <span>About Us</span>
                <ArrowUpRight
                  size={15}
                  className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </Link>

              <Link
                to="/contact"
                className="group flex items-center justify-between max-w-44 text-sm text-white/60 transition-all duration-300 hover:text-white"
              >
                <span>Contact</span>
                <ArrowUpRight
                  size={15}
                  className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </Link>

            </div>
          </div>

          {/* Reservations */}
          <div data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-lg font-semibold tracking-wide">
              Reservations
            </h3>

            <div className="w-8 h-0.5 bg-[#C89B3C] mt-3 mb-6" />

            <div className="flex flex-col gap-4">

              <Link
                to="/booking"
                className="group flex items-center justify-between max-w-44 text-sm text-white/60 transition-all duration-300 hover:text-white"
              >
                <span>Book a Room</span>
                <ArrowUpRight
                  size={15}
                  className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </Link>

              <Link
                to="/table-reservation"
                className="group flex items-center justify-between max-w-44 text-sm text-white/60 transition-all duration-300 hover:text-white"
              >
                <span>Reserve a Table</span>
                <ArrowUpRight
                  size={15}
                  className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </Link>

              <Link
                to="/menu"
                className="group flex items-center justify-between max-w-44 text-sm text-white/60 transition-all duration-300 hover:text-white"
              >
                <span>Order Food</span>
                <ArrowUpRight
                  size={15}
                  className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                />
              </Link>

            </div>
          </div>

          {/* Contact */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-lg font-semibold tracking-wide">
              Contact Us
            </h3>

            <div className="w-8 h-0.5 bg-[#C89B3C] mt-3 mb-6" />

            <div className="space-y-5">

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin
                    size={17}
                    className="text-[#C89B3C]"
                  />
                </div>

                <p className="text-sm text-white/60 leading-relaxed pt-1.5">
                  Hostivo Hotel & Restaurant
                  <br />
                  Kenya
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Phone
                    size={17}
                    className="text-[#C89B3C]"
                  />
                </div>

                <p className="text-sm text-white/60">
                  +254 700 000 000
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Mail
                    size={17}
                    className="text-[#C89B3C]"
                  />
                </div>

                <p className="text-sm text-white/60">
                  info@hostivo.com
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Clock
                    size={17}
                    className="text-[#C89B3C]"
                  />
                </div>

                <p className="text-sm text-white/60">
                  Open 24 Hours
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t border-white/10"
        data-aos="fade-up"
        data-aos-delay="200"
      >

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-white/40 text-xs sm:text-sm text-center">
              © {new Date().getFullYear()} Hostivo Hotel & Restaurant.
              All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-xs sm:text-sm">

              <Link
                to="/"
                className="text-white/40 hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </Link>

              <Link
                to="/"
                className="text-white/40 hover:text-white transition-colors duration-300"
              >
                Terms & Conditions
              </Link>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;