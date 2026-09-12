import { useNavigate } from "react-router-dom";
import { ArrowRight, BedDouble, Users } from "lucide-react";

function RoomCard({ room }) {
  const navigate = useNavigate();

  return (
    <article
      className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
      data-aos="fade-up"
    >
      {/* Image */}
      <div
        className="relative h-64 sm:h-72 overflow-hidden"
        data-aos="zoom-in"
        data-aos-duration="700"
      >
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/35 via-transparent to-transparent opacity-70" />

        {/* Room type */}
        <div
          className="absolute top-4 left-4"
          data-aos="fade-right"
          data-aos-delay="150"
        >
          <span className="inline-flex items-center rounded-full bg-[#102A43]/90 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white">
            {room.type}
          </span>
        </div>

        {/* Price */}
        <div
          className="absolute top-4 right-4 rounded-full bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-lg"
          data-aos="fade-left"
          data-aos-delay="150"
        >
          <span className="text-[#102A43] font-bold">
            KSh {room.price.toLocaleString()}
          </span>
          <span className="text-slate-500 text-xs ml-1">/ night</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-7">
        {/* Title */}
        <h3
          className="text-2xl font-semibold tracking-tight text-[#102A43] mb-3"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {room.name}
        </h3>

        {/* Description */}
        <p
          className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          {room.description}
        </p>

        {/* Details */}
        <div
          className="flex items-center gap-5 border-t border-slate-100 pt-5 mb-6"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users size={17} className="text-[#C89B3C]" />
            <span>
              {room.capacity} {room.capacity === 1 ? "Guest" : "Guests"}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BedDouble size={17} className="text-[#C89B3C]" />
            <span>{room.size} m²</span>
          </div>
        </div>

        {/* Buttons */}
        <div
          className="flex gap-3"
          data-aos="fade-up"
          data-aos-delay="250"
        >
          <button
            type="button"
            onClick={() =>
              navigate("/room-details", {
                state: { room },
              })
            }
            className="group/details flex-1 inline-flex items-center justify-center gap-2 border border-[#102A43] text-[#102A43] py-3.5 rounded-full text-sm font-semibold hover:bg-[#102A43] hover:text-white transition-all duration-300"
          >
            View Details
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover/details:translate-x-1"
            />
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/booking", {
                state: { room },
              })
            }
            className="flex-1 bg-[#C89B3C] text-[#102A43] py-3.5 rounded-full text-sm font-semibold hover:bg-[#d4aa50] transition-all duration-300 hover:-translate-y-0.5"
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}

export default RoomCard;