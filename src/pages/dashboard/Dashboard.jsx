import {
  BedDouble,
  Users,
  CalendarCheck,
  Banknote,
  ArrowUpRight,
  Clock,
  ShoppingBag,
} from "lucide-react";

const dashboardData = {
  statistics: {
    rooms: 24,
    guests: 38,
    reservations: 12,
    sales: 184500,
  },

  reservations: [
    {
      id: "#RES-1024",
      guest: "James Mwangi",
      room: "Deluxe Room",
      checkIn: "Today",
      checkOut: "Sep 12",
      status: "Checked In",
    },
    {
      id: "#RES-1023",
      guest: "Sarah Wanjiku",
      room: "Executive Room",
      checkIn: "Today",
      checkOut: "Sep 14",
      status: "Confirmed",
    },
    {
      id: "#RES-1022",
      guest: "Daniel Otieno",
      room: "Luxury Suite",
      checkIn: "Tomorrow",
      checkOut: "Sep 16",
      status: "Confirmed",
    },
    {
      id: "#RES-1021",
      guest: "Grace Akinyi",
      room: "Deluxe Room",
      checkIn: "Tomorrow",
      checkOut: "Sep 13",
      status: "Pending",
    },
  ],

  orders: [
    {
      id: "#ORD-5012",
      customer: "James Mwangi",
      items: "Grilled Chicken × 2",
      total: 2400,
      status: "Preparing",
    },
    {
      id: "#ORD-5011",
      customer: "Sarah Wanjiku",
      items: "English Breakfast × 1",
      total: 850,
      status: "Ready",
    },
    {
      id: "#ORD-5010",
      customer: "Room 204",
      items: "Beef Steak × 1",
      total: 1800,
      status: "Delivered",
    },
    {
      id: "#ORD-5009",
      customer: "Table 6",
      items: "Fresh Tropical Juice × 3",
      total: 1050,
      status: "Delivered",
    },
  ],

  roomStatus: {
    available: 8,
    occupied: 12,
    cleaning: 3,
    maintenance: 1,
  },

  revenue: [
    { day: "Mon", amount: 42000 },
    { day: "Tue", amount: 55000 },
    { day: "Wed", amount: 38000 },
    { day: "Thu", amount: 62000 },
    { day: "Fri", amount: 71000 },
    { day: "Sat", amount: 84000 },
    { day: "Sun", amount: 69000 },
  ],
};

const statistics = [
  {
    title: "Total Rooms",
    value: dashboardData.statistics.rooms,
    description: "Hotel rooms",
    icon: BedDouble,
  },
  {
    title: "Current Guests",
    value: dashboardData.statistics.guests,
    description: "Currently staying",
    icon: Users,
  },
  {
    title: "Reservations",
    value: dashboardData.statistics.reservations,
    description: "Active reservations",
    icon: CalendarCheck,
  },
  {
    title: "Today's Sales",
    value: `KSh ${dashboardData.statistics.sales.toLocaleString()}`,
    description: "Rooms & restaurant",
    icon: Banknote,
  },
];

function getStatusClass(status) {
  switch (status) {
    case "Checked In":
      return "bg-green-100 text-green-700";

    case "Confirmed":
      return "bg-blue-100 text-blue-700";

    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Preparing":
      return "bg-yellow-100 text-yellow-700";

    case "Ready":
      return "bg-blue-100 text-blue-700";

    case "Delivered":
      return "bg-green-100 text-green-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function Dashboard() {
  const maxRevenue = Math.max(
    ...dashboardData.revenue.map((item) => item.amount)
  );

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[#C89B3C] font-semibold mb-2">
          Overview
        </p>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#102A43]">
              Good morning, Admin
            </h1>

            <p className="text-slate-500 mt-2">
              Here's what's happening at Hostivo today.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock size={17} />
            <span>Last updated just now</span>
          </div>

        </div>
      </div>

      {/* Statistics */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>

                  <p className="text-2xl font-bold text-[#102A43] mt-2">
                    {stat.value}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    {stat.description}
                  </p>
                </div>

                <div className="w-11 h-11 rounded-xl bg-[#C89B3C]/10 text-[#C89B3C] flex items-center justify-center">
                  <Icon size={21} />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Revenue + Room Status */}
      <div className="grid xl:grid-cols-[1fr_360px] gap-6 mb-8">

        {/* Revenue */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

          <div className="flex items-center justify-between mb-8">

            <div>
              <h2 className="text-lg font-bold text-[#102A43]">
                Revenue Overview
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Revenue generated over the past 7 days
              </p>
            </div>

            <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
              <ArrowUpRight size={17} />
              12.5%
            </div>

          </div>

          {/* Chart */}
          <div className="h-64 flex items-end gap-3 sm:gap-5">

            {dashboardData.revenue.map((item) => {

              const height = Math.max(
                15,
                (item.amount / maxRevenue) * 100
              );

              return (
                <div
                  key={item.day}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-3"
                >

                  <div className="w-full flex justify-center items-end h-full">

                    <div
                      className="w-full max-w-10 bg-[#102A43] rounded-t-lg hover:bg-[#C89B3C] transition"
                      style={{
                        height: `${height}%`,
                      }}
                      title={`KSh ${item.amount.toLocaleString()}`}
                    />

                  </div>

                  <span className="text-xs text-slate-400">
                    {item.day}
                  </span>

                </div>
              );
            })}

          </div>

        </section>

        {/* Room Status */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-[#102A43]">
              Room Status
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Current room availability
            </p>
          </div>

          <div className="space-y-5">

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">
                  Available
                </span>

                <span className="text-sm font-semibold text-[#102A43]">
                  {dashboardData.roomStatus.available}
                </span>
              </div>

              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${
                      (dashboardData.roomStatus.available / 24) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">
                  Occupied
                </span>

                <span className="text-sm font-semibold text-[#102A43]">
                  {dashboardData.roomStatus.occupied}
                </span>
              </div>

              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#102A43] rounded-full"
                  style={{
                    width: `${
                      (dashboardData.roomStatus.occupied / 24) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">
                  Cleaning
                </span>

                <span className="text-sm font-semibold text-[#102A43]">
                  {dashboardData.roomStatus.cleaning}
                </span>
              </div>

              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{
                    width: `${
                      (dashboardData.roomStatus.cleaning / 24) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">
                  Maintenance
                </span>

                <span className="text-sm font-semibold text-[#102A43]">
                  {dashboardData.roomStatus.maintenance}
                </span>
              </div>

              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${
                      (dashboardData.roomStatus.maintenance / 24) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

          </div>

          <div className="mt-7 pt-5 border-t border-slate-100">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">
                Occupancy Rate
              </span>

              <span className="font-bold text-[#102A43]">
                {Math.round(
                  (dashboardData.roomStatus.occupied / 24) * 100
                )}
                %
              </span>
            </div>
          </div>

        </section>

      </div>

      {/* Reservations + Orders */}
      <div className="grid xl:grid-cols-2 gap-6">

        {/* Reservations */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm">

          <div className="flex items-center justify-between p-6 border-b border-slate-100">

            <div>
              <h2 className="text-lg font-bold text-[#102A43]">
                Today's Reservations
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest guest reservations
              </p>
            </div>

            <CalendarCheck
              size={21}
              className="text-[#C89B3C]"
            />

          </div>

          <div className="divide-y divide-slate-100">

            {dashboardData.reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="p-5 flex items-center justify-between gap-4"
              >

                <div className="min-w-0">

                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-[#102A43] truncate">
                      {reservation.guest}
                    </h3>

                    <span className="text-xs text-slate-400">
                      {reservation.id}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500">
                    {reservation.room}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {reservation.checkIn} → {reservation.checkOut}
                  </p>

                </div>

                <span
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusClass(
                    reservation.status
                  )}`}
                >
                  {reservation.status}
                </span>

              </div>
            ))}

          </div>

        </section>

        {/* Orders */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm">

          <div className="flex items-center justify-between p-6 border-b border-slate-100">

            <div>
              <h2 className="text-lg font-bold text-[#102A43]">
                Recent Orders
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest restaurant orders
              </p>
            </div>

            <ShoppingBag
              size={21}
              className="text-[#C89B3C]"
            />

          </div>

          <div className="divide-y divide-slate-100">

            {dashboardData.orders.map((order) => (
              <div
                key={order.id}
                className="p-5 flex items-center justify-between gap-4"
              >

                <div className="min-w-0">

                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-[#102A43]">
                      {order.customer}
                    </h3>

                    <span className="text-xs text-slate-400">
                      {order.id}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 truncate">
                    {order.items}
                  </p>

                  <p className="text-sm font-semibold text-[#102A43] mt-1">
                    KSh {order.total.toLocaleString()}
                  </p>

                </div>

                <span
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

              </div>
            ))}

          </div>

        </section>

      </div>

    </div>
  );
}

export default Dashboard;