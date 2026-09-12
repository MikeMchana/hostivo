import { useCart } from "../context/CartContext";
import { useState } from "react";

const categories = ["All", "Breakfast", "Main Course", "Drinks", "Desserts"];

const menuItems = [
  {
    id: 1,
    name: "English Breakfast",
    category: "Breakfast",
    description: "Eggs, sausages, toast, baked beans and fresh fruit.",
    price: 850,
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 2,
    name: "Grilled Chicken",
    category: "Main Course",
    description: "Tender grilled chicken served with vegetables and fries.",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 3,
    name: "Beef Steak",
    category: "Main Course",
    description: "Juicy grilled beef steak served with seasonal vegetables.",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 4,
    name: "Fresh Tropical Juice",
    category: "Drinks",
    description: "A refreshing blend of fresh tropical fruits.",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 5,
    name: "Chocolate Cake",
    category: "Desserts",
    description: "Rich chocolate cake served with a touch of cream.",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 6,
    name: "Fresh Fruit Platter",
    category: "Breakfast",
    description: "A selection of fresh seasonal fruits.",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=800&q=85",
  },
];

function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");

  const { addToCart } = useCart();

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <section
      id="menu"
      className="relative overflow-hidden bg-slate-50 py-24 md:py-28"
    >
      {/* Decorative background elements */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-[#C89B3C]/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-[#102A43]/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <div
          data-aos="fade-up"
          className="max-w-3xl mx-auto text-center mb-12 md:mb-14"
        >
          <p className="uppercase tracking-[0.3em] text-xs sm:text-sm text-[#C89B3C] font-semibold mb-4">
            Our Menu
          </p>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#102A43] mb-6">
            Discover Our Cuisine
          </h2>

          <p className="max-w-2xl mx-auto text-slate-600 text-base md:text-lg leading-relaxed">
            From hearty breakfasts to carefully prepared dinners, discover
            something delicious at Hostivo.
          </p>
        </div>

        {/* Categories */}
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          className="flex flex-wrap justify-center gap-2.5 md:gap-3 mb-12 md:mb-14"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-5 md:px-6 py-2.5 md:py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-[#102A43] text-white shadow-md shadow-[#102A43]/15"
                    : "bg-white text-[#102A43] border border-slate-200 hover:border-[#C89B3C] hover:text-[#102A43] hover:-translate-y-0.5"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Menu Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {filteredItems.map((item, index) => (
            <article
              key={item.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-56 sm:h-60 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/35 via-transparent to-transparent opacity-70" />

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#102A43] shadow-sm">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#102A43]">
                    {item.name}
                  </h3>

                  <span className="shrink-0 text-base font-bold text-[#C89B3C]">
                    KSh {item.price.toLocaleString()}
                  </span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  className="w-full bg-[#102A43] text-white py-3.5 rounded-full text-sm font-semibold hover:bg-[#183b5c] hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
                >
                  Add to Order
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Menu;