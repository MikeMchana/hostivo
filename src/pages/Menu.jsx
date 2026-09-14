import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  Utensils,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const categories = [
  "All",
  "Breakfast",
  "Main Course",
  "Drinks",
  "Desserts",
];

const fallbackImage =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";

function Menu() {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMenuItems() {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(
          "/menu-items/",
          {
            method: "GET",
          },
          "Unable to load menu."
        );

        const formattedItems = data
          .filter((item) => item.is_available)
          .map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            description: item.description || "",
            price: Number(item.price),
            image: item.image_url || fallbackImage,
          }));

        setMenuItems(formattedItems);
      } catch (err) {
        setError(err.message || "Unable to load menu.");
      } finally {
        setLoading(false);
      }
    }

    loadMenuItems();
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const cartItemCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#102A43] text-white pt-32 pb-24">
        <div className="absolute -top-32 -right-24 w-96 h-96 bg-[#C89B3C]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <button
            onClick={() => navigate("/")}
            data-aos="fade-right"
            className="group flex items-center gap-2 text-white/70 hover:text-[#C89B3C] transition-colors duration-300 mb-10"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Home
          </button>

          <div className="max-w-3xl">
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C89B3C]/10 text-[#C89B3C] mb-6"
            >
              <Utensils size={22} />
            </div>

            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="uppercase tracking-[0.3em] text-xs md:text-sm text-[#C89B3C] font-semibold mb-4"
            >
              Hostivo Restaurant
            </p>

            <h1
              data-aos="fade-up"
              data-aos-delay="300"
              className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6"
            >
              Our Menu
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="400"
              className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl"
            >
              Discover freshly prepared dishes, refreshing drinks and
              delicious desserts made to make your Hostivo experience
              memorable.
            </p>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Category Filters */}
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
                  className={`px-5 md:px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
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

          {/* Loading */}
          {loading && (
            <div
              data-aos="fade-up"
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#C89B3C] animate-spin mb-5" />
              <p className="text-slate-500">Loading menu...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div
              data-aos="fade-up"
              className="max-w-xl mx-auto py-12"
            >
              <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-6 text-center">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredItems.length === 0 && (
              <div
                data-aos="fade-up"
                className="max-w-xl mx-auto text-center py-20"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#102A43]/5 text-[#102A43] flex items-center justify-center mb-5">
                  <Utensils size={26} />
                </div>

                <h2 className="text-xl font-bold text-[#102A43] mb-2">
                  No dishes available
                </h2>

                <p className="text-slate-500">
                  No menu items are currently available in this category.
                </p>
              </div>
            )}

          {/* Menu Grid */}
          {!loading &&
            !error &&
            filteredItems.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">
                {filteredItems.map((item, index) => (
                  <article
                    key={item.id}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    className="group bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500 hover:-translate-y-1"
                  >
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/40 via-transparent to-transparent opacity-60" />

                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <span className="font-bold text-[#102A43]">
                          KSh {item.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4">
                        <span className="inline-flex bg-[#102A43]/90 backdrop-blur-sm text-[#C89B3C] px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h2 className="text-xl font-bold text-[#102A43] mb-3">
                        {item.name}
                      </h2>

                      <p className="text-slate-500 leading-relaxed text-sm min-h-[3.5rem] mb-6">
                        {item.description}
                      </p>

                      <button
                        onClick={() => addToCart(item)}
                        className="w-full bg-[#102A43] text-white py-3.5 rounded-full font-semibold hover:bg-[#183b5c] transition-all duration-300 flex items-center justify-center gap-2 group/button"
                      >
                        <ShoppingCart
                          size={18}
                          className="group-hover/button:-translate-y-0.5 transition-transform"
                        />
                        Add to Order
                        <ArrowRight
                          size={17}
                          className="group-hover/button:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </div>
      </section>

      {/* Floating Cart */}
      {cartItemCount > 0 && (
        <button
          onClick={() => {
            const cartButton = document.querySelector(
              "[aria-label='Open order cart']"
            );

            if (cartButton) {
              cartButton.click();
            }
          }}
          data-aos="fade-up"
          className="fixed bottom-6 right-6 bg-[#C89B3C] text-white px-5 md:px-6 py-3.5 md:py-4 rounded-full shadow-xl shadow-[#102A43]/20 flex items-center gap-3 hover:bg-[#b18732] hover:-translate-y-1 transition-all duration-300 z-30"
        >
          <ShoppingCart size={20} />
          <span className="font-semibold">View Order</span>
          <span className="bg-white text-[#102A43] w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">
            {cartItemCount}
          </span>
        </button>
      )}
    </main>
  );
}

export default Menu;