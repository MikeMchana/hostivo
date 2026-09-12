import RoomCard from "./RoomCard";

const rooms = [
  {
    id: 1,
    name: "Deluxe Room",
    type: "Deluxe",
    price: 4500,
    capacity: 2,
    size: "32 m²",
    description:
      "A comfortable and elegant room designed for a relaxing stay with modern amenities.",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 2,
    name: "Executive Room",
    type: "Executive",
    price: 6500,
    capacity: 2,
    size: "42 m²",
    description:
      "Enjoy additional space, refined interiors and a comfortable environment for business or leisure.",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85",
  },
  {
    id: 3,
    name: "Luxury Suite",
    type: "Suite",
    price: 9500,
    capacity: 4,
    size: "65 m²",
    description:
      "A spacious suite offering a premium experience with separate living space and elegant furnishings.",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85",
  },
];

function Rooms() {
  return (
    <section
      id="rooms"
      className="relative overflow-hidden bg-slate-50 py-24 md:py-28"
    >
      {/* Subtle decorative glow */}
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#C89B3C]/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#102A43]/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section heading */}
        <div
          data-aos="fade-up"
          className="max-w-3xl mx-auto text-center mb-14 md:mb-16"
        >
          <p className="uppercase tracking-[0.3em] text-xs sm:text-sm text-[#C89B3C] font-semibold mb-4">
            Accommodation
          </p>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#102A43] mb-6">
            Find Your Perfect Stay
          </h2>

          <p className="max-w-2xl mx-auto text-slate-600 text-base md:text-lg leading-relaxed">
            From comfortable rooms to spacious suites, Hostivo offers
            thoughtfully designed spaces for every kind of stay.
          </p>
        </div>

        {/* Room cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <RoomCard room={room} />
            </div>
          ))}
        </div>

        {/* View all */}
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="flex justify-center mt-12 md:mt-14"
        >
          <button
            type="button"
            className="group inline-flex items-center gap-2 rounded-full border border-[#102A43] px-7 py-3.5 text-sm font-semibold text-[#102A43] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#102A43] hover:text-white"
          >
            View All Rooms
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Rooms;