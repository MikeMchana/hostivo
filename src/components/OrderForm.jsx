import { useState } from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ShoppingBag,
  User,
  Phone,
  Hotel,
  Utensils,
  MapPin,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { apiRequest } from "../services/api";

function OrderForm({ isOpen, onClose }) {
  const { cart, cartTotal, clearCart } = useCart();

  const [orderType, setOrderType] = useState("Room Service");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    roomNumber: "",
    tableNumber: "",
    instructions: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      /*
       * Find the selected table if this is a dine-in order.
       * The current backend expects a table ID, not just the table number.
       *
       * For now we leave table_id null and keep the customer's
       * table number in the order flow for later enhancement.
       */

      const items = cart.map((item) => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: Number(item.price),
        subtotal: Number(item.price) * item.quantity,
      }));

      await apiRequest(
        "/orders/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            customer_name: formData.name,
            customer_phone: formData.phone,
            order_type: orderType,
            room_number:
              orderType === "Room Service"
                ? formData.roomNumber
                : null,
            table_number:
              orderType === "Dine In"
                ? formData.tableNumber
                : null,
            special_instructions: formData.instructions || null,
            total_amount: Number(cartTotal),
            items,
          }),
        },
        "Unable to place your order."
      );

      clearCart();
      setSubmitted(true);
    } catch (err) {
      setError(
        err.message || "Unable to place your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[60] bg-[#102A43]/60 backdrop-blur-sm flex items-center justify-center px-5 py-8 overflow-y-auto">
        <div
          className="relative bg-white rounded-[2rem] max-w-md w-full p-7 md:p-9 text-center shadow-2xl border border-white/20"
          data-aos="zoom-in"
          data-aos-duration="600"
        >
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#C89B3C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div
              className="w-20 h-20 mx-auto bg-[#C89B3C]/10 text-[#C89B3C] rounded-3xl flex items-center justify-center mb-6"
              data-aos="zoom-in"
              data-aos-delay="150"
            >
              <CheckCircle size={40} strokeWidth={1.8} />
            </div>

            <p
              className="uppercase tracking-[0.2em] text-xs font-semibold text-[#C89B3C] mb-3"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Hostivo Restaurant
            </p>

            <h2
              className="text-3xl font-bold text-[#102A43] mb-3"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              Order Received!
            </h2>

            <p
              className="text-slate-600 leading-relaxed mb-7"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              Thank you, {formData.name || "Guest"}. Your order has been
              received and is being prepared.
            </p>

            <div
              className="bg-slate-50 rounded-2xl p-5 mb-7 border border-slate-100 text-left"
              data-aos="fade-up"
              data-aos-delay="350"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#102A43] text-[#C89B3C] flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>

                <div>
                  <p className="font-semibold text-[#102A43]">
                    Order Summary
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Your order is being prepared
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-slate-500">Order Type</span>

                  <span className="font-semibold text-[#102A43] text-right">
                    {orderType}
                  </span>
                </div>

                <div className="h-px bg-slate-200" />

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Total</span>

                  <span className="font-bold text-[#102A43]">
                    KSh {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              data-aos="fade-up"
              data-aos-delay="400"
              className="w-full bg-[#102A43] text-white py-4 rounded-full font-semibold hover:bg-[#183b5c] hover:shadow-lg hover:shadow-[#102A43]/20 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Done

              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[#102A43]/60 backdrop-blur-sm flex items-center justify-center px-5 py-8 overflow-y-auto">
      <div
        className="relative bg-white rounded-[2rem] max-w-lg w-full shadow-2xl overflow-hidden"
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        {/* Header */}
        <div className="relative bg-[#102A43] text-white px-6 md:px-7 py-6 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#C89B3C]/10 rounded-full blur-3xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div data-aos="fade-right" data-aos-delay="100">
              <p className="uppercase tracking-[0.2em] text-[10px] text-[#C89B3C] font-semibold mb-2">
                Hostivo Restaurant
              </p>

              <h2 className="text-2xl font-bold">
                Order Details
              </h2>

              <p className="text-sm text-white/65 mt-1">
                Tell us where to deliver your order.
              </p>
            </div>

            <button
              onClick={onClose}
              disabled={isSubmitting}
              data-aos="fade-left"
              data-aos-delay="100"
              className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
              aria-label="Close order form"
            >
              <X size={21} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 md:px-7 py-6 space-y-5"
        >
          {/* Error */}
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3.5 text-sm leading-relaxed"
              data-aos="fade-up"
            >
              {error}
            </div>
          )}

          {/* Customer Information */}
          <div
            className="flex items-center gap-3 mb-1"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="w-9 h-9 rounded-xl bg-[#102A43]/5 text-[#102A43] flex items-center justify-center">
              <User size={17} />
            </div>

            <div>
              <h3 className="font-bold text-[#102A43]">
                Customer Information
              </h3>

              <p className="text-xs text-slate-400">
                How can we reach you?
              </p>
            </div>
          </div>

          {/* Name */}
          <div data-aos="fade-up" data-aos-delay="150">
            <label className="block text-sm font-semibold text-[#102A43] mb-2">
              Full Name
            </label>

            <div className="relative">
              <User
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="Enter your name"
                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-white outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Phone */}
          <div data-aos="fade-up" data-aos-delay="200">
            <label className="block text-sm font-semibold text-[#102A43] mb-2">
              Phone Number
            </label>

            <div className="relative">
              <Phone
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                placeholder="e.g. 0712 345 678"
                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-white outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Order Type */}
          <div data-aos="fade-up" data-aos-delay="250">
            <label className="block text-sm font-semibold text-[#102A43] mb-2">
              Order Type
            </label>

            <div className="relative">
              <Utensils
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />

              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                disabled={isSubmitting}
                className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-white text-slate-700 outline-none transition-all duration-200 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 disabled:bg-slate-100 appearance-none"
              >
                <option>Room Service</option>
                <option>Dine In</option>
                <option>Takeaway</option>
              </select>
            </div>
          </div>

          {/* Room Number */}
          {orderType === "Room Service" && (
            <div data-aos="fade-up" data-aos-delay="300">
              <label className="block text-sm font-semibold text-[#102A43] mb-2">
                Room Number
              </label>

              <div className="relative">
                <Hotel
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />

                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="e.g. 204"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-white outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 disabled:bg-slate-100"
                />
              </div>
            </div>
          )}

          {/* Table Number */}
          {orderType === "Dine In" && (
            <div data-aos="fade-up" data-aos-delay="300">
              <label className="block text-sm font-semibold text-[#102A43] mb-2">
                Table Number
              </label>

              <div className="relative">
                <MapPin
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />

                <input
                  type="text"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  placeholder="e.g. 12"
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 bg-white outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 disabled:bg-slate-100"
                />
              </div>
            </div>
          )}

          {/* Instructions */}
          <div data-aos="fade-up" data-aos-delay="350">
            <label className="block text-sm font-semibold text-[#102A43] mb-2">
              Special Instructions
            </label>

            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="3"
              disabled={isSubmitting}
              placeholder="Any special requests?"
              className="w-full border border-slate-200 rounded-xl px-4 py-3.5 bg-white outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#C89B3C] focus:ring-4 focus:ring-[#C89B3C]/10 resize-none disabled:bg-slate-100"
            />
          </div>

          {/* Order Summary */}
          <div
            className="bg-slate-50 rounded-2xl p-5 border border-slate-100"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#102A43] text-[#C89B3C] flex items-center justify-center">
                <ShoppingBag size={17} />
              </div>

              <div>
                <p className="font-semibold text-[#102A43]">
                  Order Summary
                </p>

                <p className="text-xs text-slate-400">
                  {cart.length}{" "}
                  {cart.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-200 mb-4" />

            <div className="flex justify-between items-center">
              <span className="text-slate-600">
                Order Total
              </span>

              <span className="text-xl font-bold text-[#102A43]">
                KSh {cartTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div
            className="flex gap-3 pt-1"
            data-aos="fade-up"
            data-aos-delay="450"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border border-slate-200 text-[#102A43] py-3.5 rounded-full font-semibold hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ArrowLeft size={17} />
              Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] bg-[#102A43] text-white py-3.5 rounded-full font-semibold hover:bg-[#183b5c] hover:shadow-lg hover:shadow-[#102A43]/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  Confirm Order
                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;