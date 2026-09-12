import { useEffect, useState } from "react";
import {
  Building2,
  Bell,
  CreditCard,
  CalendarDays,
  Utensils,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import {
  getSettings,
  updateSettings,
} from "../../services/settings";

const defaultSettings = {
  hotelName: "",
  hotelEmail: "",
  phone: "",
  address: "",
  description: "",

  currency: "",
  timezone: "",
  language: "",

  advanceBooking: "30",
  checkInTime: "14:00",
  checkOutTime: "11:00",
  cancellationPolicy: "24 hours",

  restaurantName: "",
  openingTime: "07:00",
  closingTime: "22:00",

  emailNotifications: true,
  reservationNotifications: true,
  paymentNotifications: true,
  orderNotifications: true,

  mpesaEnabled: true,
  cardEnabled: true,
  cashEnabled: true,
  bankTransferEnabled: true,
};


function mapApiSettingsToState(data) {
  return {
    hotelName: data.hotel_name,
    hotelEmail: data.hotel_email,
    phone: data.phone,
    address: data.address,
    description: data.description,

    currency: data.currency,
    timezone: data.timezone,
    language: data.language,

    advanceBooking: String(data.advance_booking),
    checkInTime: data.check_in_time,
    checkOutTime: data.check_out_time,
    cancellationPolicy: data.cancellation_policy,

    restaurantName: data.restaurant_name,
    openingTime: data.opening_time,
    closingTime: data.closing_time,

    emailNotifications: data.email_notifications,
    reservationNotifications:
      data.reservation_notifications,
    paymentNotifications:
      data.payment_notifications,
    orderNotifications:
      data.order_notifications,

    mpesaEnabled: data.mpesa_enabled,
    cardEnabled: data.card_enabled,
    cashEnabled: data.cash_enabled,
    bankTransferEnabled:
      data.bank_transfer_enabled,
  };
}


function mapStateToApiSettings(settings) {
  return {
    hotel_name: settings.hotelName,
    hotel_email: settings.hotelEmail,
    phone: settings.phone,
    address: settings.address,
    description: settings.description,

    currency: settings.currency,
    timezone: settings.timezone,
    language: settings.language,

    advance_booking: Number(
      settings.advanceBooking
    ),
    check_in_time: settings.checkInTime,
    check_out_time: settings.checkOutTime,
    cancellation_policy:
      settings.cancellationPolicy,

    restaurant_name:
      settings.restaurantName,
    opening_time: settings.openingTime,
    closing_time: settings.closingTime,

    email_notifications:
      settings.emailNotifications,
    reservation_notifications:
      settings.reservationNotifications,
    payment_notifications:
      settings.paymentNotifications,
    order_notifications:
      settings.orderNotifications,

    mpesa_enabled: settings.mpesaEnabled,
    card_enabled: settings.cardEnabled,
    cash_enabled: settings.cashEnabled,
    bank_transfer_enabled:
      settings.bankTransferEnabled,
  };
}


function Settings() {
  const [activeSection, setActiveSection] =
    useState("general");

  const [settings, setSettings] =
    useState(defaultSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);


  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const data = await getSettings();

        setSettings(
          mapApiSettingsToState(data)
        );
      } catch (err) {
        setError(
          err.message ||
            "Failed to load settings"
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);


  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSaved(false);
    setError("");
  };


  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const payload =
        mapStateToApiSettings(settings);

      const updatedSettings =
        await updateSettings(payload);

      setSettings(
        mapApiSettingsToState(
          updatedSettings
        )
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      setError(
        err.message ||
          "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  };


  const sections = [
    {
      id: "general",
      label: "General",
      icon: Building2,
    },
    {
      id: "reservations",
      label: "Reservations",
      icon: CalendarDays,
    },
    {
      id: "restaurant",
      label: "Restaurant",
      icon: Utensils,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
    },
  ];


  const Toggle = ({
    enabled,
    onChange,
  }) => {
    return (
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-pressed={enabled}
        className={`relative h-6 w-11 rounded-full transition ${
          enabled
            ? "bg-[#102A43]"
            : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    );
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#102A43]" />

            <p className="mt-3 text-sm text-gray-500">
              Loading settings...
            </p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{
              color: "#102A43",
            }}
          >
            Settings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your hotel and Hostivo
            system preferences.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            backgroundColor: "#102A43",
          }}
        >
          <Save size={17} />

          {saving
            ? "Saving..."
            : saved
            ? "Saved"
            : "Save Changes"}
        </button>
      </div>


      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* Saved Message */}
      {saved && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <ShieldCheck size={18} />

          Settings have been saved
          successfully.
        </div>
      )}


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Settings Navigation */}
        <div className="h-fit rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="mb-3 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Settings
            </p>
          </div>

          <div className="space-y-1">
            {sections.map(
              (section) => {
                const Icon =
                  section.icon;

                const isActive =
                  activeSection ===
                  section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() =>
                      setActiveSection(
                        section.id
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#102A43] text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={18} />

                    {section.label}
                  </button>
                );
              }
            )}
          </div>
        </div>


        {/* Settings Content */}
        <div className="lg:col-span-3">

          {/* GENERAL */}
          {activeSection ===
            "general" && (
            <div className="space-y-6">

              {/* Hotel Information */}
              <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                      <Building2
                        size={20}
                      />
                    </div>

                    <div>
                      <h2
                        className="font-semibold"
                        style={{
                          color:
                            "#102A43",
                        }}
                      >
                        Hotel Information
                      </h2>

                      <p className="text-sm text-gray-500">
                        Basic information
                        about your hotel.
                      </p>
                    </div>
                  </div>
                </div>


                <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Hotel Name
                    </label>

                    <div className="relative">
                      <Building2
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={
                          settings.hotelName
                        }
                        onChange={(e) =>
                          handleChange(
                            "hotelName",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="email"
                        value={
                          settings.hotelEmail
                        }
                        onChange={(e) =>
                          handleChange(
                            "hotelEmail",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={
                          settings.phone
                        }
                        onChange={(e) =>
                          handleChange(
                            "phone",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Address
                    </label>

                    <div className="relative">
                      <MapPin
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={
                          settings.address
                        }
                        onChange={(e) =>
                          handleChange(
                            "address",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                      />
                    </div>
                  </div>


                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Hotel Description
                    </label>

                    <textarea
                      rows="4"
                      value={
                        settings.description
                      }
                      onChange={(e) =>
                        handleChange(
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                    />
                  </div>
                </div>
              </div>


              {/* Regional Settings */}
              <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600">
                      <Globe
                        size={20}
                      />
                    </div>

                    <div>
                      <h2
                        className="font-semibold"
                        style={{
                          color:
                            "#102A43",
                        }}
                      >
                        Regional Settings
                      </h2>

                      <p className="text-sm text-gray-500">
                        Configure currency,
                        timezone and
                        language.
                      </p>
                    </div>
                  </div>
                </div>


                <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Currency
                    </label>

                    <select
                      value={
                        settings.currency
                      }
                      onChange={(e) =>
                        handleChange(
                          "currency",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                    >
                      <option>
                        KES - Kenyan Shilling
                      </option>
                      <option>
                        USD - US Dollar
                      </option>
                      <option>
                        EUR - Euro
                      </option>
                      <option>
                        GBP - British Pound
                      </option>
                    </select>
                  </div>


                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Timezone
                    </label>

                    <select
                      value={
                        settings.timezone
                      }
                      onChange={(e) =>
                        handleChange(
                          "timezone",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                    >
                      <option>
                        Africa/Nairobi
                      </option>
                      <option>
                        Africa/Kampala
                      </option>
                      <option>
                        Africa/Dar_es_Salaam
                      </option>
                      <option>
                        UTC
                      </option>
                    </select>
                  </div>


                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Language
                    </label>

                    <select
                      value={
                        settings.language
                      }
                      onChange={(e) =>
                        handleChange(
                          "language",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                    >
                      <option>
                        English
                      </option>
                      <option>
                        Swahili
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* RESERVATIONS */}
          {activeSection ===
            "reservations" && (
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                    <CalendarDays
                      size={20}
                    />
                  </div>

                  <div>
                    <h2
                      className="font-semibold"
                      style={{
                        color:
                          "#102A43",
                      }}
                    >
                      Reservation Settings
                    </h2>

                    <p className="text-sm text-gray-500">
                      Configure booking and
                      stay preferences.
                    </p>
                  </div>
                </div>
              </div>


              <div className="space-y-6 p-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Maximum Advance Booking (Days)
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        settings.advanceBooking
                      }
                      onChange={(e) =>
                        handleChange(
                          "advanceBooking",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                    />
                  </div>


                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Cancellation Policy
                    </label>

                    <select
                      value={
                        settings.cancellationPolicy
                      }
                      onChange={(e) =>
                        handleChange(
                          "cancellationPolicy",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                    >
                      <option>
                        24 hours
                      </option>
                      <option>
                        48 hours
                      </option>
                      <option>
                        72 hours
                      </option>
                      <option>
                        7 days
                      </option>
                      <option>
                        Non-refundable
                      </option>
                    </select>
                  </div>


                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Check-in Time
                    </label>

                    <input
                      type="time"
                      value={
                        settings.checkInTime
                      }
                      onChange={(e) =>
                        handleChange(
                          "checkInTime",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                    />
                  </div>


                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Check-out Time
                    </label>

                    <input
                      type="time"
                      value={
                        settings.checkOutTime
                      }
                      onChange={(e) =>
                        handleChange(
                          "checkOutTime",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                    />
                  </div>
                </div>


                <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <div className="flex gap-3">
                    <CalendarDays
                      size={20}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-blue-800">
                        Reservation management
                      </p>

                      <p className="mt-1 text-sm text-blue-700">
                        These settings will
                        be used by Hostivo
                        when processing
                        future reservations
                        and calculating room
                        availability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* RESTAURANT */}
          {activeSection ===
            "restaurant" && (
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-yellow-50 p-2.5 text-yellow-600">
                    <Utensils
                      size={20}
                    />
                  </div>

                  <div>
                    <h2
                      className="font-semibold"
                      style={{
                        color:
                          "#102A43",
                      }}
                    >
                      Restaurant Settings
                    </h2>

                    <p className="text-sm text-gray-500">
                      Configure restaurant
                      information and opening
                      hours.
                    </p>
                  </div>
                </div>
              </div>


              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Restaurant Name
                  </label>

                  <div className="relative">
                    <Utensils
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={
                        settings.restaurantName
                      }
                      onChange={(e) =>
                        handleChange(
                          "restaurantName",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                    />
                  </div>
                </div>


                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Opening Time
                  </label>

                  <input
                    type="time"
                    value={
                      settings.openingTime
                    }
                    onChange={(e) =>
                      handleChange(
                        "openingTime",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>


                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Closing Time
                  </label>

                  <input
                    type="time"
                    value={
                      settings.closingTime
                    }
                    onChange={(e) =>
                      handleChange(
                        "closingTime",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                  />
                </div>
              </div>
            </div>
          )}


          {/* NOTIFICATIONS */}
          {activeSection ===
            "notifications" && (
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600">
                    <Bell size={20} />
                  </div>

                  <div>
                    <h2
                      className="font-semibold"
                      style={{
                        color:
                          "#102A43",
                      }}
                    >
                      Notification Preferences
                    </h2>

                    <p className="text-sm text-gray-500">
                      Choose which events
                      should trigger
                      notifications.
                    </p>
                  </div>
                </div>
              </div>


              <div className="divide-y divide-gray-100">

                <div className="flex items-center justify-between gap-4 p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-gray-50 p-2.5 text-gray-500">
                      <Mail size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Email Notifications
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Receive important
                        system updates by
                        email.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    enabled={
                      settings.emailNotifications
                    }
                    onChange={(value) =>
                      handleChange(
                        "emailNotifications",
                        value
                      )
                    }
                  />
                </div>


                <div className="flex items-center justify-between gap-4 p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-gray-50 p-2.5 text-gray-500">
                      <CalendarDays size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Reservation Notifications
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Get notified when new
                        reservations are
                        created.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    enabled={
                      settings.reservationNotifications
                    }
                    onChange={(value) =>
                      handleChange(
                        "reservationNotifications",
                        value
                      )
                    }
                  />
                </div>


                <div className="flex items-center justify-between gap-4 p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-gray-50 p-2.5 text-gray-500">
                      <CreditCard size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Payment Notifications
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Get notified when
                        payments are
                        received or fail.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    enabled={
                      settings.paymentNotifications
                    }
                    onChange={(value) =>
                      handleChange(
                        "paymentNotifications",
                        value
                      )
                    }
                  />
                </div>


                <div className="flex items-center justify-between gap-4 p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-gray-50 p-2.5 text-gray-500">
                      <Utensils size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Order Notifications
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Get notified when
                        restaurant orders are
                        placed.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    enabled={
                      settings.orderNotifications
                    }
                    onChange={(value) =>
                      handleChange(
                        "orderNotifications",
                        value
                      )
                    }
                  />
                </div>

              </div>
            </div>
          )}


          {/* PAYMENTS */}
          {activeSection ===
            "payments" && (
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-50 p-2.5 text-green-600">
                    <CreditCard
                      size={20}
                    />
                  </div>

                  <div>
                    <h2
                      className="font-semibold"
                      style={{
                        color:
                          "#102A43",
                      }}
                    >
                      Payment Methods
                    </h2>

                    <p className="text-sm text-gray-500">
                      Enable or disable payment
                      methods accepted by your
                      hotel.
                    </p>
                  </div>
                </div>
              </div>


              <div className="divide-y divide-gray-100">

                <div className="flex items-center justify-between gap-4 p-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      M-Pesa
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Accept mobile money
                      payments through M-Pesa.
                    </p>
                  </div>

                  <Toggle
                    enabled={
                      settings.mpesaEnabled
                    }
                    onChange={(value) =>
                      handleChange(
                        "mpesaEnabled",
                        value
                      )
                    }
                  />
                </div>


                <div className="flex items-center justify-between gap-4 p-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Credit / Debit Card
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Accept Visa, Mastercard
                      and other supported cards.
                    </p>
                  </div>

                  <Toggle
                    enabled={
                      settings.cardEnabled
                    }
                    onChange={(value) =>
                      handleChange(
                        "cardEnabled",
                        value
                      )
                    }
                  />
                </div>


                <div className="flex items-center justify-between gap-4 p-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Cash
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Allow staff to record cash
                      payments.
                    </p>
                  </div>

                  <Toggle
                    enabled={
                      settings.cashEnabled
                    }
                    onChange={(value) =>
                      handleChange(
                        "cashEnabled",
                        value
                      )
                    }
                  />
                </div>


                <div className="flex items-center justify-between gap-4 p-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Bank Transfer
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Allow customers to pay
                      through bank transfers.
                    </p>
                  </div>

                  <Toggle
                    enabled={
                      settings.bankTransferEnabled
                    }
                    onChange={(value) =>
                      handleChange(
                        "bankTransferEnabled",
                        value
                      )
                    }
                  />
                </div>

              </div>


              <div className="border-t border-gray-100 p-6">
                <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4">
                  <div className="flex gap-3">
                    <CreditCard
                      size={20}
                      className="mt-0.5 shrink-0 text-yellow-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-yellow-800">
                        Payment integration
                      </p>

                      <p className="mt-1 text-sm text-yellow-700">
                        These switches control
                        which payment methods
                        Hostivo accepts. Actual
                        M-Pesa, card and bank
                        integrations will be
                        configured separately when
                        the payment services are
                        implemented.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Bottom Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor:
                  "#102A43",
              }}
            >
              <Save size={17} />

              {saving
                ? "Saving..."
                : saved
                ? "Saved"
                : "Save Changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;