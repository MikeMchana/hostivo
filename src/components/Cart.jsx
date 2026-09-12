import { useState } from "react";
import OrderForm from "./OrderForm";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
} from "lucide-react";

function Cart({ isOpen, onClose }) {
  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#102A43]/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Cart Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
          <div
            data-aos="fade-right"
            className="flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#102A43] text-[#C89B3C] flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#102A43]">
                Your Order
              </h2>

              <p className="text-sm text-slate-500">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          <button
            data-aos="fade-left"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-[#102A43] hover:bg-slate-100 transition-all duration-200"
            aria-label="Close order cart"
          >
            <X size={21} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="h-[calc(100%-180px)] overflow-y-auto px-5 sm:px-6 py-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div
                data-aos="fade-up"
                className="w-20 h-20 rounded-3xl bg-[#102A43]/5 text-[#102A43] flex items-center justify-center mb-6"
              >
                <ShoppingCart size={32} strokeWidth={1.7} />
              </div>

              <p
                data-aos="fade-up"
                data-aos-delay="100"
                className="uppercase tracking-[0.2em] text-xs font-semibold text-[#C89B3C] mb-2"
              >
                Hostivo Restaurant
              </p>

              <h3
                data-aos="fade-up"
                data-aos-delay="150"
                className="text-xl font-bold text-[#102A43] mb-2"
              >
                Your order is empty
              </h3>

              <p
                data-aos="fade-up"
                data-aos-delay="200"
                className="text-slate-500 text-sm leading-relaxed max-w-xs"
              >
                Add some delicious meals from our menu to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  data-aos="fade-left"
                  data-aos-delay={index * 100}
                  className="pb-5 border-b border-slate-100 last:border-0"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-2xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-[#102A43] truncate">
                            {item.name}
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">
                            KSh {item.price.toLocaleString()} each
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Quantity + Item Total */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-slate-200 rounded-full p-1 bg-slate-50">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-600 hover:bg-white hover:text-[#102A43] transition-all duration-200"
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            <Minus size={13} />
                          </button>

                          <span className="w-8 text-center text-sm font-semibold text-[#102A43]">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-600 hover:bg-white hover:text-[#102A43] transition-all duration-200"
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <span className="font-bold text-[#102A43]">
                          KSh{" "}
                          {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div
            data-aos="fade-up"
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-5 shadow-[0_-8px_30px_rgba(16,42,67,0.06)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-slate-500">Order Total</p>

                <p className="text-xs text-slate-400 mt-0.5">
                  {cart.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}{" "}
                  items
                </p>
              </div>

              <span className="text-2xl font-bold text-[#102A43]">
                KSh {cartTotal.toLocaleString()}
              </span>
            </div>

            <button
              data-aos="fade-up"
              data-aos-delay="100"
              onClick={() => setIsOrderFormOpen(true)}
              className="w-full bg-[#102A43] text-white py-4 rounded-full font-semibold hover:bg-[#183b5c] hover:shadow-lg hover:shadow-[#102A43]/20 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Place Order

              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        )}
      </aside>

      {/* Order Form */}
      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
      />
    </>
  );
}

export default Cart;