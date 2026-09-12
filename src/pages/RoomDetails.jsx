import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Maximize,
  Check,
  CalendarDays,
} from "lucide-react";

function RoomDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const room = location.state?.room;

  // If someone visits the page directly without selecting a room
  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div
          data-aos="fade-up"
          className="w-full max-w-md text-center bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100"
        >
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="w-14 h-14 mx-auto mb-6 rounded-full bg-[#102A43]/5 flex items-center justify-center"
          >
            <CalendarDays size={25} className="text-[#C89B3C]" />
          </div>

          <p
            data-aos="fade-up"
            data-aos-delay="150"
            className="uppercase tracking-[0.2em] text-xs font-semibold text-[#C89B3C] mb-3"
          >
            Hostivo
          </p>

          <h1
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-3xl font-bold text-[#102A43] mb-4"
          >
            Room Not Found
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="250"
            className="text-slate-600 leading-relaxed mb-7"
          >
            We couldn't find the room you're looking for. Please return to the
            home page and choose a room.
          </p>

          <button
            data-aos="fade-up"
            data-aos-delay="300"
            onClick={() => navigate("/")}
            className="group inline-flex items-center justify-center gap-2 bg-[#102A43] text-white px-7 py-3.5 rounded-full font-semibold transition-all duration-300 hover:bg-[#183b5c] hover:-translate-y-0.5"
          >
            Back to Home

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#102A43] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <button
            data-aos="fade-right"
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            <span className="text-sm font-medium">Back to Rooms</span>
          </button>
        </div>
      </header>

      {/* Room Details */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-start">
          {/* Image */}
          <div
            data-aos="fade-right"
            className="relative group rounded-3xl overflow-hidden shadow-xl"
          >
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-[360px] sm:h-[450px] lg:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/35 via-transparent to-transparent pointer-events-none" />

            {/* Room Type */}
            <div
              data-aos="fade-down"
              data-aos-delay="200"
              className="absolute top-5 left-5"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/95 backdrop-blur-sm text-[#102A43] text-xs font-bold uppercase tracking-wider shadow-lg">
                {room.type}
              </span>
            </div>
          </div>

          {/* Information */}
          <div className="lg:pt-2">
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="uppercase tracking-[0.22em] text-xs sm:text-sm text-[#C89B3C] font-semibold mb-3"
            >
              Your stay at Hostivo
            </p>

            <h1
              data-aos="fade-up"
              data-aos-delay="150"
              className="text-4xl sm:text-5xl xl:text-6xl font-bold text-[#102A43] leading-tight mb-5"
            >
              {room.name}
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl"
            >
              {room.description}
            </p>

            {/* Room Stats */}
            <div className="grid grid-cols-2 gap-4 mb-9">
              <div
                data-aos="fade-up"
                data-aos-delay="250"
                className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#102A43]/5 flex items-center justify-center mb-4">
                  <Users size={21} className="text-[#C89B3C]" />
                </div>

                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                  Capacity
                </p>

                <p className="font-semibold text-[#102A43]">
                  {room.capacity} Guests
                </p>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#102A43]/5 flex items-center justify-center mb-4">
                  <Maximize size={21} className="text-[#C89B3C]" />
                </div>

                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                  Room Size
                </p>

                <p className="font-semibold text-[#102A43]">
                  {room.size} m²
                </p>
              </div>
            </div>

            {/* Amenities */}
            {room.amenities && (
              <div data-aos="fade-up" data-aos-delay="200" className="mb-9">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#102A43]">
                    Room Amenities
                  </h2>

                  <div className="hidden sm:block h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {room.amenities.map((amenity, index) => (
                    <div
                      key={amenity}
                      data-aos="fade-up"
                      data-aos-delay={250 + index * 50}
                      className="flex items-center gap-3 text-slate-600"
                    >
                      <span className="w-7 h-7 rounded-full bg-[#C89B3C]/10 flex items-center justify-center shrink-0">
                        <Check size={15} className="text-[#C89B3C]" />
                      </span>

                      <span className="text-sm sm:text-base">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price + Booking */}
            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="relative overflow-hidden bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-lg"
            >
              {/* Decorative glow */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="flex items-end justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
                      Starting from
                    </p>

                    <p className="text-3xl sm:text-4xl font-bold text-[#102A43]">
                      KSh {room.price.toLocaleString()}
                    </p>
                  </div>

                  <span className="text-sm text-slate-500 pb-1">/ night</span>
                </div>

                <button
                  onClick={() =>
                    navigate("/booking", {
                      state: { room },
                    })
                  }
                  className="group w-full bg-[#102A43] text-white py-4 rounded-full font-semibold hover:bg-[#183b5c] transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-lg"
                >
                  <CalendarDays size={19} />

                  <span>Check Availability</span>

                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RoomDetails;