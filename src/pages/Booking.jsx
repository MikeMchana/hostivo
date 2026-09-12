import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Users,
  CheckCircle,
} from "lucide-react";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const room = location.state?.room;

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div
          data-aos="fade-up"
          className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 text-center shadow-xl border border-slate-100"
        >
          <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-[#102A43]/5 flex items-center justify-center">
            <CalendarDays
              size={25}
              className="text-[#C89B3C]"
            />
          </div>

          <p className="uppercase tracking-[0.2em] text-xs font-semibold text-[#C89B3C] mb-3">
            Hostivo
          </p>

          <h1 className="text-3xl font-bold text-[#102A43] mb-4">
            Room Not Selected
          </h1>

          <p className="text-slate-600 leading-relaxed mb-7">
            Please select a room before making a booking.
          </p>

          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center justify-center gap-2 bg-[#102A43] text-white px-7 py-3.5 rounded-full font-semibold transition-all duration-300 hover:bg-[#183b5c] hover:-translate-y-0.5"
          >
            Back to Rooms

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) {
      return 0;
    }

    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);

    const difference = checkOut - checkIn;

    return Math.max(
      0,
      Math.ceil(difference / (1000 * 60 * 60 * 24))
    );
  };

  const nights = calculateNights();
  const total = nights * room.price;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (nights <= 0) {
      setError("Please select a valid check-in and check-out date.");
      return;
    }

    if (Number(formData.guests) > room.capacity) {
      setError(
        `This room can accommodate a maximum of ${room.capacity} guests.`
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/reservations/public",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            full_name: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            room_id: room.id,
            check_in: formData.checkIn,
            check_out: formData.checkOut,
            guests: Number(formData.guests),
            total_amount: total,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to complete your booking request."
        );
      }

      console.log("=================================");
      console.log("🏨 HOSTIVO BOOKING");
      console.log("=================================");
      console.log("Reservation ID:", data.id);
      console.log("Customer ID:", data.customer_id);
      console.log("Room ID:", data.room_id);
      console.log("Status:", data.status);
      console.log("=================================");

      setSubmitted(true);
    } catch (err) {
      console.error("Booking error:", err);

      setError(
        err.message ||
          "Something went wrong while submitting your booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
        <div
          data-aos="fade-up"
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 text-center overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="w-20 h-20 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle size={42} />
            </div>

            <p
              data-aos="fade-up"
              data-aos-delay="150"
              className="uppercase tracking-[0.2em] text-xs font-semibold text-[#C89B3C] mb-3"
            >
              Reservation Submitted
            </p>

            <h1
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-3xl sm:text-4xl font-bold text-[#102A43] mb-4"
            >
              Booking Request Received!
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="250"
              className="text-slate-600 leading-relaxed mb-7"
            >
              Thank you, {formData.fullName}. Your booking request for the{" "}
              <strong>{room.name}</strong> has been received and is now
              pending confirmation.
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="bg-slate-50 rounded-2xl p-5 sm:p-6 mb-7 text-left"
            >
              <div className="flex justify-between gap-4 mb-4">
                <span className="text-slate-500">
                  Room
                </span>

                <span className="font-semibold text-[#102A43] text-right">
                  {room.name}
                </span>
              </div>

              <div className="flex justify-between gap-4 mb-4">
                <span className="text-slate-500">
                  Guests
                </span>

                <span className="font-semibold text-[#102A43]">
                  {formData.guests}
                </span>
              </div>

              <div className="flex justify-between gap-4 mb-4">
                <span className="text-slate-500">
                  Nights
                </span>

                <span className="font-semibold text-[#102A43]">
                  {nights}
                </span>
              </div>

              <div className="flex justify-between gap-4 mb-4">
                <span className="text-slate-500">
                  Status
                </span>

                <span className="font-semibold text-amber-600">
                  Pending
                </span>
              </div>

              <div className="flex justify-between gap-4 pt-4 border-t border-slate-200">
                <span className="text-slate-500">
                  Estimated Total
                </span>

                <span className="font-bold text-[#102A43]">
                  KSh {total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              data-aos="fade-up"
              data-aos-delay="350"
              onClick={() => navigate("/")}
              className="group w-full bg-[#102A43] text-white py-4 rounded-full font-semibold hover:bg-[#183b5c] transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Back to Home

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
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
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft
              size={18}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            <span className="text-sm font-medium">
              Back
            </span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-10 sm:py-14 lg:py-16">

        {/* Page Heading */}
        <div
          data-aos="fade-up"
          className="mb-10"
        >
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="uppercase tracking-[0.22em] text-xs sm:text-sm text-[#C89B3C] font-semibold mb-3"
          >
            Hotel Booking
          </p>

          <h1
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-4xl sm:text-5xl font-bold text-[#102A43] leading-tight"
          >
            Reserve Your Stay
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="300"
            className="text-slate-600 mt-3 max-w-xl leading-relaxed"
          >
            Complete the form below to request your reservation at Hostivo.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">

          {/* Form */}
          <div
            data-aos="fade-right"
            data-aos-delay="100"
            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Error Message */}
              {error && (
                <div
                  data-aos="fade-up"
                  className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-4"
                >
                  <p className="text-sm font-medium">
                    {error}
                  </p>
                </div>
              )}

              {/* Dates */}
              <div data-aos="fade-up" data-aos-delay="150">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-[#102A43]/5 flex items-center justify-center">
                    <CalendarDays
                      size={18}
                      className="text-[#C89B3C]"
                    />
                  </div>

                  <h2 className="text-xl font-bold text-[#102A43]">
                    Stay Details
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <div>
                    <label className="block text-sm font-medium text-[#102A43] mb-2">
                      Check-in
                    </label>

                    <div className="relative">
                      <CalendarDays
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />

                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all duration-300 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#102A43] mb-2">
                      Check-out
                    </label>

                    <div className="relative">
                      <CalendarDays
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />

                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all duration-300 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Guests */}
              <div
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <label className="block text-sm font-medium text-[#102A43] mb-2">
                  Number of Guests
                </label>

                <div className="relative">
                  <Users
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    min="1"
                    max={room.capacity}
                    required
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all duration-300 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10"
                  />
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  Maximum capacity: {room.capacity} guests
                </p>
              </div>

              {/* Guest Information */}
              <div
                data-aos="fade-up"
                data-aos-delay="250"
              >
                <h2 className="text-xl font-bold text-[#102A43] mb-5">
                  Guest Information
                </h2>

                <div className="space-y-5">

                  <div>
                    <label className="block text-sm font-medium text-[#102A43] mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">

                    <div>
                      <label className="block text-sm font-medium text-[#102A43] mb-2">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#102A43] mb-2">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="0712 345 678"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10"
                      />
                    </div>

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#102A43] mb-2">
                      Special Requests
                    </label>

                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Any special requests or notes?"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none transition-all duration-300 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 resize-none"
                    />
                  </div>

                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={nights <= 0 || loading}
                data-aos="fade-up"
                data-aos-delay="300"
                className="group w-full bg-[#102A43] text-white py-4 rounded-full font-semibold hover:bg-[#183b5c] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  "Submitting Booking..."
                ) : (
                  <>
                    Confirm Booking Request

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Room Summary */}
          <aside
            data-aos="fade-left"
            data-aos-delay="200"
            className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-fit lg:sticky lg:top-6"
          >
            <div className="relative">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-56 sm:h-64 object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#102A43]/40 via-transparent to-transparent pointer-events-none" />

              <span className="absolute bottom-4 left-5 inline-flex px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-[#102A43] text-xs font-bold uppercase tracking-wider">
                {room.type}
              </span>
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#102A43] mb-4">
                {room.name}
              </h2>

              <div className="flex justify-between gap-4 text-sm text-slate-500 border-b border-slate-100 pb-5 mb-5">
                <span>
                  {room.capacity} Guests
                </span>

                <span>
                  {room.size} m²
                </span>
              </div>

              <div className="flex justify-between gap-4 mb-3">
                <span className="text-slate-500">
                  Price / night
                </span>

                <span className="font-semibold text-[#102A43]">
                  KSh {room.price.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between gap-4 mb-4">
                <span className="text-slate-500">
                  Nights
                </span>

                <span className="font-semibold text-[#102A43]">
                  {nights}
                </span>
              </div>

              <div className="flex justify-between gap-4 pt-4 border-t border-slate-200">
                <span className="font-semibold text-[#102A43]">
                  Estimated Total
                </span>

                <span className="text-xl font-bold text-[#102A43]">
                  KSh {total.toLocaleString()}
                </span>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

export default Booking;