import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ArrowRight,
} from "lucide-react";

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const messageData = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    };

    console.log("=================================");
    console.log("📩 HOSTIVO CONTACT MESSAGE");
    console.log("=================================");
    console.log(messageData);
    console.log("=================================");

    setSubmitted(true);
  };

  const contactCards = [
    {
      icon: MapPin,
      title: "Visit Us",
      content: (
        <>
          Hostivo Hotel & Restaurant
          <br />
          Kenya
        </>
      ),
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+254 700 000 000",
      note: "Available during business hours",
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "info@hostivo.com",
      note: "We usually respond within one business day.",
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
              Get In Touch
            </p>

            <h1
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-7"
            >
              Contact Hostivo
            </h1>

            <p
              data-aos="fade-up"
              data-aos-delay="300"
              className="max-w-2xl text-white/70 text-base md:text-lg leading-relaxed"
            >
              Have a question, need help with a reservation, or want to
              learn more about Hostivo? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-[#C89B3C]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#102A43]/5 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-5">
              {contactCards.map((card, index) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    data-aos="fade-right"
                    data-aos-delay={index * 100}
                    className="group bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#C89B3C]/10 flex items-center justify-center mb-5 group-hover:bg-[#C89B3C] transition-colors duration-300">
                      <Icon
                        size={23}
                        className="text-[#C89B3C] group-hover:text-white transition-colors duration-300"
                      />
                    </div>

                    <h2 className="text-lg font-bold text-[#102A43] mb-2">
                      {card.title}
                    </h2>

                    <p className="text-slate-500 leading-relaxed">
                      {card.content}
                    </p>

                    {card.note && (
                      <p className="text-sm text-slate-400 mt-2">
                        {card.note}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Hours */}
              <div
                data-aos="fade-right"
                data-aos-delay="300"
                className="group bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#C89B3C]/10 flex items-center justify-center mb-5 group-hover:bg-[#C89B3C] transition-colors duration-300">
                  <Clock
                    size={23}
                    className="text-[#C89B3C] group-hover:text-white transition-colors duration-300"
                  />
                </div>

                <h2 className="text-lg font-bold text-[#102A43] mb-4">
                  Opening Hours
                </h2>

                <div className="space-y-3 text-sm text-slate-500">
                  <div className="flex justify-between gap-4 pb-3 border-b border-slate-100">
                    <span>Hotel</span>
                    <span className="font-semibold text-[#102A43]">
                      24 Hours
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Restaurant</span>
                    <span className="font-semibold text-[#102A43]">
                      7 AM — 11 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div
              data-aos="fade-left"
              data-aos-delay="100"
              className="lg:col-span-2 bg-white rounded-3xl p-7 md:p-10 border border-slate-100 shadow-sm"
            >
              {!submitted ? (
                <>
                  <div
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className="mb-9"
                  >
                    <p className="uppercase tracking-[0.2em] text-xs md:text-sm text-[#C89B3C] font-semibold mb-3">
                      Send a Message
                    </p>

                    <h2 className="text-3xl md:text-4xl font-bold text-[#102A43] mb-3">
                      How Can We Help?
                    </h2>

                    <p className="text-slate-500 leading-relaxed">
                      Fill out the form and our team will get back to
                      you as soon as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name + Email */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div
                        data-aos="fade-up"
                        data-aos-delay="250"
                      >
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-semibold text-[#102A43] mb-2"
                        >
                          Full Name
                        </label>

                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 transition-all duration-300"
                        />
                      </div>

                      <div
                        data-aos="fade-up"
                        data-aos-delay="300"
                      >
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-[#102A43] mb-2"
                        >
                          Email Address
                        </label>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Phone + Subject */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div
                        data-aos="fade-up"
                        data-aos-delay="350"
                      >
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-[#102A43] mb-2"
                        >
                          Phone Number
                        </label>

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+254 700 000 000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 transition-all duration-300"
                        />
                      </div>

                      <div
                        data-aos="fade-up"
                        data-aos-delay="400"
                      >
                        <label
                          htmlFor="subject"
                          className="block text-sm font-semibold text-[#102A43] mb-2"
                        >
                          Subject
                        </label>

                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help?"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div
                      data-aos="fade-up"
                      data-aos-delay="450"
                    >
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-[#102A43] mb-2"
                      >
                        Message
                      </label>

                      <textarea
                        id="message"
                        name="message"
                        required
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10 transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      data-aos="fade-up"
                      data-aos-delay="500"
                      className="group bg-[#102A43] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#183b5c] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#102A43]/10"
                    >
                      Send Message
                      <Send
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>
                  </form>
                </>
              ) : (
                /* Confirmation */
                <div
                  data-aos="fade-up"
                  className="min-h-[500px] flex flex-col items-center justify-center text-center px-4"
                >
                  <div className="w-20 h-20 rounded-full bg-[#C89B3C]/10 flex items-center justify-center mb-6">
                    <Send size={32} className="text-[#C89B3C]" />
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-[#102A43] mb-3">
                    Message Sent
                  </h2>

                  <p className="text-slate-500 max-w-md leading-relaxed mb-8">
                    Thank you for contacting Hostivo. Your message
                    has been received and our team will get back to
                    you soon.
                  </p>

                  <button
                    onClick={() => {
                      setSubmitted(false);

                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="border border-[#102A43] text-[#102A43] px-7 py-3 rounded-full font-semibold hover:bg-[#102A43] hover:text-white transition-all duration-300"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map / Location */}
      <section className="pb-20 md:pb-24">
        <div
          data-aos="fade-up"
          className="max-w-7xl mx-auto px-6 lg:px-8"
        >
          <div className="relative overflow-hidden bg-[#102A43] rounded-3xl min-h-[360px] flex items-center justify-center text-center px-6 shadow-xl">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#C89B3C]/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

            <div
              data-aos="fade-up"
              data-aos-delay="150"
              className="relative max-w-xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#C89B3C]/10 flex items-center justify-center mx-auto mb-5">
                <MapPin size={32} className="text-[#C89B3C]" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Find Hostivo
              </h2>

              <p className="text-white/70 leading-relaxed mb-7">
                Our exact location and interactive map will be
                connected here once the hotel's address is finalized.
              </p>

              <Link
                to="/booking"
                className="group inline-flex items-center gap-2 bg-[#C89B3C] text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#b58a32] hover:-translate-y-0.5 transition-all duration-300"
              >
                Book a Room
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;