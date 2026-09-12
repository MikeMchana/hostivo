import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Users,
  CheckCircle,
  Utensils,
} from "lucide-react";
import { apiRequest } from "../services/api";

function TableReservation() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 2,
    fullName: "",
    phone: "",
    email: "",
    specialRequests: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError("");

    try {
      await apiRequest(
        "/table-reservations/public",
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
            reservation_date: formData.date,
            reservation_time: formData.time,
            guests: Number(formData.guests),
            special_requests: formData.specialRequests || null,
          }),
        },
        "Unable to complete your table reservation."
      );

      setSubmitted(true);
    } catch (err) {
      setError(
        err.message ||
          "Unable to complete your table reservation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#C89B3C]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#102A43]/10 rounded-full blur-3xl" />

        <div
          data-aos="fade-up"
          className="relative bg-white max-w-lg w-full rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-10 text-center"
        >
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="w-20 h-20 mx-auto bg-[#C89B3C]/10 text-[#C89B3C] rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle size={42} strokeWidth={1.8} />
          </div>

          <p
            data-aos="fade-up"
            data-aos-delay="150"
            className="uppercase tracking-[0.2em] text-xs font-semibold text-[#C89B3C] mb-3"
          >
            Reservation Received
          </p>

          <h1
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-3xl md:text-4xl font-bold text-[#102A43] mb-4"
          >
            Table Reserved
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="250"
            className="text-slate-600 leading-relaxed mb-8"
          >
            Thank you, {formData.fullName}. Your table reservation request has
            been received. We look forward to welcoming you to Hostivo.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="300"
            className="bg-slate-50 rounded-2xl p-5 mb-8 text-left border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#102A43] text-[#C89B3C] flex items-center justify-center">
                <Utensils size={18} />
              </div>

              <div>
                <p className="font-semibold text-[#102A43]">
                  Reservation Details
                </p>
                <p className="text-sm text-slate-500">
                  Your requested dining time
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Date</span>
                <span className="font-semibold text-[#102A43] text-right">
                  {formData.date}
                </span>
              </div>

              <div className="h-px bg-slate-200" />

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Time</span>
                <span className="font-semibold text-[#102A43] text-right">
                  {formData.time}
                </span>
              </div>

              <div className="h-px bg-slate-200" />

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Guests</span>
                <span className="font-semibold text-[#102A43] text-right">
                  {formData.guests}
                </span>
              </div>
            </div>
          </div>

          <button
            data-aos="fade-up"
            data-aos-delay="350"
            onClick={() => navigate("/")}
            className="w-full bg-[#102A43] text-white py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#183b5c] transition-all duration-300 group"
          >
            Back to Home
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#102A43] text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C89B3C]/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <button
            data-aos="fade-right"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/75 hover:text-[#C89B3C] transition-colors duration-300 group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 lg:px-8 py-14 md:py-20">
        {/* Intro */}
        <div className="text-center mb-12">
          <div
            data-aos="fade-up"
            data-aos-delay="100"
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C89B3C]/10 text-[#C89B3C] mb-5"
          >
            <Utensils size={22} />
          </div>

          <p
            data-aos="fade-up"
            data-aos-delay="150"
            className="uppercase tracking-[0.25em] text-xs md:text-sm text-[#C89B3C] font-semibold mb-4"
          >
            Hostivo Restaurant
          </p>

          <h1
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#102A43]"
          >
            Reserve a Table
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="300"
            className="text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed"
          >
            Reserve your table at Hostivo and enjoy an unforgettable dining
            experience in a relaxed and welcoming atmosphere.
          </p>
        </div>

        {/* Form Card */}
        <div
          data-aos="fade-up"
          data-aos-delay="150"
          className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Reservation Details */}
            <div data-aos="fade-right">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-[#102A43] text-[#C89B3C] flex items-center justify-center">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#102A43]">
                    Reservation Details
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Choose when you would like to dine with us.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                {/* Date */}
                <div data-aos="fade-up" data-aos-delay="100">
                  <label className="block text-sm font-semibold text-[#102A43] mb-2">
                    Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-white text-slate-700 outline-none transition-all duration-200 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Time */}
                <div data-aos="fade-up" data-aos-delay="150">
                  <label className="block text-sm font-semibold text-[#102A43] mb-2">
                    Time
                  </label>

                  <div className="relative">
                    <Clock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />

                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-white text-slate-700 outline-none transition-all duration-200 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div data-aos="fade-up" data-aos-delay="200">
                  <label className="block text-sm font-semibold text-[#102A43] mb-2">
                    Guests
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
                      max="20"
                      required
                      disabled={isSubmitting}
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-white text-slate-700 outline-none transition-all duration-200 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100" />

            {/* Customer Information */}
            <div data-aos="fade-left" data-aos-delay="100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-[#102A43] text-[#C89B3C] flex items-center justify-center">
                  <Users size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#102A43]">
                    Your Information
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Let us know who will be joining us.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div data-aos="fade-up" data-aos-delay="150">
                  <label className="block text-sm font-semibold text-[#102A43] mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Enter your full name"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 bg-white outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Phone + Email */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div data-aos="fade-up" data-aos-delay="200">
                    <label className="block text-sm font-semibold text-[#102A43] mb-2">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      placeholder="0712 345 678"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3.5 bg-white outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div data-aos="fade-up" data-aos-delay="250">
                    <label className="block text-sm font-semibold text-[#102A43] mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      placeholder="you@example.com"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3.5 bg-white outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div data-aos="fade-up" data-aos-delay="300">
                  <label className="block text-sm font-semibold text-[#102A43] mb-2">
                    Special Requests
                  </label>

                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows="4"
                    disabled={isSubmitting}
                    placeholder="Birthday celebration, dietary requirements, preferred seating, etc."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 bg-white outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 resize-none disabled:bg-slate-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                data-aos="fade-up"
                className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <div data-aos="fade-up" data-aos-delay="350" className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#102A43] text-white py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#183b5c] hover:shadow-lg hover:shadow-[#102A43]/20 transition-all duration-300 group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Reserving Table...
                  </>
                ) : (
                  <>
                    Confirm Table Reservation
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400 mt-4">
                We look forward to welcoming you to Hostivo.
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default TableReservation;