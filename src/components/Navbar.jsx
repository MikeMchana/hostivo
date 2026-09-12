import { useState } from "react";
import { Menu, X, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { cart } = useCart();

  const cartItemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">

            {/* Logo */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              data-aos="fade-right"
              className="group relative text-2xl lg:text-3xl font-bold text-white tracking-wide"
            >
              Hostivo

              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#C89B3C] transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Desktop Navigation */}
            <div
              className="hidden lg:flex items-center gap-7 xl:gap-8"
              data-aos="fade-down"
              data-aos-delay="150"
            >
              <Link
                to="/"
                className="relative text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 group"
              >
                Home
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#C89B3C] transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link
                to="/#rooms"
                className="relative text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 group"
              >
                Rooms
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#C89B3C] transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link
                to="/#restaurant"
                className="relative text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 group"
              >
                Restaurant
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#C89B3C] transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link
                to="/menu"
                className="relative text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 group"
              >
                Menu
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#C89B3C] transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link
                to="/gallery"
                className="relative text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 group"
              >
                Gallery
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#C89B3C] transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link
                to="/#experience"
                className="relative text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 group"
              >
                Experience
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#C89B3C] transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link
                to="/about"
                className="relative text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 group"
              >
                About
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#C89B3C] transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link
                to="/contact"
                className="relative text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 group"
              >
                Contact
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#C89B3C] transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="group relative w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:-translate-y-0.5"
                aria-label="Open order cart"
              >
                <ShoppingCart
                  size={20}
                  className="transition-transform duration-300 group-hover:scale-110"
                />

                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-[#C89B3C] text-[#102A43] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#102A43]">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Book Now */}
              <Link
                to="/booking"
                className="group inline-flex items-center gap-2 bg-[#C89B3C] text-white px-5 xl:px-6 py-3 rounded-full font-semibold text-sm shadow-lg shadow-black/10 transition-all duration-300 hover:bg-[#b58a32] hover:-translate-y-0.5 hover:shadow-xl"
              >
                Book Now

                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Mobile Controls */}
            <div
              className="lg:hidden flex items-center gap-3"
              data-aos="fade-left"
              data-aos-delay="150"
            >
              {/* Mobile Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/10"
                aria-label="Open order cart"
              >
                <ShoppingCart size={21} />

                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-[#C89B3C] text-[#102A43] text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#102A43]">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white transition-all duration-300 hover:bg-white/10"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X size={23} />
                ) : (
                  <Menu size={23} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              className="lg:hidden mt-2 rounded-2xl border border-white/10 bg-white/95 backdrop-blur-md shadow-2xl p-5 sm:p-6"
              data-aos="fade-down"
              data-aos-duration="500"
            >
              <div className="flex flex-col">

                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  data-aos="fade-up"
                  data-aos-delay="50"
                  className="py-3.5 px-3 rounded-xl text-[#102A43] font-medium transition-colors duration-300 hover:bg-[#102A43]/5 hover:text-[#C89B3C]"
                >
                  Home
                </Link>

                <Link
                  to="/#rooms"
                  onClick={closeMobileMenu}
                  data-aos="fade-up"
                  data-aos-delay="100"
                  className="py-3.5 px-3 rounded-xl text-[#102A43] font-medium transition-colors duration-300 hover:bg-[#102A43]/5 hover:text-[#C89B3C]"
                >
                  Rooms
                </Link>

                <Link
                  to="/#restaurant"
                  onClick={closeMobileMenu}
                  data-aos="fade-up"
                  data-aos-delay="150"
                  className="py-3.5 px-3 rounded-xl text-[#102A43] font-medium transition-colors duration-300 hover:bg-[#102A43]/5 hover:text-[#C89B3C]"
                >
                  Restaurant
                </Link>

                <Link
                  to="/menu"
                  onClick={closeMobileMenu}
                  data-aos="fade-up"
                  data-aos-delay="200"
                  className="py-3.5 px-3 rounded-xl text-[#102A43] font-medium transition-colors duration-300 hover:bg-[#102A43]/5 hover:text-[#C89B3C]"
                >
                  Menu
                </Link>

                <Link
                  to="/gallery"
                  onClick={closeMobileMenu}
                  data-aos="fade-up"
                  data-aos-delay="250"
                  className="py-3.5 px-3 rounded-xl text-[#102A43] font-medium transition-colors duration-300 hover:bg-[#102A43]/5 hover:text-[#C89B3C]"
                >
                  Gallery
                </Link>

                <Link
                  to="/#experience"
                  onClick={closeMobileMenu}
                  data-aos="fade-up"
                  data-aos-delay="300"
                  className="py-3.5 px-3 rounded-xl text-[#102A43] font-medium transition-colors duration-300 hover:bg-[#102A43]/5 hover:text-[#C89B3C]"
                >
                  Experience
                </Link>

                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  data-aos="fade-up"
                  data-aos-delay="350"
                  className="py-3.5 px-3 rounded-xl text-[#102A43] font-medium transition-colors duration-300 hover:bg-[#102A43]/5 hover:text-[#C89B3C]"
                >
                  About
                </Link>

                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  data-aos="fade-up"
                  data-aos-delay="400"
                  className="py-3.5 px-3 rounded-xl text-[#102A43] font-medium transition-colors duration-300 hover:bg-[#102A43]/5 hover:text-[#C89B3C]"
                >
                  Contact
                </Link>

                <div
                  className="pt-3 mt-2 border-t border-[#102A43]/10"
                  data-aos="fade-up"
                  data-aos-delay="450"
                >
                  <Link
                    to="/booking"
                    onClick={closeMobileMenu}
                    className="group flex items-center justify-center gap-2 bg-[#102A43] text-white px-6 py-3.5 rounded-full font-semibold text-center transition-all duration-300 hover:bg-[#C89B3C]"
                  >
                    Book Now

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>

              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}

export default Navbar;